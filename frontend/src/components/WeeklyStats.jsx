const weekData = [
  { day: 'Mon', value: 65, color: 'bg-doc-primary' },
  { day: 'Tue', value: 45, color: 'bg-doc-teal' },
  { day: 'Wed', value: 80, color: 'bg-doc-primary' },
  { day: 'Thu', value: 55, color: 'bg-doc-teal' },
  { day: 'Fri', value: 90, color: 'bg-doc-primary' },
  { day: 'Sat', value: 40, color: 'bg-doc-teal' },
  { day: 'Sun', value: 70, color: 'bg-doc-primary' },
];

export default function WeeklyStats() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-float">
      <p className="mb-3 text-xs font-semibold text-doc-navy">Weekly Stats</p>
      <div className="flex items-end justify-between gap-1.5" style={{ height: '72px' }}>
        {weekData.map(({ day, value, color }) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full max-w-[14px] rounded-t-md ${color}`}
              style={{ height: `${value}%` }}
            />
            <span className="text-[9px] text-doc-muted">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
