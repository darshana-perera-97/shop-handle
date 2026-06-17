import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CustomerSearchSelect from '../components/CustomerSearchSelect';
import { formatCurrency } from '../data/mockData';
import useAppData from '../context/AppDataContext';
import { useCustomers } from '../context/CustomersContext';

function getNextPaymentId(list) {
  const nums = list.map((payment) => parseInt(payment.id.replace('P-', ''), 10));
  const max = Math.max(...nums, 301);
  return `P-${max + 1}`;
}

function createEmptyCheque() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: '',
    chequeNo: '',
    amount: '',
    conversionDate: '',
  };
}

function getPaymentMethod(cashAmount, chequeTotal) {
  if (cashAmount > 0 && chequeTotal > 0) return 'Mixed';
  if (chequeTotal > 0) return 'Cheque';
  return 'Cash';
}

function getPaymentReference(cheques, remarks) {
  const chequeRefs = cheques
    .map((cheque) => cheque.chequeNo.trim())
    .filter(Boolean)
    .join(', ');

  if (chequeRefs && remarks) return `${chequeRefs} — ${remarks}`;
  return chequeRefs || remarks || '—';
}

export default function CashInPage() {
  const { customerList } = useCustomers();
  const { paymentList, setPaymentList } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [chequeRows, setChequeRows] = useState([createEmptyCheque()]);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!showForm) {
      setSelectedCustomer('');
      setPaymentDate('');
      setCashAmount('');
      setChequeRows([createEmptyCheque()]);
      setRemarks('');
      setFormError('');
      return;
    }

    setPaymentDate(new Date().toISOString().slice(0, 10));
  }, [showForm]);

  const chequeTotal = useMemo(
    () =>
      chequeRows.reduce((sum, cheque) => {
        const amount = Number(cheque.amount);
        return sum + (Number.isNaN(amount) ? 0 : amount);
      }, 0),
    [chequeRows],
  );

  const cashValue = cashAmount === '' ? 0 : Number(cashAmount);
  const totalAmount = (Number.isNaN(cashValue) ? 0 : cashValue) + chequeTotal;

  const totalReceived = paymentList.reduce((sum, payment) => sum + payment.amount, 0);

  const columns = [
    { key: 'id', label: 'Payment No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <span className="font-semibold text-doc-teal">{formatCurrency(row.amount)}</span>
      ),
    },
    { key: 'method', label: 'Method' },
    { key: 'reference', label: 'Reference' },
  ];

  function updateChequeRow(id, field, value) {
    setChequeRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setFormError('');
  }

  function addChequeRow() {
    setChequeRows((rows) => [...rows, createEmptyCheque()]);
  }

  function removeChequeRow(id) {
    setChequeRows((rows) => (rows.length === 1 ? rows : rows.filter((row) => row.id !== id)));
  }

  function handleRecordPayment(e) {
    e.preventDefault();
    setFormError('');

    if (!selectedCustomer) {
      setFormError('Select a customer.');
      return;
    }

    if (!paymentDate) {
      setFormError('Enter a payment date.');
      return;
    }

    const parsedCash = cashAmount === '' ? 0 : Number(cashAmount);
    if (cashAmount !== '' && (Number.isNaN(parsedCash) || parsedCash < 0)) {
      setFormError('Enter a valid cash amount.');
      return;
    }

    const filledCheques = chequeRows.filter(
      (cheque) =>
        cheque.date || cheque.chequeNo.trim() || cheque.amount || cheque.conversionDate,
    );

    for (const cheque of filledCheques) {
      if (!cheque.date || !cheque.chequeNo.trim() || !cheque.amount || !cheque.conversionDate) {
        setFormError('Complete all fields for each cheque, or remove empty cheque rows.');
        return;
      }

      const amount = Number(cheque.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        setFormError('Enter a valid amount for each cheque.');
        return;
      }
    }

    if (totalAmount <= 0) {
      setFormError('Enter a cash amount and/or at least one cheque.');
      return;
    }

    const newPayment = {
      id: getNextPaymentId(paymentList),
      customer: selectedCustomer,
      date: paymentDate,
      amount: totalAmount,
      method: getPaymentMethod(parsedCash, chequeTotal),
      reference: getPaymentReference(filledCheques, remarks.trim()),
      cashAmount: parsedCash,
      cheques: filledCheques.map((cheque) => ({
        date: cheque.date,
        chequeNo: cheque.chequeNo.trim(),
        amount: Number(cheque.amount),
        conversionDate: cheque.conversionDate,
      })),
      remarks: remarks.trim(),
    };

    setPaymentList([newPayment, ...paymentList]);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cash In"
        subtitle="Record and view all customer payments"
        action={
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Record payment
          </button>
        }
      />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Record payment" wide>
        <form onSubmit={handleRecordPayment}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Customer</span>
              <CustomerSearchSelect
                name="customer"
                customers={customerList}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                required
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Date</span>
              <input
                name="date"
                type="date"
                required
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Cash amount (LKR)</span>
              <input
                name="cashAmount"
                type="number"
                min="0"
                step="0.01"
                value={cashAmount}
                onChange={(event) => {
                  setCashAmount(event.target.value);
                  setFormError('');
                }}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="0.00"
              />
            </label>

            <div className="flex flex-col gap-3 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-doc-navy">Cheques</span>
                <button
                  type="button"
                  onClick={addChequeRow}
                  className="rounded-xl border border-doc-primary bg-doc-primary-light px-3 py-1.5 text-xs font-semibold text-doc-primary transition hover:bg-doc-primary/10"
                >
                  Add cheque
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {chequeRows.map((cheque, index) => (
                  <div
                    key={cheque.id}
                    className="rounded-2xl border border-doc-border bg-doc-primary-light/20 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-doc-muted">
                        Cheque {index + 1}
                      </span>
                      {chequeRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChequeRow(cheque.id)}
                          className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-doc-navy">Date</span>
                        <input
                          type="date"
                          value={cheque.date}
                          onChange={(event) => updateChequeRow(cheque.id, 'date', event.target.value)}
                          className="rounded-xl border border-doc-border bg-white px-3 py-2 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-doc-navy">Cheque number</span>
                        <input
                          type="text"
                          value={cheque.chequeNo}
                          onChange={(event) =>
                            updateChequeRow(cheque.id, 'chequeNo', event.target.value)
                          }
                          className="rounded-xl border border-doc-border bg-white px-3 py-2 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                          placeholder="e.g. 452189"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-doc-navy">Amount (LKR)</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={cheque.amount}
                          onChange={(event) =>
                            updateChequeRow(cheque.id, 'amount', event.target.value)
                          }
                          className="rounded-xl border border-doc-border bg-white px-3 py-2 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                          placeholder="0.00"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-doc-navy">Conversion date</span>
                        <input
                          type="date"
                          value={cheque.conversionDate}
                          onChange={(event) =>
                            updateChequeRow(cheque.id, 'conversionDate', event.target.value)
                          }
                          className="rounded-xl border border-doc-border bg-white px-3 py-2 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-doc-border bg-white px-4 py-3 sm:col-span-2">
              <p className="text-sm font-medium text-doc-muted">Total amount</p>
              <p className="mt-1 text-xl font-bold text-doc-teal">{formatCurrency(totalAmount)}</p>
              {(cashValue > 0 || chequeTotal > 0) && (
                <p className="mt-1 text-xs text-doc-muted">
                  Cash {formatCurrency(cashValue || 0)}
                  {chequeTotal > 0 ? ` + Cheques ${formatCurrency(chequeTotal)}` : ''}
                </p>
              )}
            </div>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Remarks</span>
              <textarea
                name="remarks"
                rows={3}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                className="resize-none rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Optional notes about this payment"
              />
            </label>
          </div>

          {formError && (
            <p className="mt-4 text-sm font-medium text-red-600" role="alert">
              {formError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-2xl border-2 border-doc-primary bg-white px-5 py-2.5 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
            >
              Save payment
            </button>
          </div>
        </form>
      </Modal>

      <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
        <p className="text-sm font-medium text-doc-muted">Total received (shown records)</p>
        <p className="mt-1 text-2xl font-bold text-doc-teal">{formatCurrency(totalReceived)}</p>
      </div>

      <DataTable columns={columns} data={paymentList} emptyMessage="No payments recorded yet." />
    </div>
  );
}
