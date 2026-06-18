import { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { ChequeIcon } from '../components/icons';
import { buildChequeRecords, getChequesReadyToBank } from '../data/chequeHelpers';
import { formatCurrency } from '../data/mockData';
import useAppData from '../context/AppDataContext';

export default function ChequesPage() {
  const { loading, error, chequeList, paymentList, setChequeList } = useAppData();

  const allCheques = useMemo(
    () => buildChequeRecords({ chequeList, paymentList }),
    [chequeList, paymentList],
  );

  const toBank = allCheques.filter((cheque) => cheque.status === 'to-bank');
  const readyToBank = getChequesReadyToBank(allCheques);
  const totalToBank = toBank.reduce((sum, cheque) => sum + cheque.amount, 0);

  function markDeposited(cheque) {
    setChequeList((prev) => {
      const existing = prev.find((item) => item.id === cheque.id);
      if (existing) {
        return prev.map((item) =>
          item.id === cheque.id ? { ...item, status: 'deposited' } : item,
        );
      }

      return [{ ...cheque, status: 'deposited', bank: cheque.bank || '—' }, ...prev];
    });
  }

  const readyToBankColumns = [
    { key: 'customer', label: 'Customer', filterable: true },
    { key: 'bank', label: 'Bank', filterable: true },
    { key: 'chequeNo', label: 'Cheque No.' },
    {
      key: 'amount',
      label: 'Amount',
      exportValue: (row) => formatCurrency(row.amount),
      render: (row) => (
        <span className="font-bold text-doc-primary">{formatCurrency(row.amount)}</span>
      ),
    },
    { key: 'bankDate', label: 'Bank Date' },
    {
      key: 'actions',
      label: '',
      exportable: false,
      searchable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => markDeposited(row)}
          className="rounded-xl bg-doc-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-doc-primary-dark"
        >
          Mark deposited
        </button>
      ),
    },
  ];

  const columns = [
    { key: 'id', label: 'Cheque ID' },
    { key: 'customer', label: 'Customer', filterable: true },
    { key: 'bank', label: 'Bank', filterable: true },
    { key: 'chequeNo', label: 'Cheque No.' },
    {
      key: 'amount',
      label: 'Amount',
      exportValue: (row) => formatCurrency(row.amount),
      render: (row) => formatCurrency(row.amount),
    },
    { key: 'receivedDate', label: 'Received' },
    { key: 'bankDate', label: 'Bank Date' },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      exportValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Cheques" subtitle="Cheque lists to be banked and related details" />
        <div className="rounded-2xl border border-doc-border bg-white px-5 py-8 text-center shadow-card">
          <p className="text-sm text-doc-muted">Loading cheque data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Cheques" subtitle="Cheque lists to be banked and related details" />
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 shadow-card">
          <p className="text-sm font-semibold text-red-600">Could not load cheque data</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cheques"
        subtitle="Cheque lists to be banked and related details"
        action={
          <button
            type="button"
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Add cheque
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="To Be Banked"
          value={toBank.length}
          subtitle={formatCurrency(totalToBank)}
          icon={ChequeIcon}
          accent="primary"
        />
        <StatCard
          title="Deposited"
          value={allCheques.filter((cheque) => cheque.status === 'deposited').length}
          icon={ChequeIcon}
          accent="warning"
        />
        <StatCard
          title="Cleared"
          value={allCheques.filter((cheque) => cheque.status === 'cleared').length}
          icon={ChequeIcon}
          accent="teal"
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">Ready to bank</h2>
        <p className="-mt-2 mb-4 text-sm text-doc-muted">
          Cheques whose deposit date has passed and are still waiting to be banked.
        </p>
        <DataTable
          columns={readyToBankColumns}
          data={readyToBank}
          emptyMessage="No cheques are ready to bank right now."
          title="Cheques Ready to Bank"
          exportFileName="cheques-ready-to-bank"
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">All cheques</h2>
        <DataTable
          columns={columns}
          data={allCheques}
          emptyMessage="No cheques on record."
          title="Cheques"
          exportFileName="cheques"
        />
      </section>
    </div>
  );
}
