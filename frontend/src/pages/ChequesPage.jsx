import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { ChequeIcon } from '../components/icons';
import { formatCurrency, getChequesReadyToBank } from '../data/mockData';
import useAppData from '../context/AppDataContext';

export default function ChequesPage() {
  const { chequeList, setChequeList } = useAppData();

  const toBank = chequeList.filter((c) => c.status === 'to-bank');
  const readyToBank = getChequesReadyToBank(chequeList);
  const totalToBank = toBank.reduce((sum, c) => sum + c.amount, 0);

  function markDeposited(chequeId) {
    setChequeList((prev) =>
      prev.map((cheque) =>
        cheque.id === chequeId ? { ...cheque, status: 'deposited' } : cheque,
      ),
    );
  }

  const readyToBankColumns = [
    { key: 'customer', label: 'Customer' },
    { key: 'bank', label: 'Bank' },
    { key: 'chequeNo', label: 'Cheque No.' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <span className="font-bold text-doc-primary">{formatCurrency(row.amount)}</span>
      ),
    },
    { key: 'bankDate', label: 'Bank Date' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          type="button"
          onClick={() => markDeposited(row.id)}
          className="rounded-xl bg-doc-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-doc-primary-dark"
        >
          Mark deposited
        </button>
      ),
    },
  ];

  const columns = [
    { key: 'id', label: 'Cheque ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'bank', label: 'Bank' },
    { key: 'chequeNo', label: 'Cheque No.' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    { key: 'receivedDate', label: 'Received' },
    { key: 'bankDate', label: 'Bank Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

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
          value={chequeList.filter((c) => c.status === 'deposited').length}
          icon={ChequeIcon}
          accent="warning"
        />
        <StatCard
          title="Cleared"
          value={chequeList.filter((c) => c.status === 'cleared').length}
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
          emptyMessage="No overdue cheques pending deposit."
        />
      </section>

      <DataTable columns={columns} data={chequeList} emptyMessage="No cheques on record." />
    </div>
  );
}
