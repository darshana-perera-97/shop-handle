import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { OverdueIcon, PatientsIcon } from '../components/icons';
import { getOverdueBills } from '../data/customerHelpers';
import { formatCurrency } from '../data/mockData';
import useAppData from '../context/AppDataContext';

export default function OverdueBillsPage() {
  const { billList } = useAppData();
  const overdueBills = getOverdueBills(billList);
  const totalOverdue = overdueBills.reduce((sum, b) => sum + (b.amount - b.paid), 0);
  const uniqueCustomers = [...new Set(overdueBills.map((b) => b.customer))];

  const columns = [
    { key: 'id', label: 'Bill No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'amount',
      label: 'Bill Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'paid',
      label: 'Paid',
      render: (row) => formatCurrency(row.paid),
    },
    {
      key: 'balance',
      label: 'Overdue Balance',
      render: (row) => (
        <span className="font-semibold text-red-500">{formatCurrency(row.amount - row.paid)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: () => <StatusBadge status="overdue" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overdue Bills"
        subtitle="Overdue credit bills and summary"
        action={
          <button
            type="button"
            className="rounded-2xl border-2 border-doc-primary bg-white px-5 py-2.5 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
          >
            Send reminders
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Overdue"
          value={formatCurrency(totalOverdue)}
          subtitle="Outstanding balance"
          icon={OverdueIcon}
          accent="danger"
        />
        <StatCard
          title="Overdue Bills"
          value={overdueBills.length}
          subtitle="Bills past due date"
          icon={OverdueIcon}
          accent="warning"
        />
        <StatCard
          title="Affected Customers"
          value={uniqueCustomers.length}
          subtitle="Need follow-up"
          icon={PatientsIcon}
          accent="primary"
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">Overdue by customer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {uniqueCustomers.map((customer) => {
            const customerBills = overdueBills.filter((b) => b.customer === customer);
            const customerTotal = customerBills.reduce((sum, b) => sum + (b.amount - b.paid), 0);
            const progress = Math.min(100, (customerTotal / totalOverdue) * 100);

            return (
              <div
                key={customer}
                className="flex items-center gap-4 rounded-2xl border border-doc-border bg-white p-5 shadow-card"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-doc-navy">{customer}</p>
                    <span className="text-sm font-bold text-red-500">{formatCurrency(customerTotal)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-red-50">
                    <div
                      className="h-full rounded-full bg-red-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-doc-muted">
                    {customerBills.length} overdue bill{customerBills.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <DataTable columns={columns} data={overdueBills} emptyMessage="No overdue bills. Great job!" />
    </div>
  );
}
