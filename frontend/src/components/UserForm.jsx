const roleOptions = ['Admin', 'Manager', 'Cashier', 'Viewer'];
const statusOptions = ['active', 'inactive'];

export default function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save user',
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-doc-navy">Name</span>
          <input
            name="name"
            required
            autoFocus
            defaultValue={initialValues?.name ?? ''}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder="Full name"
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-doc-navy">Email</span>
          <input
            name="email"
            type="email"
            required
            defaultValue={initialValues?.email ?? ''}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder="user@shop.lk"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-doc-navy">Role</span>
          <select
            name="role"
            required
            defaultValue={initialValues?.role ?? 'Cashier'}
            className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-doc-navy">Status</span>
          <select
            name="status"
            required
            defaultValue={initialValues?.status ?? 'active'}
            className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border-2 border-doc-primary bg-white px-5 py-2.5 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
