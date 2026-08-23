import * as XLSX from 'xlsx';

// Builds and downloads an .xlsx report for a given "YYYY-MM" month, one row
// per submitted survey, with each of the 5 criteria as its own column.
export function exportMonthlyReport({ responses, supervisors, criteria, scale, month }) {
  const monthResponses = responses
    .filter((r) => r.date.startsWith(month))
    .sort((a, b) => a.date.localeCompare(b.date));

  const scoreOf = (r) => {
    const vals = criteria.map((c) => r.ratings[c.id]);
    return Math.round(((vals.reduce((a, b) => a + b, 0) / vals.length - 1) / 3) * 100);
  };

  const rows = monthResponses.map((r) => {
    const sup = supervisors.find((s) => s.id === r.supervisorId);
    const row = {
      التاريخ: r.date,
      المشرف: sup ? sup.name : '—',
      القسم: sup ? sup.department : '—',
      'رقم الغرفة': r.room || '',
      'اسم المريض': r.patientName || '',
    };
    criteria.forEach((c) => {
      const scaleItem = scale.find((s) => s.value === r.ratings[c.id]);
      row[c.short] = scaleItem ? scaleItem.label : '';
    });
    row['النسبة العامة'] = `${scoreOf(r)}%`;
    row['ملاحظة'] = r.comment || '';
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 12 }, { wch: 18 }, { wch: 16 }, { wch: 10 }, { wch: 16 },
    ...criteria.map(() => ({ wch: 14 })),
    { wch: 12 }, { wch: 24 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'التقرير');
  XLSX.writeFile(wb, `تقرير-النظافة-${month}.xlsx`);

  return monthResponses.length;
}
