import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import useAppData from '../context/AppDataContext';

export default function UsersPage() {
  const { userList, removeUser } = useAppData();
  const [removeError, setRemoveError] = useState('');

  function handleRemoveUser(user) {
    setRemoveError('');

    const adminCount = userList.filter((item) => item.role === 'Admin').length;
    if (user.role === 'Admin' && adminCount <= 1) {
      setRemoveError('You cannot remove the only admin user.');
      return;
    }

    if (!window.confirm(`Remove ${user.name} from the system? This cannot be undone.`)) {
      return;
    }

    removeUser(user.id);
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      filterable: true,
      exportValue: (row) => row.role,
      render: (row) => (
        <span className="rounded-lg bg-doc-primary-light px-2.5 py-1 text-xs font-semibold text-doc-primary">
          {row.role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      exportValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleRemoveUser(row)}
          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Remove
        </button>
      ),
    },
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
              {userList.filter((u) => u.role === role).length}
            </p>
          </div>
        ))}
      </div>

      {removeError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {removeError}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={userList}
        emptyMessage="No users configured."
        title="Users"
        exportFileName="users"
      />
    </div>
  );
}
