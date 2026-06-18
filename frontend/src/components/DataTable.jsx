import { useMemo, useState } from 'react';
import { SearchIcon } from './icons';
import { exportTableToPdf } from '../utils/exportTablePdf';
import { filterTableData, getFilterOptions } from '../utils/tableUtils';

export default function DataTable({
  columns,
  data,
  emptyMessage = 'No records found.',
  filteredEmptyMessage = 'No records match your search or filters.',
  onRowClick,
  title,
  exportFileName,
  enableSearch = true,
  enableExport = true,
}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  const filterableColumns = columns.filter((column) => column.filterable);
  const showToolbar = enableSearch || enableExport || filterableColumns.length > 0;

  const filteredData = useMemo(
    () => filterTableData(data, columns, { search, filters }),
    [data, columns, search, filters],
  );

  function handleFilterChange(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleExportPdf() {
    if (!title) return;

    exportTableToPdf({
      title,
      columns,
      data: filteredData,
      fileName: exportFileName || title,
    });
  }

  function handleRowClick(event, row) {
    if (!onRowClick) return;
    if (event.target.closest('button, a, input, select, textarea, label')) return;
    onRowClick(row);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-doc-border bg-white shadow-card">
      {showToolbar && (
        <div className="border-b border-doc-border/60 bg-doc-bg/30 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {enableSearch && (
                <label className="relative min-w-[220px] flex-1 sm:max-w-sm">
                  <span className="sr-only">Search table</span>
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doc-muted" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search table..."
                    className="w-full rounded-xl border border-doc-border bg-white py-2 pl-10 pr-4 text-sm text-doc-navy outline-none transition focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                  />
                </label>
              )}

              {filterableColumns.map((column) => (
                <label key={column.key} className="flex min-w-[150px] flex-col gap-1">
                  <span className="text-xs font-medium text-doc-muted">{column.label}</span>
                  <select
                    value={filters[column.key] || 'all'}
                    onChange={(event) => handleFilterChange(column.key, event.target.value)}
                    className="rounded-xl border border-doc-border bg-white px-3 py-2 text-sm text-doc-navy outline-none focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                  >
                    <option value="all">All</option>
                    {getFilterOptions(data, column.key).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {enableExport && title && (
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={filteredData.length === 0}
                className="shrink-0 rounded-xl border border-doc-primary/30 bg-white px-4 py-2 text-sm font-semibold text-doc-primary transition hover:border-doc-primary hover:bg-doc-primary-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download PDF
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-doc-muted">
            Showing {filteredData.length} of {data.length} record{data.length === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {!data.length ? (
        <div className="p-8 text-center">
          <p className="text-sm text-doc-muted">{emptyMessage}</p>
        </div>
      ) : !filteredData.length ? (
        <div className="p-8 text-center">
          <p className="text-sm text-doc-muted">{filteredEmptyMessage}</p>
        </div>
      ) : (
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
              {filteredData.map((row, rowIndex) => (
                <tr
                  key={row.id ?? `${row.customer ?? 'row'}-${rowIndex}`}
                  className={`transition hover:bg-doc-primary-light/30 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? (event) => handleRowClick(event, row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                >
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
      )}
    </div>
  );
}
