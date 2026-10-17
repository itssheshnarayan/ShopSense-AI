/**
 * Browser-side CSV Export Utility
 * Safely escapes CSV fields and downloads via Blob
 */
export function exportToCSV(filename, headers, rows) {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  // Format header row
  const headerKeys = headers.map(h => h.key);
  const headerLabels = headers.map(h => `"${(h.label || h.key).replace(/"/g, '""')}"`).join(',');

  // Format data rows
  const csvRows = rows.map(row => {
    return headerKeys.map(key => {
      let val = row[key];
      if (val === undefined || val === null) {
        val = '';
      } else if (typeof val === 'number') {
        val = val.toString();
      } else if (typeof val === 'boolean') {
        val = val ? 'Yes' : 'No';
      } else {
        val = `"${String(val).replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  const csvContent = [headerLabels, ...csvRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
