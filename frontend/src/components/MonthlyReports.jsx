import { ReportIcon, HeartPulseIcon } from './icons';

const reports = [
  { title: 'Treatment report', progress: 85, icon: ReportIcon },
  { title: 'State of being report', progress: 75, icon: HeartPulseIcon },
];

export default function MonthlyReports() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-doc-navy">Monthly reports</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map(({ title, progress, icon: Icon }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-2xl border border-doc-border bg-white p-5 shadow-card"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-doc-primary-light text-doc-primary">
              <Icon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-doc-navy">{title}</p>
                <span className="text-sm font-bold text-doc-primary">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-doc-primary-light">
                <div
                  className="h-full rounded-full bg-doc-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
