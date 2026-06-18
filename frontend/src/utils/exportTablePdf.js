import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getColumnValue } from './tableUtils';

export function exportTableToPdf({ title, columns, data, fileName }) {
  const exportColumns = columns.filter(
    (column) => column.key !== 'actions' && column.exportable !== false,
  );

  const doc = new jsPDF({ orientation: exportColumns.length > 6 ? 'landscape' : 'portrait' });
  const generatedAt = new Date().toLocaleString('en-LK');

  doc.setFontSize(15);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated ${generatedAt}`, 14, 22);
  doc.setTextColor(0);

  autoTable(doc, {
    head: [exportColumns.map((column) => column.label)],
    body: data.map((row) => exportColumns.map((column) => getColumnValue(column, row))),
    startY: 28,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [45, 127, 249] },
  });

  const safeName = (fileName || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  doc.save(`${safeName || 'table'}.pdf`);
}
