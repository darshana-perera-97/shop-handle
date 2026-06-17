import { DEFAULT_OVERDUE_DAYS } from '../data/mockData';

const customerTypes = ['Shop', 'Person', 'Construction'];
const statusOptions = ['active', 'overdue'];

export default function CustomerForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save customer',
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
            placeholder="Customer name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-doc-navy">Phone</span>
          <input
            name="phone"
            required
            defaultValue={initialValues?.phone ?? ''}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder="+94 77 000 0000"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-doc-navy">Customer Type</span>
          <select
            name="customerType"
            required
            defaultValue={initialValues?.customerType ?? ''}
            className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
          >
            <option value="" disabled>
              Select type
            </option>
            {customerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-doc-navy">Address</span>
          <input
            name="address"
            defaultValue={initialValues?.address ?? ''}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder="Street address"
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-doc-navy">Starting balance (LKR)</span>
          <input
            name="startingBalance"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialValues?.startingBalance ?? 0}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder="0.00"
          />
          <span className="text-xs text-doc-muted">
            Outstanding bills to pay when this customer is added to the system.
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-doc-navy">Overdue after (days)</span>
          <input
            name="overdueDays"
            type="number"
            min="1"
            step="1"
            defaultValue={initialValues?.overdueDays ?? DEFAULT_OVERDUE_DAYS}
            className="rounded-xl border border-doc-border px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            placeholder={`${DEFAULT_OVERDUE_DAYS}`}
          />
          <span className="text-xs text-doc-muted">
            Bills become overdue this many days after the bill date.
          </span>
        </label>
        {initialValues && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-doc-navy">Status</span>
            <select
              name="status"
              required
              defaultValue={initialValues.status ?? 'active'}
              className="rounded-xl border border-doc-border bg-white px-4 py-2.5 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        )}
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
