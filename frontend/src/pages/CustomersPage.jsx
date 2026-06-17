import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { UserPlusIcon } from '../components/icons';
import { customers, formatCurrency } from '../data/mockData';

const customerTypes = ['Shop', 'Person', 'Construction'];

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false);
  const [customerList, setCustomerList] = useState(customers);

  const columns = [
    { key: 'name', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'customerType', label: 'Customer Type' },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => (
        <span className={row.balance > 0 ? 'font-semibold text-doc-primary' : 'text-doc-muted'}>
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  function handleAddCustomer(e) {
    e.preventDefault();
    const form = e.target;
    const newCustomer = {
      id: customerList.length + 1,
      name: form.name.value,
      phone: form.phone.value,
      customerType: form.customerType.value,
      address: form.address.value,
      balance: 0,
      status: 'active',
    };
    setCustomerList([...customerList, newCustomer]);
    form.reset();
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        subtitle="Add and manage your shop customers"
        action={
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            <UserPlusIcon />
            Add customer
          </button>
        }
      />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New customer">
        <form onSubmit={handleAddCustomer}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Name</span>
              <input
                name="name"
                required
                autoFocus
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Customer name"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Phone</span>
              <input
                name="phone"
                required
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="+94 77 000 0000"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-doc-navy">Customer Type</span>
              <select
                name="customerType"
                required
                defaultValue=""
                className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
              >
                <option value="" disabled>
                  Select type
                </option>
                {customerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-doc-navy">Address</span>
              <input
                name="address"
                className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Street address"
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
              Save customer
            </button>
          </div>
        </form>
      </Modal>

      <DataTable columns={columns} data={customerList} emptyMessage="No customers yet. Add your first customer." />
    </div>
  );
}
