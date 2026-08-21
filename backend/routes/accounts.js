const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

// Helper to read & write DB
function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// Bengali number in words converter helper (for salary receipt)
function numberToBanglaWords(num) {
  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'];
  const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

  if (num === 0) return 'শূন্য';

  function convertTwoDigits(n) {
    if (n < 20) return units[n];
    const t = Math.floor(n / 10);
    const u = n % 10;
    return (tens[t] + (u > 0 ? ' ' + units[u] : '')).trim();
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) words += convertTwoDigits(crore) + ' কোটি ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' লাখ ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' হাজার ';
  if (hundred > 0) words += convertTwoDigits(hundred) + ' শত ';
  if (remainder > 0) words += convertTwoDigits(remainder);

  return words.trim() + ' টাকা মাত্র';
}

// ----------------------------------------------------
// 1. FINANCIAL SUMMARY & P&L ANALYTICS
// ----------------------------------------------------
router.get('/summary', authenticate, (req, res) => {
  try {
    const db = getDB();
    const invoices = db.invoices || [];
    const expenses = db.expenses || [];
    const payroll = db.payroll || [];

    // Total Inflow: Paid Student Fees
    const totalFeeIncome = invoices
      .filter((i) => i.status === 'PAID')
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    // Total Outflow: Approved General Expenses
    const totalGeneralExpenses = expenses
      .filter((e) => e.status === 'APPROVED')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    // Total Outflow: Paid Teacher Salaries
    const totalSalaryDisbursed = payroll
      .filter((p) => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + (Number(p.paidAmount || p.netPayable) || 0), 0);

    // Pending Payroll
    const pendingSalaryAmount = payroll
      .filter((p) => p.paymentStatus === 'PENDING')
      .reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);

    const totalOutflow = totalGeneralExpenses + totalSalaryDisbursed;
    const netBalance = totalFeeIncome - totalOutflow;

    // Monthly Analytics for recent months
    const monthlyOverview = [
      {
        month: 'মে ২০২৬',
        income: 32000,
        expense: 28000,
        payroll: 120000,
        totalExpense: 148000,
        net: -116000
      },
      {
        month: 'জুন ২০২৬',
        income: 38500,
        expense: 31200,
        payroll: 145000,
        totalExpense: 176200,
        net: -137700
      },
      {
        month: 'জুলাই ২০২৬',
        income: 44000,
        expense: 59500,
        payroll: 190600,
        totalExpense: 250100,
        net: -206100
      },
      {
        month: 'আগস্ট ২০২৬ (চলতি)',
        income: totalFeeIncome,
        expense: totalGeneralExpenses,
        payroll: totalSalaryDisbursed,
        totalExpense: totalOutflow,
        net: netBalance
      }
    ];

    // Expense breakdown by category
    const categoryMap = {};
    expenses
      .filter((e) => e.status === 'APPROVED')
      .forEach((e) => {
        const cat = e.categoryBn || e.category || 'অন্যান্য';
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
      });

    const categoryBreakdown = Object.keys(categoryMap).map((k) => ({
      category: k,
      amount: categoryMap[k],
      percentage: totalGeneralExpenses > 0 ? Math.round((categoryMap[k] / totalGeneralExpenses) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        totalFeeIncome,
        totalGeneralExpenses,
        totalSalaryDisbursed,
        pendingSalaryAmount,
        totalOutflow,
        netBalance,
        monthlyOverview,
        categoryBreakdown,
        totalTeachersOnPayroll: (db.teachers || []).length,
        totalExpenseVouchers: expenses.length
      }
    });
  } catch (err) {
    console.error('Accounts summary error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 2. EXPENSE MANAGEMENT
// ----------------------------------------------------
router.get('/expenses', authenticate, (req, res) => {
  try {
    const db = getDB();
    let list = db.expenses || [];
    const { category, startDate, endDate, paymentMethod, search } = req.query;

    if (category && category !== 'ALL') {
      list = list.filter((e) => e.category === category);
    }
    if (paymentMethod && paymentMethod !== 'ALL') {
      list = list.filter((e) => e.paymentMethod === paymentMethod);
    }
    if (startDate) {
      list = list.filter((e) => e.expenseDate >= startDate);
    }
    if (endDate) {
      list = list.filter((e) => e.expenseDate <= endDate);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.voucherNo && e.voucherNo.toLowerCase().includes(q)) ||
          (e.recipientName && e.recipientName.toLowerCase().includes(q)) ||
          (e.categoryBn && e.categoryBn.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    list.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

    const totalAmount = list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    res.json({
      success: true,
      data: {
        expenses: list,
        totalCount: list.length,
        totalAmount
      }
    });
  } catch (err) {
    console.error('Expenses list error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/expenses', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { category, categoryBn, title, description, amount, expenseDate, paymentMethod, recipientName, remarks } = req.body;

    if (!title || !amount || !expenseDate) {
      return res.status(400).json({ success: false, error: { message: 'শিরোনাম, পরিমাণ ও তারিখ আবশ্যক।' } });
    }

    const expenses = db.expenses || [];
    const newId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
    const now = new Date();
    const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
    const voucherNo = `EXP-${now.getFullYear()}-${monthStr}${newId.toString().padStart(2, '0')}`;

    const newExpense = {
      id: newId,
      voucherNo,
      category: category || 'OTHERS',
      categoryBn: categoryBn || 'অন্যান্য আনুষঙ্গিক',
      title,
      description: description || '',
      amount: Number(amount),
      expenseDate: expenseDate || now.toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'CASH',
      recipientName: recipientName || 'সাধারণ ভেন্ডর',
      paidByUserId: req.user?.id || 1,
      status: 'APPROVED',
      remarks: remarks || '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    expenses.unshift(newExpense);
    db.expenses = expenses;
    saveDB(db);

    res.json({
      success: true,
      message: 'নতুন খরচ ভাউচার সফলভাবে সংরক্ষণ করা হয়েছে!',
      data: newExpense
    });
  } catch (err) {
    console.error('Expense create error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.put('/expenses/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const expenses = db.expenses || [];
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(400).json({ success: false, error: { message: 'খরচ ভাউচার পাওয়া যায়নি।' } });
    }

    const { category, categoryBn, title, description, amount, expenseDate, paymentMethod, recipientName, remarks } = req.body;

    expenses[index] = {
      ...expenses[index],
      category: category || expenses[index].category,
      categoryBn: categoryBn || expenses[index].categoryBn,
      title: title || expenses[index].title,
      description: description !== undefined ? description : expenses[index].description,
      amount: amount ? Number(amount) : expenses[index].amount,
      expenseDate: expenseDate || expenses[index].expenseDate,
      paymentMethod: paymentMethod || expenses[index].paymentMethod,
      recipientName: recipientName || expenses[index].recipientName,
      remarks: remarks !== undefined ? remarks : expenses[index].remarks,
      updatedAt: new Date().toISOString()
    };

    db.expenses = expenses;
    saveDB(db);

    res.json({
      success: true,
      message: 'খরচ ভাউচার সফলভাবে আপডেট করা হয়েছে!',
      data: expenses[index]
    });
  } catch (err) {
    console.error('Expense update error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/expenses/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const expenses = db.expenses || [];
    db.expenses = expenses.filter((e) => e.id !== id);
    saveDB(db);

    res.json({
      success: true,
      message: 'খরচ ভাউচার সফলভাবে মুছে ফেলা হয়েছে!'
    });
  } catch (err) {
    console.error('Expense delete error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 3. TEACHER PAYROLL & SALARY MANAGEMENT
// ----------------------------------------------------
router.get('/payroll', authenticate, (req, res) => {
  try {
    const db = getDB();
    let list = db.payroll || [];
    const { month, teacherId, status } = req.query;

    if (month && month !== 'ALL') {
      list = list.filter((p) => p.month === month);
    }
    if (teacherId && teacherId !== 'ALL') {
      list = list.filter((p) => Number(p.teacherId) === Number(teacherId));
    }
    if (status && status !== 'ALL') {
      list = list.filter((p) => p.paymentStatus === status);
    }

    list.sort((a, b) => b.id - a.id);

    const totalNetPayable = list.reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);
    const totalPaid = list
      .filter((p) => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + (Number(p.paidAmount || p.netPayable) || 0), 0);
    const totalPending = list
      .filter((p) => p.paymentStatus === 'PENDING')
      .reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);

    res.json({
      success: true,
      data: {
        payroll: list,
        totalCount: list.length,
        totalNetPayable,
        totalPaid,
        totalPending
      }
    });
  } catch (err) {
    console.error('Payroll list error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Generate monthly payroll for all teachers or a specific teacher
router.post('/payroll/generate', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { month, monthBn, year, teacherId } = req.body;

    if (!month) {
      return res.status(400).json({ success: false, error: { message: 'মাস নির্বাচন আবশ্যক।' } });
    }

    const teachers = db.teachers || [];
    const users = db.users || [];
    const salaryStructures = db.salaryStructures || [];
    const existingPayroll = db.payroll || [];

    const targetTeachers = teacherId
      ? teachers.filter((t) => Number(t.id) === Number(teacherId))
      : teachers;

    let generatedCount = 0;

    for (const t of targetTeachers) {
      // Check if already generated for this month
      const alreadyExists = existingPayroll.some(
        (p) => Number(p.teacherId) === Number(t.id) && p.month === month
      );
      if (alreadyExists) continue;

      const user = users.find((u) => u.id === t.userId) || {};
      const struct = salaryStructures.find((s) => Number(s.teacherId) === Number(t.id)) || {
        baseSalary: 30000,
        houseRentAllowance: 4000,
        medicalAllowance: 1500,
        conveyanceAllowance: 1500,
        providentFundDeduction: 1500,
        taxDeduction: 500,
        bankAccountNo: user.phone || '01711000000',
        salaryType: 'MONTHLY_FIXED'
      };

      const baseSalary = Number(struct.baseSalary || 30000);
      const allowances = {
        houseRent: Number(struct.houseRentAllowance || 0),
        medical: Number(struct.medicalAllowance || 0),
        conveyance: Number(struct.conveyanceAllowance || 0),
        performanceBonus: 1000
      };
      const totalAllowances = Object.values(allowances).reduce((sum, v) => sum + v, 0);

      const deductions = {
        providentFund: Number(struct.providentFundDeduction || 0),
        tax: Number(struct.taxDeduction || 0),
        advanceSalary: 0,
        absentDeduction: 0
      };
      const totalDeductions = Object.values(deductions).reduce((sum, v) => sum + v, 0);
      const netPayable = baseSalary + totalAllowances - totalDeductions;

      const newId = existingPayroll.length > 0 ? Math.max(...existingPayroll.map((p) => p.id)) + 1 : 1;
      const monthShort = month.replace('-', '');
      const payslipNo = `PAY-${monthShort}-${newId.toString().padStart(3, '0')}`;

      existingPayroll.unshift({
        id: newId,
        payslipNo,
        teacherId: t.id,
        teacherName: user.name || t.nameBn || 'শিক্ষক',
        teacherEmail: user.email || '',
        month,
        monthBn: monthBn || month,
        year: year || Number(month.split('-')[0]),
        salaryType: struct.salaryType || 'MONTHLY_FIXED',
        baseSalary,
        allowances,
        totalAllowances,
        deductions,
        totalDeductions,
        netPayable,
        paidAmount: 0,
        paymentStatus: 'PENDING',
        paymentMethod: struct.salaryType === 'PER_CLASS' ? 'BKASH' : 'BANK_TRANSFER',
        paymentDate: null,
        transactionId: null,
        bankAccountNo: struct.bankAccountNo || struct.mobileWalletNumber || '',
        remarks: 'অনুমোদনের অপেক্ষায়',
        preparedByUserId: req.user?.id || 1,
        approvedByUserId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      generatedCount++;
    }

    db.payroll = existingPayroll;
    saveDB(db);

    res.json({
      success: true,
      message: `${generatedCount} জন শিক্ষকের ${monthBn || month} মাসের বেতন সফলভাবে প্রস্তুত হয়েছে!`
    });
  } catch (err) {
    console.error('Payroll generate error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Pay / Disburse Payroll
router.post('/payroll/pay/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const { paymentMethod, paymentDate, transactionId, paidAmount, remarks } = req.body;

    const payroll = db.payroll || [];
    const index = payroll.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'পেরোল রেকর্ড পাওয়া যায়নি।' } });
    }

    const item = payroll[index];
    const amountToPay = paidAmount !== undefined ? Number(paidAmount) : item.netPayable;

    payroll[index] = {
      ...item,
      paidAmount: amountToPay,
      paymentStatus: 'PAID',
      paymentMethod: paymentMethod || item.paymentMethod || 'BANK_TRANSFER',
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      transactionId: transactionId || `NGA-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      remarks: remarks || 'বেতন সফলভাবে প্রদান করা হয়েছে',
      approvedByUserId: req.user?.id || 1,
      updatedAt: new Date().toISOString()
    };

    db.payroll = payroll;
    saveDB(db);

    res.json({
      success: true,
      message: `${item.teacherName}-এর বেতন সফলভাবে প্রদান ও পে-স্লিপ আপডেট সম্পন্ন হয়েছে!`,
      data: payroll[index]
    });
  } catch (err) {
    console.error('Payroll pay error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Detailed 360° Pay Slip for printing / PDF
router.get('/payroll/payslip/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const payroll = db.payroll || [];
    const item = payroll.find((p) => p.id === id);

    if (!item) {
      return res.status(404).json({ success: false, error: { message: 'পে-স্লিপ পাওয়া যায়নি।' } });
    }

    const teachers = db.teachers || [];
    const users = db.users || [];
    const teacher = teachers.find((t) => t.id === item.teacherId) || {};
    const user = users.find((u) => u.id === teacher.userId) || {};
    const salaryStructures = db.salaryStructures || [];
    const struct = salaryStructures.find((s) => Number(s.teacherId) === Number(item.teacherId)) || {};

    const payslipData = {
      institute: {
        nameBn: 'নেক্সটজেন একাডেমি',
        nameEn: 'NextGen ACADEMY',
        tagline: 'LEARN · GROW · SUCCEED',
        address: 'বাড়ি নং-১২, রোড নং-০৫, ধানমন্ডি, ঢাকা-১২০৯',
        phone: '+880 1800-NEXTGEN',
        email: 'accounts@nextgen.edu.bd',
        website: 'https://nextgen.edu.bd'
      },
      payslipNo: item.payslipNo,
      month: item.month,
      monthBn: item.monthBn,
      year: item.year,
      paymentDate: item.paymentDate || 'অপেক্ষমাণ',
      paymentStatus: item.paymentStatus,
      paymentMethod: item.paymentMethod,
      transactionId: item.transactionId || 'প্রযোজ্য নয়',
      teacher: {
        id: item.teacherId,
        teacherIdNumber: teacher.teacherIdNumber || `NGA-TCH-0${item.teacherId}`,
        name: item.teacherName,
        designation: teacher.designation || 'সহকারী শিক্ষক',
        department: teacher.department || 'সাধারণ শিক্ষা',
        phone: user.phone || teacher.phone || '01700000000',
        email: item.teacherEmail,
        bankName: struct.bankName || 'ব্যাংক অ্যাকাউন্ট',
        bankAccountNo: item.bankAccountNo || struct.bankAccountNo || 'N/A',
        joiningDate: teacher.joiningDate || '2024-01-01'
      },
      salaryType: item.salaryType,
      totalClassesTaken: item.totalClassesTaken || 0,
      earnings: [
        { titleBn: 'মূল বেতন (Basic Salary)', amount: item.baseSalary },
        { titleBn: 'বাড়ি ভাড়া ভাতা (House Rent)', amount: item.allowances?.houseRent || 0 },
        { titleBn: 'চিকিৎসা ভাতা (Medical Allowance)', amount: item.allowances?.medical || 0 },
        { titleBn: 'যাতায়াত ভাতা (Conveyance Allowance)', amount: item.allowances?.conveyance || 0 },
        { titleBn: 'পারফরম্যান্স ও স্পেশাল বোনাস', amount: item.allowances?.performanceBonus || 0 }
      ],
      totalEarnings: item.baseSalary + item.totalAllowances,
      deductions: [
        { titleBn: 'প্রভিডেন্ট ফান্ড (Provident Fund)', amount: item.deductions?.providentFund || 0 },
        { titleBn: 'উৎস কর কর্তন (Income Tax)', amount: item.deductions?.tax || 0 },
        { titleBn: 'অগ্রিম বেতন সমন্বয় (Advance)', amount: item.deductions?.advanceSalary || 0 },
        { titleBn: 'অনুপস্থিতি কর্তন (Absence)', amount: item.deductions?.absentDeduction || 0 }
      ],
      totalDeductions: item.totalDeductions,
      netPayable: item.netPayable,
      paidAmount: item.paidAmount || (item.paymentStatus === 'PAID' ? item.netPayable : 0),
      netAmountInWords: numberToBanglaWords(item.netPayable),
      remarks: item.remarks || '',
      authorizedSignatures: {
        accountant: 'হিসাবরক্ষক কর্মকর্তা',
        principal: 'অধ্যক্ষ / প্রিন্সিপাল',
        receiver: 'শিক্ষকের স্বাক্ষর ও তারিখ'
      }
    };

    res.json({
      success: true,
      data: payslipData
    });
  } catch (err) {
    console.error('Payslip details error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Teacher's salary structures
router.get('/salary-structures', authenticate, (req, res) => {
  try {
    const db = getDB();
    const teachers = db.teachers || [];
    const users = db.users || [];
    const structures = db.salaryStructures || [];

    const enriched = teachers.map((t) => {
      const user = users.find((u) => u.id === t.userId) || {};
      const struct = structures.find((s) => Number(s.teacherId) === Number(t.id)) || {
        salaryType: 'MONTHLY_FIXED',
        baseSalary: 30000,
        perClassRate: 0,
        houseRentAllowance: 4000,
        medicalAllowance: 1500,
        conveyanceAllowance: 1500,
        providentFundDeduction: 1500,
        taxDeduction: 500,
        bankName: 'ডাচ-বাংলা ব্যাংক (DBBL)',
        bankAccountNo: '115.120.0000',
        mobileWalletNumber: user.phone || '01711000000'
      };

      return {
        teacherId: t.id,
        teacherName: user.name || t.nameBn || 'শিক্ষক',
        designation: t.designation || 'সহকারী শিক্ষক',
        department: t.department || 'শিক্ষা বিভাগ',
        phone: user.phone || '01700000000',
        ...struct
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    console.error('Salary structures error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.put('/salary-structures/:teacherId', authenticate, (req, res) => {
  try {
    const db = getDB();
    const teacherId = Number(req.params.teacherId);
    let structures = db.salaryStructures || [];
    const index = structures.findIndex((s) => Number(s.teacherId) === teacherId);

    const updatedData = {
      teacherId,
      salaryType: req.body.salaryType || 'MONTHLY_FIXED',
      baseSalary: Number(req.body.baseSalary || 30000),
      perClassRate: Number(req.body.perClassRate || 0),
      houseRentAllowance: Number(req.body.houseRentAllowance || 0),
      medicalAllowance: Number(req.body.medicalAllowance || 0),
      conveyanceAllowance: Number(req.body.conveyanceAllowance || 0),
      providentFundDeduction: Number(req.body.providentFundDeduction || 0),
      taxDeduction: Number(req.body.taxDeduction || 0),
      bankName: req.body.bankName || '',
      bankAccountNo: req.body.bankAccountNo || '',
      mobileWalletNumber: req.body.mobileWalletNumber || '',
      effectiveDate: req.body.effectiveDate || new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    if (index >= 0) {
      structures[index] = { ...structures[index], ...updatedData };
    } else {
      const newId = structures.length > 0 ? Math.max(...structures.map((s) => s.id)) + 1 : 1;
      structures.push({ id: newId, ...updatedData });
    }

    db.salaryStructures = structures;
    saveDB(db);

    res.json({
      success: true,
      message: 'শিক্ষক বেতন চুক্তি ও কাঠামো সফলভাবে সংরক্ষণ করা হয়েছে!'
    });
  } catch (err) {
    console.error('Salary structure update error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 4. CASHBOOK & COMBINED FINANCIAL LEDGER
// ----------------------------------------------------
router.get('/cashbook', authenticate, (req, res) => {
  try {
    const db = getDB();
    const invoices = db.invoices || [];
    const expenses = db.expenses || [];
    const payroll = db.payroll || [];
    const students = db.students || [];
    const users = db.users || [];

    const transactions = [];

    // Inflows from Paid Invoices
    invoices
      .filter((i) => i.status === 'PAID')
      .forEach((inv) => {
        const student = students.find((s) => s.id === inv.studentId) || {};
        const user = users.find((u) => u.id === student.userId) || {};
        transactions.push({
          id: `INC-${inv.id}`,
          date: inv.paidDate || inv.createdAt?.split('T')[0] || '2026-08-01',
          type: 'INCOME',
          category: 'শিক্ষার্থী ফি আদায়',
          title: `টিউশন ফি আদায় - ${user.name || 'শিক্ষার্থী'} (রোল ${student.rollNo || '০১'})`,
          referenceNo: inv.invoiceNo,
          paymentMethod: inv.paymentMethod || 'BKASH',
          inflow: Number(inv.amount || 0),
          outflow: 0,
          remarks: `ট্রানজেকশন আইডি: ${inv.transactionId || 'N/A'}`
        });
      });

    // Outflows from General Expenses
    expenses
      .filter((e) => e.status === 'APPROVED')
      .forEach((exp) => {
        transactions.push({
          id: `EXP-${exp.id}`,
          date: exp.expenseDate,
          type: 'EXPENSE',
          category: exp.categoryBn || 'সাধারণ খরচ',
          title: exp.title,
          referenceNo: exp.voucherNo,
          paymentMethod: exp.paymentMethod,
          inflow: 0,
          outflow: Number(exp.amount || 0),
          remarks: `প্রাপক: ${exp.recipientName} (${exp.remarks || ''})`
        });
      });

    // Outflows from Paid Teacher Payroll
    payroll
      .filter((p) => p.paymentStatus === 'PAID')
      .forEach((pay) => {
        transactions.push({
          id: `PAY-${pay.id}`,
          date: pay.paymentDate || pay.createdAt?.split('T')[0],
          type: 'PAYROLL',
          category: 'শিক্ষক সম্মানী ও বেতন',
          title: `${pay.teacherName} - ${pay.monthBn} বেতন`,
          referenceNo: pay.payslipNo,
          paymentMethod: pay.paymentMethod,
          inflow: 0,
          outflow: Number(pay.paidAmount || pay.netPayable || 0),
          remarks: `TrxID: ${pay.transactionId || 'N/A'}`
        });
      });

    // Sort chronologically (oldest to newest for running balance)
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate Running Balance
    let currentBalance = 0;
    const ledger = transactions.map((tx) => {
      currentBalance += tx.inflow - tx.outflow;
      return {
        ...tx,
        balanceAfter: currentBalance
      };
    });

    // Reverse for UI display (newest first)
    const displayLedger = [...ledger].reverse();

    const totalInflow = transactions.reduce((sum, t) => sum + t.inflow, 0);
    const totalOutflow = transactions.reduce((sum, t) => sum + t.outflow, 0);

    res.json({
      success: true,
      data: {
        ledger: displayLedger,
        totalInflow,
        totalOutflow,
        closingBalance: currentBalance,
        totalTransactions: displayLedger.length
      }
    });
  } catch (err) {
    console.error('Cashbook error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 5. OFFLINE / CASH FEE COLLECTION & MONEY RECEIPT
// ----------------------------------------------------
router.post('/offline-cash', authenticate, (req, res) => {
  try {
    const db = getDB();
    const {
      studentId,
      feeType,
      month,
      year = 2026,
      baseAmount,
      discountAmount = 0,
      discountReason = '',
      paidAmount,
      receivedBy,
      paymentDate = new Date().toISOString().split('T')[0],
      remarks = ''
    } = req.body;

    if (!studentId || !feeType || !baseAmount) {
      return res.status(400).json({
        success: false,
        error: { message: 'শিক্ষার্থী, ফি শিরোনাম এবং মূল টাকার পরিমাণ আবশ্যক।' }
      });
    }

    const students = db.students || [];
    const users = db.users || [];
    const classes = db.classes || [];
    const sections = db.sections || [];
    const student = students.find((s) => Number(s.id) === Number(studentId));

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি।' } });
    }

    const studentUser = users.find((u) => u.id === student.userId) || {};
    const studentClass = classes.find((c) => Number(c.id) === Number(student.classId)) || {};
    const studentSection = sections.find((s) => Number(s.id) === Number(student.sectionId)) || {};
    const guardians = db.guardian_student_mappings || [];
    const guardianMap = guardians.find((g) => Number(g.studentId) === Number(student.id));
    const guardianUser = guardianMap ? users.find((u) => u.id === guardianMap.parentUserId) : null;

    const base = Number(baseAmount) || 0;
    const disc = Number(discountAmount) || 0;
    const finalPaid = paidAmount !== undefined ? Number(paidAmount) : Math.max(0, base - disc);

    // Auto-generate Unique Receipt Number & Transaction ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const invoiceNo = `NGA-REC-${year || 2026}-${randomSuffix}`;
    const transactionId = `CASH-TXN-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    const invoices = db.invoices || [];
    const newInvoiceId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;

    const newInvoice = {
      id: newInvoiceId,
      invoiceNo,
      studentId: Number(student.id),
      titleBn: feeType,
      titleEn: feeType,
      month: month || 'Current',
      year: Number(year) || 2026,
      baseAmount: base,
      discountType: disc > 0 ? 'FLAT' : 'NONE',
      discountValue: disc,
      discountReason: discountReason || null,
      discountAmount: disc,
      amount: finalPaid,
      dueDate: paymentDate,
      status: 'PAID',
      paidDate: paymentDate,
      paymentMethod: 'CASH',
      receivedBy: receivedBy || req.user?.name || 'অফিস ক্যাশ কাউন্টার',
      transactionId,
      remarks,
      createdAt: now,
      updatedAt: now
    };

    invoices.push(newInvoice);
    db.invoices = invoices;

    // Create Payment Record
    const payments = db.payments || [];
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.id)) + 1 : 1;
    const newPayment = {
      id: newPaymentId,
      invoiceId: newInvoiceId,
      transactionId,
      method: 'CASH',
      amount: finalPaid,
      paidByUserId: req.user?.id || 1,
      paymentStatus: 'SUCCESS',
      simulationMeta: {
        paymentType: 'OFFLINE_CASH',
        collector: receivedBy || req.user?.name || 'হিসাবরক্ষক',
        remarks
      },
      paidAt: `${paymentDate}T12:00:00.000Z`,
      createdAt: now,
      updatedAt: now
    };

    payments.push(newPayment);
    db.payments = payments;

    // Create Audit Log
    const auditLogs = db.audit_logs || [];
    const newAuditId = auditLogs.length > 0 ? Math.max(...auditLogs.map((a) => a.id)) + 1 : 1;
    auditLogs.push({
      id: newAuditId,
      userId: req.user?.id || 1,
      action: 'OFFLINE_CASH_PAYMENT_COLLECTED',
      details: `ক্যাশ ফি আদায় সম্পন্ন: ${studentUser.name || 'শিক্ষার্থী'} (রোল ${student.rollNo}), পরিমাণ: ৳ ${finalPaid.toLocaleString('en-BD')}, রসিদ নং: ${invoiceNo}`,
      ipAddress: req.ip || '127.0.0.1',
      createdAt: now
    });
    db.audit_logs = auditLogs;

    saveDB(db);

    // Formulate printable Money Receipt
    const receiptData = {
      receiptNo: invoiceNo,
      transactionId,
      date: paymentDate,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      invoiceId: newInvoiceId,
      institute: {
        nameBn: 'নেক্সটজেন একাডেমি',
        nameEn: 'NextGen ACADEMY',
        tagline: 'LEARN · GROW · SUCCEED',
        address: 'বাড়ি নং-১২, রোড নং-০৫, ধানমন্ডি, ঢাকা-১২০৯',
        phone: '+880 1800-NEXTGEN',
        email: 'accounts@nextgen.edu.bd',
        website: 'https://nextgen.edu.bd',
        eiin: 'NGA-DHAKA-2026',
        logoUrl: '/logo.png'
      },
      student: {
        id: student.id,
        studentIdNumber: student.studentIdNumber || `NGA-STU-0${student.id}`,
        name: studentUser.name || 'শিক্ষার্থী',
        rollNo: student.rollNo || '০১',
        className: studentClass.nameBn || `শ্রেণি ${student.classId}`,
        sectionName: studentSection.nameBn || 'শাখা ক',
        guardianName: guardianUser?.name || 'অভিভাবক',
        guardianPhone: guardianUser?.phone || studentUser.phone || '০১৭০০০০০০০০'
      },
      paymentDetails: {
        feeType,
        month: month || 'চলতি মাস',
        year: Number(year) || 2026,
        baseAmount: base,
        discountAmount: disc,
        discountReason: discountReason || 'প্রযোজ্য নয়',
        paidAmount: finalPaid,
        amountInWords: numberToBanglaWords(finalPaid),
        paymentMethod: 'সরাসরি নগদ (Cash Collection)',
        receivedBy: receivedBy || req.user?.name || 'হিসাব শাখা',
        remarks: remarks || 'নগদে সফলভাবে ফি আদায় হয়েছে।'
      },
      signatures: {
        collector: receivedBy || req.user?.name || 'আদায়কারীর স্বাক্ষর',
        accountant: 'হিসাবরক্ষক কর্মকর্তা',
        payer: 'শিক্ষার্থী / অভিভাবকের স্বাক্ষর',
        principal: 'অধ্যক্ষ / অনুমোদিত স্বাক্ষর'
      }
    };

    res.status(201).json({
      success: true,
      message: 'ক্যাশ ফি সফলভাবে আদায় হয়েছে ও মানি রিসিট প্রস্তুত!',
      data: {
        invoice: newInvoice,
        payment: newPayment,
        receipt: receiptData
      }
    });
  } catch (err) {
    console.error('Offline cash payment error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Detailed printable Money Receipt Slip for any invoice
router.get('/receipt/:invoiceId', authenticate, (req, res) => {
  try {
    const db = getDB();
    const invoiceId = Number(req.params.invoiceId);
    const invoices = db.invoices || [];
    const invoice = invoices.find((i) => i.id === invoiceId);

    if (!invoice) {
      return res.status(404).json({ success: false, error: { message: 'ইনভয়েস বা মানি রিসিট পাওয়া যায়নি।' } });
    }

    const students = db.students || [];
    const users = db.users || [];
    const classes = db.classes || [];
    const sections = db.sections || [];
    const student = students.find((s) => Number(s.id) === Number(invoice.studentId)) || {};
    const studentUser = users.find((u) => u.id === student.userId) || {};
    const studentClass = classes.find((c) => Number(c.id) === Number(student.classId)) || {};
    const studentSection = sections.find((s) => Number(s.id) === Number(student.sectionId)) || {};
    const guardians = db.guardian_student_mappings || [];
    const guardianMap = guardians.find((g) => Number(g.studentId) === Number(student.id));
    const guardianUser = guardianMap ? users.find((u) => u.id === guardianMap.parentUserId) : null;

    const finalPaid = Number(invoice.amount) || 0;
    const base = Number(invoice.baseAmount) || finalPaid;
    const disc = Number(invoice.discountAmount) || 0;

    const receiptData = {
      receiptNo: invoice.invoiceNo,
      transactionId: invoice.transactionId || `TXN-${invoice.id}`,
      date: invoice.paidDate || invoice.dueDate || new Date().toISOString().split('T')[0],
      time: '১২:৩০ অপরাহ্ন',
      invoiceId: invoice.id,
      institute: {
        nameBn: 'নেক্সটজেন একাডেমি',
        nameEn: 'NextGen ACADEMY',
        tagline: 'LEARN · GROW · SUCCEED',
        address: 'বাড়ি নং-১২, রোড নং-০৫, ধানমন্ডি, ঢাকা-১২০৯',
        phone: '+880 1800-NEXTGEN',
        email: 'accounts@nextgen.edu.bd',
        website: 'https://nextgen.edu.bd',
        eiin: 'NGA-DHAKA-2026',
        logoUrl: '/logo.png'
      },
      student: {
        id: student.id,
        studentIdNumber: student.studentIdNumber || `NGA-STU-0${student.id}`,
        name: studentUser.name || 'শিক্ষার্থী',
        rollNo: student.rollNo || '০১',
        className: studentClass.nameBn || `শ্রেণি ${student.classId}`,
        sectionName: studentSection.nameBn || 'শাখা ক',
        guardianName: guardianUser?.name || 'অভিভাবক',
        guardianPhone: guardianUser?.phone || studentUser.phone || '০১৭০০০০০০০০'
      },
      paymentDetails: {
        feeType: invoice.titleBn || 'টিউশন ফি',
        month: invoice.month || 'চলতি মাস',
        year: Number(invoice.year) || 2026,
        baseAmount: base,
        discountAmount: disc,
        discountReason: invoice.discountReason || 'প্রযোজ্য নয়',
        paidAmount: finalPaid,
        amountInWords: numberToBanglaWords(finalPaid),
        paymentMethod: invoice.paymentMethod === 'CASH' ? 'সরাসরি নগদ (Cash)' : (invoice.paymentMethod || 'ডিজিটাল পেমেন্ট'),
        receivedBy: invoice.receivedBy || 'হিসাব শাখা',
        remarks: invoice.remarks || (invoice.status === 'PAID' ? 'ফি সম্পূর্ণ পরিশোধিত।' : 'বকেয়া ইনভয়েস')
      },
      signatures: {
        collector: invoice.receivedBy || 'আদায়কারীর স্বাক্ষর',
        accountant: 'হিসাবরক্ষক কর্মকর্তা',
        payer: 'শিক্ষার্থী / অভিভাবকের স্বাক্ষর',
        principal: 'অধ্যক্ষ / অনুমোদিত স্বাক্ষর'
      }
    };

    res.json({
      success: true,
      data: receiptData
    });
  } catch (err) {
    console.error('Receipt generation error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
