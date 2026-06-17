import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { cashIn, formatCurrency } from '../data/mockData';

export default function CashInPage() {
  const totalReceived = cashIn.reduce((sum, p) => sum + p.amount, 0);

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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cash In"
        subtitle="Record and view all customer payments"
        action={
          <button
            type="button"
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Record payment
          </button>
        }
      />

      <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
        <p className="text-sm font-medium text-doc-muted">Total received (shown records)</p>
        <p className="mt-1 text-2xl font-bold text-doc-teal">{formatCurrency(totalReceived)}</p>
      </div>

      <DataTable columns={columns} data={cashIn} emptyMessage="No payments recorded yet." />
    </div>
  );
}
