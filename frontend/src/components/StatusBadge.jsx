const styles = {
  active: 'bg-doc-teal/15 text-doc-teal',
  paid: 'bg-doc-teal/15 text-doc-teal',
  cleared: 'bg-doc-teal/15 text-doc-teal',
  deposited: 'bg-doc-primary-light text-doc-primary',
  pending: 'bg-amber-50 text-amber-600',
  partial: 'bg-amber-50 text-amber-600',
  'to-bank': 'bg-doc-primary-light text-doc-primary',
  overdue: 'bg-red-50 text-red-500',
  inactive: 'bg-doc-border/50 text-doc-muted',
};

export default function StatusBadge({ status }) {
  const label = status.replace('-', ' ');
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || 'bg-doc-primary-light text-doc-primary'}`}
    >
      {label}
    </span>
  );
}
