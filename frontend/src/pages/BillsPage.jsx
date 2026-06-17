import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { bills, customers, formatCurrency } from '../data/mockData';

function getNextBillId(list) {
  const nums = list.map((bill) => parseInt(bill.id.replace('B-', ''), 10));
  const max = Math.max(...nums, 1041);
  return `B-${max + 1}`;
}

export default function BillsPage() {
  const [showForm, setShowForm] = useState(false);
  const [billList, setBillList] = useState(bills);

  const totalCredit = billList.reduce((sum, b) => sum + b.amount, 0);
  const totalOutstanding = billList.reduce((sum, b) => sum + (b.amount - b.paid), 0);

  const columns = [
    { key: 'id', label: 'Bill No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'paid',
      label: 'Paid',
      render: (row) => formatCurrency(row.paid),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => (
        <span className={row.amount - row.paid > 0 ? 'font-semibold text-doc-primary' : 'text-doc-muted'}>
          {formatCurrency(row.amount - row.paid)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  function handleAddBill(e) {
    e.preventDefault();
    const form = e.target;
    const newBill = {
      id: getNextBillId(billList),
      customer: form.customer.value,
      date: form.date.value,
      dueDate: form.dueDate.value,
      amount: Number(form.amount.value),
      paid: 0,
      status: 'pending',
    };
    setBillList([newBill, ...billList]);
    form.reset();
    setShowForm(false);
  }

  const today = new Date().toISOString().slice(0, 10);

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
              <select
                name="customer"
                required
                autoFocus
                defaultValue=""
                className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              >
                <option value="" disabled>
                  Select customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Bill date</span>
              <input
                name="date"
                type="date"
                required
                defaultValue={today}
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Due date</span>
              <input
                name="dueDate"
                type="date"
                required
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              />
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
          </div>
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

      <DataTable columns={columns} data={billList} emptyMessage="No credit bills recorded." />
    </div>
  );
}
