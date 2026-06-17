export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'primary' }) {
  const accents = {
    primary: 'bg-doc-primary-light text-doc-primary',
    teal: 'bg-doc-teal/15 text-doc-teal',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-500',
  };

  return (
    <div className="rounded-2xl border border-doc-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-doc-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold text-doc-navy">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-doc-muted">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
}
