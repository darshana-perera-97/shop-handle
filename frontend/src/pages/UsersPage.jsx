import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { users } from '../data/mockData';

export default function UsersPage() {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span className="rounded-lg bg-doc-primary-light px-2.5 py-1 text-xs font-semibold text-doc-primary">
          {row.role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'lastLogin', label: 'Last Login' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        subtitle="Manage system users and access roles"
        action={
          <button
            type="button"
            className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Add user
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {['Admin', 'Manager', 'Cashier'].map((role) => (
          <div key={role} className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
            <p className="text-sm font-medium text-doc-muted">{role}s</p>
            <p className="mt-1 text-2xl font-bold text-doc-navy">
              {users.filter((u) => u.role === role).length}
            </p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={users} emptyMessage="No users configured." />
    </div>
  );
}
