export function getColumnValue(column, row) {
  if (column.exportValue) {
    return column.exportValue(row);
  }

  const value = row[column.key];
  if (value == null) return '';
  return String(value);
}

export function getFilterOptions(data, columnKey) {
  const values = new Set();

  data.forEach((row) => {
    const value = row[columnKey];
    if (value != null && value !== '') {
      values.add(String(value));
    }
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function filterTableData(data, columns, { search = '', filters = {} }) {
  const searchableColumns = columns.filter(
    (column) => column.key !== 'actions' && column.searchable !== false,
  );

  return data.filter((row) => {
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      const matchesSearch = searchableColumns.some((column) =>
        getColumnValue(column, row).toLowerCase().includes(query),
      );
      if (!matchesSearch) return false;
    }

    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return String(row[key]) === value;
    });
  });
}
