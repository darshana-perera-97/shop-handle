import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CustomerSearchSelect from '../components/CustomerSearchSelect';
import StatusBadge from '../components/StatusBadge';
import { addDaysToDate, getCustomerOverdueDays } from '../data/customerHelpers';
import { DEFAULT_OVERDUE_DAYS, formatCurrency } from '../data/mockData';
import useAppData from '../context/AppDataContext';
import { useCustomers } from '../context/CustomersContext';

function getNextBillId(list) {
  const nums = list.map((bill) => parseInt(bill.id.replace('B-', ''), 10));
  const max = Math.max(...nums, 1041);
  return `B-${max + 1}`;
}

const paymentStatusOptions = [
  { value: 'not-paid', label: 'Not paid' },
  { value: 'partially-paid', label: 'Partially paid' },
  { value: 'fully-paid', label: 'Fully paid' },
];

function getBillPayment(amount, paymentStatus, paidAmount) {
  if (paymentStatus === 'fully-paid') {
    return { paid: amount, status: 'paid' };
  }

  if (paymentStatus === 'partially-paid') {
    return { paid: paidAmount, status: 'partial' };
  }

  return { paid: 0, status: 'pending' };
}

export default function BillsPage() {
  const { customerList } = useCustomers();
  const { billList, setBillList } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [suggestedBillId, setSuggestedBillId] = useState('');
  const [formError, setFormError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('not-paid');
  const [paidAmount, setPaidAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!showForm) {
      setSelectedCustomer('');
      setFormError('');
      setPaymentStatus('not-paid');
      setPaidAmount('');
      setBillDate('');
      setDueDate('');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    setBillDate(today);
    setDueDate(today);
    setSuggestedBillId(getNextBillId(billList));
  }, [showForm, billList]);

  useEffect(() => {
    if (!billDate) return;
    const overdueDays = selectedCustomer
      ? getCustomerOverdueDays(selectedCustomer, customerList)
      : DEFAULT_OVERDUE_DAYS;
    setDueDate(addDaysToDate(billDate, overdueDays));
  }, [selectedCustomer, billDate, customerList]);

  const totalCredit = billList.reduce((sum, b) => sum + b.amount, 0);
  const totalOutstanding = billList.reduce((sum, b) => sum + (b.amount - b.paid), 0);

  const columns = [
    { key: 'id', label: 'Bill No.' },
    { key: 'customer', label: 'Customer', filterable: true },
    { key: 'date', label: 'Date' },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'amount',
      label: 'Amount',
      exportValue: (row) => formatCurrency(row.amount),
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'paid',
      label: 'Paid',
      exportValue: (row) => formatCurrency(row.paid),
      render: (row) => formatCurrency(row.paid),
    },
    {
      key: 'balance',
      label: 'Balance',
      exportValue: (row) => formatCurrency(row.amount - row.paid),
      render: (row) => (
        <span className={row.amount - row.paid > 0 ? 'font-semibold text-doc-primary' : 'text-doc-muted'}>
          {formatCurrency(row.amount - row.paid)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      exportValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  function handleAddBill(e) {
    e.preventDefault();
    setFormError('');

    const form = e.target;
    const billNo = form.billNo.value.trim();
    const note = form.note.value.trim();

    if (billList.some((bill) => bill.id === billNo)) {
      setFormError('This bill number is already in use.');
      return;
    }

    const amount = Number(form.amount.value);

    if (paymentStatus === 'partially-paid') {
      const partialPaid = Number(paidAmount);

      if (!paidAmount || Number.isNaN(partialPaid) || partialPaid <= 0) {
        setFormError('Enter a paid amount greater than 0.');
        return;
      }

      if (partialPaid >= amount) {
        setFormError('Partially paid amount must be less than the bill amount.');
        return;
      }
    }

    const { paid, status } = getBillPayment(
      amount,
      paymentStatus,
      Number(paidAmount),
    );

    const newBill = {
      id: billNo,
      customer: selectedCustomer,
      date: form.date.value,
      dueDate: form.dueDate.value,
      amount,
      paid,
      status,
      ...(note ? { note } : {}),
    };
    setBillList([newBill, ...billList]);
    form.reset();
    setSelectedCustomer('');
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bills"
        subtitle="Record and view all credit bills for customers"
        action={
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            New credit bill
          </button>
        }
      />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New credit bill">
        <form onSubmit={handleAddBill}>
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
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Bill number</span>
              <input
                key={suggestedBillId}
                name="billNo"
                required
                defaultValue={suggestedBillId}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="e.g. B-1047"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Bill date</span>
              <input
                name="date"
                type="date"
                required
                value={billDate}
                onChange={(event) => setBillDate(event.target.value)}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Due date</span>
              <input
                name="dueDate"
                type="date"
                required
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              />
              {selectedCustomer && (
                <span className="text-xs text-doc-muted">
                  Auto-set to {getCustomerOverdueDays(selectedCustomer, customerList)} days after bill date. You can adjust if needed.
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Amount (LKR)</span>
              <input
                name="amount"
                type="number"
                required
                min="1"
                step="0.01"
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="0.00"
              />
            </label>

            <fieldset className="flex flex-col gap-3 sm:col-span-2">
              <legend className="text-sm font-medium text-doc-navy">Payment status</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {paymentStatusOptions.map((option) => {
                  const isSelected = paymentStatus === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPaymentStatus(option.value);
                        if (option.value !== 'partially-paid') {
                          setPaidAmount('');
                        }
                        setFormError('');
                      }}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        isSelected
                          ? 'border-doc-primary bg-doc-primary-light text-doc-primary'
                          : 'border-doc-border bg-white text-doc-navy hover:border-doc-primary/40 hover:bg-doc-primary-light/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {paymentStatus === 'partially-paid' && (
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-sm font-medium text-doc-navy">Paid amount (LKR)</span>
                <input
                  name="paidAmount"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={paidAmount}
                  onChange={(event) => {
                    setPaidAmount(event.target.value);
                    setFormError('');
                  }}
                  className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                  placeholder="Amount already paid"
                />
              </label>
            )}

            {paymentStatus === 'fully-paid' && (
              <p className="text-sm text-doc-muted sm:col-span-2">
                The full bill amount will be recorded as paid when you save.
              </p>
            )}

            {paymentStatus === 'not-paid' && (
              <p className="text-sm text-doc-muted sm:col-span-2">
                No payment will be recorded for this bill.
              </p>
            )}

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Note</span>
              <textarea
                name="note"
                rows={3}
                className="resize-none rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Optional note about this bill"
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
              Save bill
            </button>
          </div>
        </form>
      </Modal>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-doc-muted">Total credit issued</p>
          <p className="mt-1 text-2xl font-bold text-doc-navy">{formatCurrency(totalCredit)}</p>
        </div>
        <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-doc-muted">Total outstanding</p>
          <p className="mt-1 text-2xl font-bold text-doc-primary">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={billList}
        emptyMessage="No credit bills recorded."
        title="Credit Bills"
        exportFileName="credit-bills"
      />
    </div>
  );
}
