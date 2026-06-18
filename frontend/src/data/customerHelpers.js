import { DEFAULT_OVERDUE_DAYS } from './mockData';

function toLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isBillOverdue(bill, referenceDate = new Date()) {
  const outstanding = bill.amount - bill.paid;
  if (outstanding <= 0) return false;
  return bill.dueDate < toLocalDateString(referenceDate);
}

export function renameCustomerReferences(oldName, newName, { bills: billList, cashIn: paymentList, cheques: chequeList }) {
  return {
    bills: billList.map((bill) =>
      bill.customer === oldName ? { ...bill, customer: newName } : bill,
    ),
    cashIn: paymentList.map((payment) =>
      payment.customer === oldName ? { ...payment, customer: newName } : payment,
    ),
    cheques: chequeList.map((cheque) =>
      cheque.customer === oldName ? { ...cheque, customer: newName } : cheque,
    ),
  };
}

export function getCustomerById(id, customerList) {
  return customerList.find((customer) => customer.id === Number(id));
}

export function getCustomerByName(name, customerList) {
  return customerList.find((customer) => customer.name === name);
}

export function getCustomerOverdueDays(customerOrName, customerList) {
  const customer =
    typeof customerOrName === 'string'
      ? getCustomerByName(customerOrName, customerList)
      : customerOrName;
  return customer?.overdueDays ?? DEFAULT_OVERDUE_DAYS;
}

export function addDaysToDate(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getCustomerBills(customerName, billList) {
  return billList.filter((bill) => bill.customer === customerName);
}

export function getCustomerPayments(customerName, paymentList) {
  return paymentList.filter((payment) => payment.customer === customerName);
}

export function getCustomerCheques(customerName, chequeList) {
  return chequeList.filter((cheque) => cheque.customer === customerName);
}

export function buildCustomerLedger(customerOrName, { bills: billList, cashIn: paymentList, cheques: chequeList }) {
  const customerName = typeof customerOrName === 'string' ? customerOrName : customerOrName.name;
  const startingBalance =
    typeof customerOrName === 'string'
      ? 0
      : Number(customerOrName.startingBalance ?? customerOrName.balance ?? 0);

  const customerBills = getCustomerBills(customerName, billList);
  const customerPayments = getCustomerPayments(customerName, paymentList);
  const customerCheques = getCustomerCheques(customerName, chequeList);

  const paymentRefs = new Set(
    customerPayments.map((payment) => payment.reference?.toLowerCase()).filter(Boolean),
  );

  const entries = [
    ...customerBills.map((bill) => ({
      date: bill.date,
      ref: bill.id,
      particulars: 'Credit bill issued',
      debit: bill.amount,
      credit: 0,
      type: 'bill',
    })),
    ...customerPayments.map((payment) => ({
      date: payment.date,
      ref: payment.id,
      particulars: `Payment received — ${payment.method}${payment.reference ? ` (${payment.reference})` : ''}`,
      debit: 0,
      credit: payment.amount,
      type: 'payment',
    })),
    ...customerCheques
      .filter((cheque) => !paymentRefs.has(cheque.id.toLowerCase()))
      .map((cheque) => ({
        date: cheque.receivedDate,
        ref: cheque.id,
        particulars: `Cheque received — ${cheque.bank} #${cheque.chequeNo}`,
        debit: 0,
        credit: cheque.amount,
        type: 'cheque',
      })),
  ];

  entries.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const typeOrder = { bill: 0, cheque: 1, payment: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  let balance = startingBalance;
  const ledger = [];

  if (startingBalance > 0) {
    ledger.push({
      date: '—',
      ref: 'OPEN',
      particulars: 'Opening balance (bills to pay)',
      debit: startingBalance,
      credit: 0,
      type: 'opening',
      balance: startingBalance,
    });
  }

  entries.forEach((entry) => {
    balance += entry.debit - entry.credit;
    ledger.push({ ...entry, balance });
  });

  return ledger;
}

export function getCustomerClosingBalance(customer, collections) {
  const ledger = buildCustomerLedger(customer, collections);
  if (ledger.length) return ledger[ledger.length - 1].balance;
  return Number(customer.startingBalance ?? customer.balance ?? 0);
}

export function getOverdueBills(billList, referenceDate = new Date()) {
  return billList.filter((bill) => isBillOverdue(bill, referenceDate));
}

export function computeOverdueByCustomer(billList, referenceDate = new Date()) {
  const overdueBills = getOverdueBills(billList, referenceDate);
  const byCustomer = new Map();

  overdueBills.forEach((bill) => {
    const balance = bill.amount - bill.paid;
    const existing = byCustomer.get(bill.customer) || {
      customer: bill.customer,
      billCount: 0,
      totalOverdue: 0,
      oldestDueDate: bill.dueDate,
    };

    existing.billCount += 1;
    existing.totalOverdue += balance;
    if (bill.dueDate < existing.oldestDueDate) {
      existing.oldestDueDate = bill.dueDate;
    }

    byCustomer.set(bill.customer, existing);
  });

  return Array.from(byCustomer.values()).sort((a, b) => b.totalOverdue - a.totalOverdue);
}

export { DEFAULT_OVERDUE_DAYS };
