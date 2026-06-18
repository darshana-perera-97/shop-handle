import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { OverdueIcon, PatientsIcon } from '../components/icons';
import { computeOverdueByCustomer, getCustomerByName, getOverdueBills } from '../data/customerHelpers';
import { formatCurrency } from '../data/mockData';
import useAppData from '../context/AppDataContext';

export default function OverdueBillsPage() {
  const navigate = useNavigate();
  const { billList, customerList } = useAppData();
  const overdueBills = getOverdueBills(billList);
  const overdueByCustomer = useMemo(
    () => computeOverdueByCustomer(billList),
    [billList],
  );
  const totalOverdue = overdueBills.reduce((sum, b) => sum + (b.amount - b.paid), 0);

  const customerColumns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => <span className="font-semibold text-doc-primary">{row.customer}</span>,
    },
    {
      key: 'billCount',
      label: 'Overdue Bills',
      exportValue: (row) => `${row.billCount} bill${row.billCount > 1 ? 's' : ''}`,
      render: (row) => `${row.billCount} bill${row.billCount > 1 ? 's' : ''}`,
    },
    { key: 'oldestDueDate', label: 'Oldest Due Date' },
    {
      key: 'totalOverdue',
      label: 'Total Overdue',
      exportValue: (row) => formatCurrency(row.totalOverdue),
      render: (row) => (
        <span className="font-semibold text-red-500">{formatCurrency(row.totalOverdue)}</span>
      ),
    },
  ];

  const columns = [
    { key: 'id', label: 'Bill No.' },
    { key: 'customer', label: 'Customer', filterable: true },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'amount',
      label: 'Bill Amount',
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
      label: 'Overdue Balance',
      exportValue: (row) => formatCurrency(row.amount - row.paid),
      render: (row) => (
        <span className="font-semibold text-red-500">{formatCurrency(row.amount - row.paid)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      exportValue: () => 'overdue',
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
          value={overdueByCustomer.length}
          subtitle="Need follow-up"
          icon={PatientsIcon}
          accent="primary"
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">Overdue by customer</h2>
        <DataTable
          columns={customerColumns}
          data={overdueByCustomer}
          emptyMessage="No overdue customers. Great job!"
          title="Overdue by Customer"
          exportFileName="overdue-by-customer"
          onRowClick={(row) => {
            const customer = getCustomerByName(row.customer, customerList);
            if (customer) navigate(`/customers/${customer.id}`);
          }}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-doc-navy">All overdue bills</h2>
        <DataTable
          columns={columns}
          data={overdueBills}
          emptyMessage="No overdue bills. Great job!"
          title="Overdue Bills"
          exportFileName="overdue-bills"
        />
      </section>
    </div>
  );
}
