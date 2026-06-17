import { ClockIcon, PersonIcon, CoffeeIcon } from './icons';

const timelineItems = [
  { time: '06:00 AM', label: 'Started shift', icon: ClockIcon, variant: 'completed' },
  { time: '06:30 AM', label: 'Appointment', icon: PersonIcon, variant: 'default' },
  { time: '07:00 AM', label: 'Appointment', icon: PersonIcon, variant: 'default' },
  { time: '07:30 AM', label: 'Break', icon: CoffeeIcon, variant: 'default' },
  { time: '07:30 AM', label: 'Appointment', icon: PersonIcon, variant: 'active' },
  { time: '08:00 AM', label: 'Appointment', icon: PersonIcon, variant: 'default' },
];

const variantStyles = {
  completed: 'bg-doc-primary-light border-doc-primary-light text-doc-navy',
  default: 'bg-white border-doc-border text-doc-navy',
  active: 'bg-white border-2 border-doc-primary text-doc-navy shadow-sm shadow-doc-primary/10',
};

export default function Timeline() {
  return (
    <section className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-doc-navy">Your dashboard</h1>
        <p className="mt-1 text-sm text-doc-muted">Today&apos;s timeline</p>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {timelineItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <li
              key={`${item.time}-${item.label}-${index}`}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${variantStyles[item.variant]}`}
            >
              <span className="text-doc-primary">
                <Icon />
              </span>
              <span className="flex-1 font-medium">{item.label}</span>
              <span className="text-xs text-doc-muted">{item.time}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className="w-full rounded-2xl bg-doc-primary py-3 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
        >
          End today&apos;s shift
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border-2 border-doc-primary bg-white py-3 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
        >
          Set a reminder
        </button>
      </div>
    </section>
  );
}
