import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';
import StatusBadge from '../components/StatusBadge';
import { ChevronLeftIcon, PencilIcon } from '../components/icons';
import { useCustomers } from '../context/CustomersContext';
import useAppData from '../context/AppDataContext';
import { buildCustomerLedger } from '../data/customerHelpers';
import { formatCurrency } from '../data/mockData';

function LedgerAmount({ amount, tone }) {
  if (!amount) {
    return <span className="text-doc-muted">—</span>;
  }

  const toneClass =
    tone === 'debit' ? 'text-red-500' : tone === 'credit' ? 'text-doc-teal' : 'text-doc-navy';

  return <span className={`font-semibold ${toneClass}`}>{formatCurrency(amount)}</span>;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const { getCustomerById, updateCustomer, defaultOverdueDays } = useCustomers();
  const { collections } = useAppData();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const customer = getCustomerById(id);

  if (!customer) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          to="/customers"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-doc-primary transition hover:text-doc-primary-dark"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to customers
        </Link>
        <div className="rounded-2xl border border-doc-border bg-white p-8 text-center shadow-card">
          <p className="text-lg font-bold text-doc-navy">Customer not found</p>
          <p className="mt-2 text-sm text-doc-muted">This customer may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const ledger = buildCustomerLedger(customer, collections);
  const totalDebit = ledger.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = ledger.reduce((sum, entry) => sum + entry.credit, 0);
  const closingBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;

  const ledgerColumns = [
    { key: 'date', label: 'Date' },
    { key: 'ref', label: 'Ref' },
    { key: 'particulars', label: 'Particulars' },
    {
      key: 'debit',
      label: 'Debit',
      exportValue: (row) => (row.debit ? formatCurrency(row.debit) : '—'),
      render: (row) => <LedgerAmount amount={row.debit} tone="debit" />,
    },
    {
      key: 'credit',
      label: 'Credit',
      exportValue: (row) => (row.credit ? formatCurrency(row.credit) : '—'),
      render: (row) => <LedgerAmount amount={row.credit} tone="credit" />,
    },
    {
      key: 'balance',
      label: 'Balance',
      exportValue: (row) => formatCurrency(row.balance),
      render: (row) => <LedgerAmount amount={row.balance} tone="balance" />,
    },
    {
      key: 'type',
      label: 'Type',
      filterable: true,
      exportValue: (row) => row.type,
      render: (row) => <span className="capitalize text-doc-muted">{row.type}</span>,
    },
  ];

  function handleEditCustomer(e) {
    e.preventDefault();
    const form = e.target;
    const overdueDays = Number(form.overdueDays.value) || defaultOverdueDays;
    const startingBalance = Number(form.startingBalance.value) || 0;

    updateCustomer(customer.id, {
      name: form.name.value,
      phone: form.phone.value,
      customerType: form.customerType.value,
      address: form.address.value,
      overdueDays,
      startingBalance,
      balance: startingBalance,
      status: form.status.value,
    });
    setShowEditForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/customers"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-doc-primary transition hover:text-doc-primary-dark"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        subtitle={`${customer.customerType} customer · Account ledger`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={customer.status} />
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-doc-border bg-white px-5 py-2.5 text-sm font-semibold text-doc-navy transition hover:bg-doc-bg"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-doc-primary bg-white px-5 py-2.5 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </button>
          </div>
        }
      />

      <Modal open={showDetails} onClose={() => setShowDetails(false)} title="Customer details">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-doc-border bg-doc-bg/40 p-4">
            <dt className="text-sm font-medium text-doc-muted">Phone</dt>
            <dd className="mt-1 font-semibold text-doc-navy">{customer.phone}</dd>
          </div>
          <div className="rounded-2xl border border-doc-border bg-doc-bg/40 p-4">
            <dt className="text-sm font-medium text-doc-muted">Customer type</dt>
            <dd className="mt-1 font-semibold text-doc-navy">{customer.customerType}</dd>
          </div>
          <div className="rounded-2xl border border-doc-border bg-doc-bg/40 p-4 sm:col-span-2">
            <dt className="text-sm font-medium text-doc-muted">Address</dt>
            <dd className="mt-1 font-semibold text-doc-navy">{customer.address || '—'}</dd>
          </div>
          <div className="rounded-2xl border border-doc-border bg-doc-bg/40 p-4 sm:col-span-2">
            <dt className="text-sm font-medium text-doc-muted">Starting balance</dt>
            <dd className="mt-1 font-semibold text-doc-navy">
              {formatCurrency(customer.startingBalance ?? 0)}
            </dd>
          </div>
          <div className="rounded-2xl border border-doc-border bg-doc-bg/40 p-4 sm:col-span-2">
            <dt className="text-sm font-medium text-doc-muted">Overdue after</dt>
            <dd className="mt-1 font-semibold text-doc-navy">{customer.overdueDays ?? defaultOverdueDays} days</dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowDetails(false)}
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal open={showEditForm} onClose={() => setShowEditForm(false)} title="Edit customer">
        <CustomerForm
          key={customer.id}
          initialValues={customer}
          onSubmit={handleEditCustomer}
          onCancel={() => setShowEditForm(false)}
          submitLabel="Save changes"
        />
      </Modal>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-doc-muted">Total debit</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{formatCurrency(totalDebit)}</p>
        </div>
        <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-doc-muted">Total credit</p>
          <p className="mt-1 text-2xl font-bold text-doc-teal">{formatCurrency(totalCredit)}</p>
        </div>
        <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-doc-muted">Closing balance</p>
          <p className="mt-1 text-2xl font-bold text-doc-primary">{formatCurrency(closingBalance)}</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-doc-navy">Account ledger</h2>
        <DataTable
          columns={ledgerColumns}
          data={ledger}
          emptyMessage="No ledger entries for this customer yet."
          title={`${customer.name} Ledger`}
          exportFileName={`${customer.name}-ledger`}
        />
      </section>
    </div>
  );
}
