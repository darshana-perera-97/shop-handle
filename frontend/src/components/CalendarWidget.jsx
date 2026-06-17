const daysInMonth = [
  null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31,
];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarWidget() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-doc-navy">May, 2020</h3>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-doc-muted">
        {weekDays.map((day, i) => (
          <span key={`${day}-${i}`}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, i) => (
          <div key={i} className="flex h-7 items-center justify-center">
            {day && (
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium ${
                  day === 17
                    ? 'bg-doc-primary text-white shadow-md shadow-doc-primary/30'
                    : 'text-doc-muted hover:bg-doc-primary-light'
                }`}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
