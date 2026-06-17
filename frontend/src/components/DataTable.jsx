export default function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-doc-border bg-white p-8 text-center shadow-card">
        <p className="text-sm text-doc-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-doc-border bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-doc-border bg-doc-bg/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-doc-muted"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-doc-border/60">
            {data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="transition hover:bg-doc-primary-light/30">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 font-medium text-doc-navy">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
