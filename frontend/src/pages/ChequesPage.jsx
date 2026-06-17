import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { ChequeIcon } from '../components/icons';
import { cheques, formatCurrency } from '../data/mockData';

export default function ChequesPage() {
  const toBank = cheques.filter((c) => c.status === 'to-bank');
  const totalToBank = toBank.reduce((sum, c) => sum + c.amount, 0);

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
          value={cheques.filter((c) => c.status === 'deposited').length}
          icon={ChequeIcon}
          accent="warning"
        />
        <StatCard
          title="Cleared"
          value={cheques.filter((c) => c.status === 'cleared').length}
          icon={ChequeIcon}
          accent="teal"
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">Ready to bank</h2>
        <div className="flex flex-col gap-2.5">
          {toBank.length === 0 ? (
            <div className="rounded-2xl border border-doc-border bg-white p-6 text-center shadow-card">
              <p className="text-sm text-doc-muted">No cheques pending banking.</p>
            </div>
          ) : (
            toBank.map((cheque) => (
              <div
                key={cheque.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-doc-primary bg-white px-5 py-4 shadow-sm shadow-doc-primary/10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-doc-primary-light text-doc-primary">
                  <ChequeIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-doc-navy">{cheque.customer}</p>
                  <p className="text-xs text-doc-muted">
                    {cheque.bank} · #{cheque.chequeNo} · Bank on {cheque.bankDate}
                  </p>
                </div>
                <span className="text-lg font-bold text-doc-primary">{formatCurrency(cheque.amount)}</span>
                <button
                  type="button"
                  className="rounded-xl bg-doc-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-doc-primary-dark"
                >
                  Mark deposited
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <DataTable columns={columns} data={cheques} emptyMessage="No cheques on record." />
    </div>
  );
}
