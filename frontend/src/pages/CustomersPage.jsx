import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';
import StatusBadge from '../components/StatusBadge';
import { UserPlusIcon } from '../components/icons';
import { useCustomers } from '../context/CustomersContext';
import useAppData from '../context/AppDataContext';
import { getCustomerClosingBalance } from '../data/customerHelpers';
import { formatCurrency } from '../data/mockData';

export default function CustomersPage() {
  const { customerList, addCustomer, getNextCustomerId, defaultOverdueDays } = useCustomers();
  const { collections } = useAppData();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <Link
          to={`/customers/${row.id}`}
          className="font-semibold text-doc-primary transition hover:text-doc-primary-dark hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    { key: 'phone', label: 'Phone' },
    { key: 'customerType', label: 'Customer Type' },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => {
        const closingBalance = getCustomerClosingBalance(row, collections);
        return (
          <span className={closingBalance > 0 ? 'font-semibold text-doc-primary' : 'text-doc-muted'}>
            {formatCurrency(closingBalance)}
          </span>
        );
      },
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
    const overdueDays = Number(form.overdueDays.value) || defaultOverdueDays;
    const startingBalance = Number(form.startingBalance.value) || 0;

    addCustomer({
      id: getNextCustomerId(),
      name: form.name.value,
      phone: form.phone.value,
      customerType: form.customerType.value,
      address: form.address.value,
      overdueDays,
      startingBalance,
      balance: startingBalance,
      status: 'active',
    });
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
        <CustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setShowForm(false)}
          submitLabel="Save customer"
        />
      </Modal>

      <DataTable columns={columns} data={customerList} emptyMessage="No customers yet. Add your first customer." />
    </div>
  );
}
