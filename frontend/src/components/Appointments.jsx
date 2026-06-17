import { PersonIcon } from './icons';

const appointments = [
  { name: 'Jessica Ashcroft', type: 'Follow-up', time: 'Next, 08:00', active: true },
  { name: 'Lily Anderson', type: 'New patient', time: '08:30', active: false },
  { name: 'Mark Thompson', type: 'Follow-up', time: '09:00', active: false },
  { name: 'Sarah Chen', type: 'New patient', time: '09:30', active: false },
];

export default function Appointments() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-doc-navy">Today&apos;s appointments</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {appointments.map((appt) => (
          <div key={appt.name} className="min-w-[160px] shrink-0">
            <div
              className={`rounded-2xl border bg-white p-4 transition ${
                appt.active
                  ? 'border-2 border-doc-primary shadow-sm shadow-doc-primary/10'
                  : 'border-doc-border'
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-doc-primary-light text-doc-primary">
                <PersonIcon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-doc-navy">{appt.name}</p>
              <p className="mt-0.5 text-xs text-doc-muted">{appt.type}</p>
            </div>
            <p
              className={`mt-2 text-center text-xs font-medium ${
                appt.active ? 'text-doc-primary' : 'text-doc-muted'
              }`}
            >
              {appt.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
