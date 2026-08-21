/**
 * Universal Excel/CSV Export Utility with UTF-8 BOM encoding
 * Supports Bengali text without character distortion in Microsoft Excel and Google Sheets.
 */

export function exportToCSV(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    alert('এক্সপোর্ট করার জন্য কোনো তথ্য পাওয়া যায়নি / No data to export');
    return false;
  }

  // UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 Bengali characters properly
  const BOM = '\uFEFF';
  
  // Format header row
  const headerRow = headers.map(h => `"${String(h.label || h).replace(/"/g, '""')}"`).join(',');

  // Format data rows
  const dataRows = rows.map(row => {
    return headers.map(h => {
      const key = h.key || h;
      let val = row[key];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvContent = BOM + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function exportStudentsToCSV(students = []) {
  const headers = [
    { label: 'শিক্ষার্থী আইডি', key: 'studentIdNumber' },
    { label: 'শিক্ষার্থীর নাম (বাংলা)', key: 'nameBn' },
    { label: 'শিক্ষার্থীর নাম (ইংরেজি)', key: 'name' },
    { label: 'রোল নম্বর', key: 'rollNo' },
    { label: 'শ্রেণি', key: 'className' },
    { label: 'শাখা', key: 'sectionName' },
    { label: 'ব্যাচ', key: 'batchName' },
    { label: 'রক্তের গ্রুপ', key: 'bloodGroup' },
    { label: 'লিঙ্গ', key: 'gender' },
    { label: 'অভিভাবকের নাম', key: 'guardianName' },
    { label: 'অভিভাবকের মোবাইল', key: 'guardianPhone' },
    { label: 'ঠিকানা', key: 'address' },
    { label: 'ভর্তির তারিখ', key: 'admissionDate' },
    { label: 'স্ট্যাটাস', key: 'status' }
  ];

  const formattedRows = students.map(st => ({
    studentIdNumber: st.studentIdNumber || `NG-2026-${st.rollNo || st.id}`,
    nameBn: st.nameBn || st.user?.name || '',
    name: st.name || st.user?.name || '',
    rollNo: st.rollNo || '',
    className: st.class?.nameBn || st.class?.nameEn || st.className || '',
    sectionName: st.section?.nameBn || st.section?.nameEn || st.sectionName || '',
    batchName: st.batch?.name || st.batch?.nameBn || st.batchName || '',
    bloodGroup: st.bloodGroup || '',
    gender: st.gender === 'MALE' ? 'ছাত্র (Male)' : 'ছাত্রী (Female)',
    guardianName: st.guardians?.[0]?.parent?.name || st.guardianName || '',
    guardianPhone: st.guardians?.[0]?.parent?.phone || st.guardianPhone || '',
    address: st.address || '',
    admissionDate: st.admissionDate || '',
    status: (st.user ? st.user.isActive !== false : true) ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'
  }));

  return exportToCSV('NextGen_Academy_Students_List', headers, formattedRows);
}

export function exportAttendanceToCSV(attendanceLogs = [], studentName = '') {
  const headers = [
    { label: 'তারিখ', key: 'date' },
    { label: 'দিন', key: 'dayOfWeek' },
    { label: 'উপস্থিতির স্ট্যাটাস', key: 'status' },
    { label: 'ইন-টাইম (প্রবেশ)', key: 'inTime' },
    { label: 'আউট-টাইম (প্রস্থান)', key: 'outTime' },
    { label: 'মন্তব্য', key: 'remarks' }
  ];

  const formattedRows = attendanceLogs.map(a => ({
    date: a.date || '',
    dayOfWeek: a.dayOfWeek || a.day || '',
    status: a.status === 'PRESENT' ? 'উপস্থিত (Present)' : a.status === 'ABSENT' ? 'অনুপস্থিত (Absent)' : a.status === 'LATE' ? 'বিলম্ব (Late)' : 'ছুটি (Leave)',
    inTime: a.inTime || '-',
    outTime: a.outTime || '-',
    remarks: a.remarks || ''
  }));

  const prefix = studentName ? `Attendance_${studentName}` : 'NextGen_Attendance_Report';
  return exportToCSV(prefix, headers, formattedRows);
}

export function exportInvoicesToCSV(invoices = []) {
  const headers = [
    { label: 'ইনভয়েস নম্বর', key: 'invoiceNo' },
    { label: 'শিক্ষার্থীর নাম', key: 'studentName' },
    { label: 'শিক্ষার্থী আইডি / রোল', key: 'studentId' },
    { label: 'শ্রেণি', key: 'className' },
    { label: 'ফি বিবরণ / শিরোনাম', key: 'title' },
    { label: 'মাস / সেশন', key: 'month' },
    { label: 'মূল ফি (৳)', key: 'baseAmount' },
    { label: 'ছাড় / ওয়েভার (৳)', key: 'discountAmount' },
    { label: 'পরিশোধযোগ্য টাকা (৳)', key: 'amount' },
    { label: 'জমার শেষ তারিখ', key: 'dueDate' },
    { label: 'পেমেন্ট স্ট্যাটাস', key: 'status' }
  ];

  const formattedRows = invoices.map(inv => ({
    invoiceNo: inv.invoiceNo || '',
    studentName: inv.student?.user?.name || inv.studentName || '',
    studentId: inv.student?.studentIdNumber || inv.student?.rollNo || '',
    className: inv.student?.class?.nameBn || inv.student?.class?.nameEn || '',
    title: inv.titleBn || inv.titleEn || inv.title || '',
    month: `${inv.month || ''} ${inv.year || ''}`.trim(),
    baseAmount: inv.baseAmount || inv.amount || 0,
    discountAmount: inv.discountAmount || 0,
    amount: inv.amount || 0,
    dueDate: inv.dueDate || '',
    status: inv.status === 'PAID' ? 'পরিশোধিত (PAID)' : 'বকেয়া (UNPAID)'
  }));

  return exportToCSV('NextGen_Academy_Fee_Collection_Report', headers, formattedRows);
}
