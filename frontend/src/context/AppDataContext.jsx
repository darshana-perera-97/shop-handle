import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, fetchCollection, saveCollection } from '../api/client';
import { renameCustomerReferences } from '../data/customerHelpers';
import { DEFAULT_OVERDUE_DAYS } from '../data/mockData';

const AppDataContext = createContext(null);

function normalizeCustomers(customers) {
  return customers.map((customer) => ({
    ...customer,
    startingBalance: customer.startingBalance ?? customer.balance ?? 0,
  }));
}

export function AppDataProvider({ children }) {
  const [customerList, setCustomerList] = useState([]);
  const [billList, setBillList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [chequeList, setChequeList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [customers, bills, cashIn, cheques, users] = await Promise.all(
          COLLECTIONS.map((collection) => fetchCollection(collection)),
        );

        if (cancelled) return;

        setCustomerList(normalizeCustomers(customers));
        setBillList(bills);
        setPaymentList(cashIn);
        setChequeList(cheques);
        setUserList(users);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          readyRef.current = true;
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    saveCollection('customers', customerList).catch((saveError) => {
      setError(saveError.message);
    });
  }, [customerList]);

  useEffect(() => {
    if (!readyRef.current) return;
    saveCollection('bills', billList).catch((saveError) => {
      setError(saveError.message);
    });
  }, [billList]);

  useEffect(() => {
    if (!readyRef.current) return;
    saveCollection('cashIn', paymentList).catch((saveError) => {
      setError(saveError.message);
    });
  }, [paymentList]);

  useEffect(() => {
    if (!readyRef.current) return;
    saveCollection('cheques', chequeList).catch((saveError) => {
      setError(saveError.message);
    });
  }, [chequeList]);

  useEffect(() => {
    if (!readyRef.current) return;
    saveCollection('users', userList).catch((saveError) => {
      setError(saveError.message);
    });
  }, [userList]);

  function getCustomerById(id) {
    return customerList.find((customer) => customer.id === Number(id));
  }

  function addCustomer(customer) {
    setCustomerList((prev) => [...prev, customer]);
  }

  function updateCustomer(id, updates) {
    const customer = customerList.find((item) => item.id === Number(id));
    if (!customer) return;

    const oldName = customer.name;
    if (updates.name && updates.name !== oldName) {
      const renamed = renameCustomerReferences(oldName, updates.name, {
        bills: billList,
        cashIn: paymentList,
        cheques: chequeList,
      });
      setBillList(renamed.bills);
      setPaymentList(renamed.cashIn);
      setChequeList(renamed.cheques);
    }

    setCustomerList((prev) =>
      prev.map((item) => (item.id === Number(id) ? { ...item, ...updates } : item)),
    );
  }

  function getNextCustomerId() {
    const maxId = customerList.reduce((max, customer) => Math.max(max, customer.id), 0);
    return maxId + 1;
  }

  function removeUser(id) {
    setUserList((prev) => prev.filter((user) => user.id !== Number(id)));
  }

  const collections = { bills: billList, cashIn: paymentList, cheques: chequeList };

  return (
    <AppDataContext.Provider
      value={{
        loading,
        error,
        customerList,
        billList,
        paymentList,
        chequeList,
        userList,
        collections,
        addCustomer,
        updateCustomer,
        getCustomerById,
        getNextCustomerId,
        removeUser,
        setBillList,
        setPaymentList,
        setChequeList,
        setUserList,
        defaultOverdueDays: DEFAULT_OVERDUE_DAYS,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export default function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

export function useCustomers() {
  const {
    customerList,
    addCustomer,
    updateCustomer,
    getCustomerById,
    getNextCustomerId,
    defaultOverdueDays,
    loading,
    error,
  } = useAppData();

  return {
    customerList,
    addCustomer,
    updateCustomer,
    getCustomerById,
    getNextCustomerId,
    defaultOverdueDays,
    loading,
    error,
  };
}
