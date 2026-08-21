import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { accountsAPI } from '../../services/api';
import OfflineCashPaymentModal from './OfflineCashPaymentModal';
import MoneyReceiptModal from '../common/MoneyReceiptModal';
import { exportToCSV } from '../../utils/exportUtils';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Calendar,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  UserCheck,
  FileText,
  Wallet,
  Receipt,
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';

export default function AccountsAndPayroll() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  // Active Sub-tab: 'analytics' | 'expenses' | 'payroll' | 'cashbook'
  const [activeTab, setActiveTab] = useState('analytics');

  // Summary State
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Offline Cash Payment & Receipt Modal States
  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);
  const [currentReceiptData, setCurrentReceiptData] = useState(null);

  // Expenses State
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('ALL');
  const [expenseMethodFilter, setExpenseMethodFilter] = useState('ALL');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    category: 'OFFICE_STATIONERY',
    categoryBn: 'অফিস স্টেশনারি ও প্রিন্টিং',
    title: '',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    recipientName: '',
    remarks: ''
  });

  // Payroll State
  const [payrollList, setPayrollList] = useState([]);
  const [loadingPayroll, setLoadingPayroll] = useState(false);
  const [payrollMonthFilter, setPayrollMonthFilter] = useState('2026-08');
  const [payrollStatusFilter, setPayrollStatusFilter] = useState('ALL');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayItem, setSelectedPayItem] = useState(null);
  const [payFormData, setPayFormData] = useState({
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    remarks: ''
  });

  // Pay Slip Modal State
  const [selectedPayslipId, setSelectedPayslipId] = useState(null);
  const [payslipData, setPayslipData] = useState(null);
  const [loadingPayslip, setLoadingPayslip] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Salary Structure State
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [showSalaryStructureModal, setShowSalaryStructureModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);

  // Cashbook State
  const [cashbookData, setCashbookData] = useState(null);
  const [loadingCashbook, setLoadingCashbook] = useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState(null);

  const expenseCategories = [
    { key: 'ACADEMY_RENT', bn: 'একাডেমির ক্যাম্পাস ভাড়া' },
    { key: 'UTILITIES_INTERNET', bn: 'বিদ্যুৎ ও ইন্টারনেট বিল' },
    { key: 'OFFICE_STATIONERY', bn: 'অফিস স্টেশনারি ও প্রিন্টিং' },
    { key: 'ENTERTAINMENT', bn: 'আপ্যায়ন ও স্টাফ রিফ্রেশমেন্ট' },
    { key: 'MARKETING_PROMOTION', bn: 'প্রচার ও ডিজিটাল মার্কেটিং' },
    { key: 'MAINTENANCE', bn: 'রক্ষণাবেক্ষণ ও মেরামত' },
    { key: 'SOFTWARE_IT', bn: 'সফটওয়্যার, সার্ভার ও এসএমএস' },
    { key: 'OTHERS', bn: 'অন্যান্য আনুষঙ্গিক' }
  ];

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadSummary();
    } else if (activeTab === 'expenses') {
      fetchExpenses();
    } else if (activeTab === 'payroll') {
      fetchPayroll();
    } else if (activeTab === 'cashbook') {
      fetchCashbook();
    }
  }, [activeTab, expenseCategoryFilter, expenseMethodFilter, payrollMonthFilter, payrollStatusFilter]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // 1. Load Financial Summary
  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await accountsAPI.getSummary();
      if (res.success && res.data) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error('Summary load error:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // 2. Fetch Expenses
  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const res = await accountsAPI.getExpenses({
        category: expenseCategoryFilter,
        paymentMethod: expenseMethodFilter,
        search: expenseSearch
      });
      if (res.success && res.data) {
        setExpenses(res.data.expenses || []);
      }
    } catch (err) {
      console.error('Expenses load error:', err);
    } finally {
      setLoadingExpenses(false);
    }
  };

  // 3. Fetch Payroll
  const fetchPayroll = async () => {
    setLoadingPayroll(true);
    try {
      const res = await accountsAPI.getPayroll({
        month: payrollMonthFilter,
        status: payrollStatusFilter
      });
      if (res.success && res.data) {
        setPayrollList(res.data.payroll || []);
      }
    } catch (err) {
      console.error('Payroll load error:', err);
    } finally {
      setLoadingPayroll(false);
    }
  };

  // 4. Fetch Cashbook
  const fetchCashbook = async () => {
    setLoadingCashbook(true);
    try {
      const res = await accountsAPI.getCashbook();
      if (res.success && res.data) {
        setCashbookData(res.data);
      }
    } catch (err) {
      console.error('Cashbook load error:', err);
    } finally {
      setLoadingCashbook(false);
    }
  };

  // Save or Update Expense
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      const selectedCat = expenseCategories.find((c) => c.key === expenseForm.category);
      const payload = {
        ...expenseForm,
        categoryBn: selectedCat ? selectedCat.bn : 'অন্যান্য'
      };

      if (editingExpense) {
        await accountsAPI.updateExpense(editingExpense.id, payload);
        showToast('খরচ ভাউচার সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await accountsAPI.addExpense(payload);
        showToast('নতুন খরচ ভাউচার সফলভাবে সংরক্ষণ করা হয়েছে!');
      }

      setShowAddExpenseModal(false);
      setEditingExpense(null);
      setExpenseForm({
        category: 'OFFICE_STATIONERY',
        categoryBn: 'অফিস স্টেশনারি ও প্রিন্টিং',
        title: '',
        description: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'CASH',
        recipientName: '',
        remarks: ''
      });
      fetchExpenses();
      loadSummary();
    } catch (err) {
      alert(err.message || 'খরচ সংরক্ষণে ত্রুটি হয়েছে');
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই খরচ ভাউচারটি মুছে ফেলতে চান?')) return;
    try {
      await accountsAPI.deleteExpense(id);
      showToast('খরচ ভাউচার মুছে ফেলা হয়েছে!');
      fetchExpenses();
      loadSummary();
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে');
    }
  };

  // Generate Monthly Payroll
  const handleGeneratePayroll = async (month, monthBn) => {
    try {
      const res = await accountsAPI.generatePayroll({ month, monthBn });
      showToast(res.message || 'মাসিক বেতন তালিকা প্রস্তুত হয়েছে!');
      setShowGenerateModal(false);
      fetchPayroll();
      loadSummary();
    } catch (err) {
      alert(err.message || 'বেতন প্রস্তুত করতে সমস্যা হয়েছে');
    }
  };

  // Disburse / Pay Salary
  const handleDisbursePayment = async (e) => {
    e.preventDefault();
    if (!selectedPayItem) return;
    try {
      const res = await accountsAPI.paySalary(selectedPayItem.id, payFormData);
      showToast(res.message || 'বেতন সফলভাবে পরিশোধ করা হয়েছে!');
      setShowPayModal(false);
      setSelectedPayItem(null);
      fetchPayroll();
      loadSummary();
    } catch (err) {
      alert(err.message || 'বেতন পরিশোধে সমস্যা হয়েছে');
    }
  };

  // View Pay Slip
  const handleViewPayslip = async (id) => {
    setSelectedPayslipId(id);
    setShowPayslipModal(true);
    setLoadingPayslip(true);
    try {
      const res = await accountsAPI.getPayslip(id);
      if (res.success && res.data) {
        setPayslipData(res.data);
      }
    } catch (err) {
      console.error('Payslip load error:', err);
    } finally {
      setLoadingPayslip(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case 'BKASH':
        return <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 font-bold text-[10px]">বিকাশ</span>;
      case 'NAGAD':
        return <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold text-[10px]">নগদ</span>;
      case 'BANK_TRANSFER':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">ব্যাংক ট্রান্সফার</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">ক্যাশ (নগদ)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60 print:hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Wallet className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অ্যাকাউন্টিং, পেরোল ও লেজার ম্যানেজমেন্ট' : 'Accounting & Payroll Management'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('accountsPayrollTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('accountsPayrollSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => setShowCashPaymentModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <Banknote className="w-4 h-4" />
              <span>+ ক্যাশ ফি আদায়</span>
            </button>

            <button
              onClick={() => {
                setEditingExpense(null);
                setShowAddExpenseModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addExpenseVoucher')}</span>
            </button>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>মাসিক বেতন প্রস্তুত</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 shadow-inner w-fit print:hidden">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{t('analyticsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'expenses'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Receipt className="w-4 h-4 text-rose-200" />
          <span>{t('expensesTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'payroll'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-300" />
          <span>{t('payrollTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('cashbook')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'cashbook'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{t('cashbookTab')}</span>
        </button>

        <button
          onClick={() => {
            if (activeTab === 'expenses') {
              exportToCSV('Expense_Vouchers', [
                { label: 'ভাউচার নং', key: 'voucherNo' },
                { label: 'বিবরণ', key: 'title' },
                { label: 'ক্যাটাগরি', key: 'category' },
                { label: 'পরিমাণ (৳)', key: 'amount' },
                { label: 'তারিখ', key: 'expenseDate' },
                { label: 'পেমেন্ট মাধ্যম', key: 'paymentMethod' }
              ], expenses);
            } else if (activeTab === 'payroll') {
              exportToCSV('Payroll_Report', [
                { label: 'শিক্ষক/স্টাফ নাম', key: 'teacherName' },
                { label: 'পদবি', key: 'designation' },
                { label: 'মাস', key: 'month' },
                { label: 'মূল বেতন', key: 'baseSalary' },
                { label: 'মোট প্রদেয়', key: 'netPayable' },
                { label: 'স্ট্যাটাস', key: 'status' }
              ], payrollList);
            } else {
              exportToCSV('Cashbook_Ledger', [
                { label: 'তারিখ', key: 'date' },
                { label: 'টাইপ', key: 'type' },
                { label: 'বিবরণ', key: 'description' },
                { label: 'জমা/আদায় (৳)', key: 'income' },
                { label: 'খরচ/ব্যয় (৳)', key: 'expense' },
                { label: 'পেমেন্ট মেথড', key: 'method' }
              ], cashbookData?.entries || []);
            }
          }}
          className="ml-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm active:scale-95"
          title="বর্তমান টেবিলের হিসাব এক্সেল ফাইলে এক্সপোর্ট করুন"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Excel এক্সপোর্ট</span>
        </button>
      </div>

      {/* Toast Notification */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in print:hidden ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* SUB-TAB 1: FINANCIAL OVERVIEW & P&L ANALYTICS */}
      {activeTab === 'analytics' && summaryData && (
        <div className="space-y-6">
          {/* 4 Hero KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Fee Income */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">{t('totalFeeIncome')}</span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-3 font-mono">
                ৳{summaryData.totalFeeIncome.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">
                ✓ আদায়কৃত শিক্ষার্থী টিউশন ও সেশন ফি
              </span>
            </div>

            {/* General Expenses */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">{t('totalGeneralExpenses')}</span>
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-rose-600 mt-3 font-mono">
                ৳{summaryData.totalGeneralExpenses.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-rose-700 font-bold mt-1 inline-block">
                {summaryData.totalExpenseVouchers}টি ভাউচার (ক্যাম্পাস ভাড়া, ইউটিলিটি সহ)
              </span>
            </div>

            {/* Teacher Payroll */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">{t('totalSalaryDisbursed')}</span>
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-indigo-700 mt-3 font-mono">
                ৳{summaryData.totalSalaryDisbursed.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-indigo-700 font-bold mt-1 inline-block">
                বকেয়া বেতন: ৳{summaryData.pendingSalaryAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Net Balance / Operating Balance */}
            <div className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden ${
              summaryData.netBalance >= 0 ? 'bg-emerald-900 text-white border-emerald-800' : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-xs font-bold uppercase">{t('netBalance')}</span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400 mt-3 font-mono">
                ৳{summaryData.netBalance.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-300 font-bold mt-1 inline-block">
                মোট আউটফ্লো: ৳{summaryData.totalOutflow.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Monthly Comparison Grid & Expense Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>মাসিক আয়-ব্যয় তুলনামূলক বিবরণী (২০২৬)</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">মাস</th>
                      <th className="py-2.5 px-3 text-right">আদায়কৃত ফি</th>
                      <th className="py-2.5 px-3 text-right">সাধারণ খরচ</th>
                      <th className="py-2.5 px-3 text-right">শিক্ষক বেতন</th>
                      <th className="py-2.5 px-3 text-right font-black">মোট খরচ</th>
                      <th className="py-2.5 px-3 text-right font-black">ব্যালেন্স</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {summaryData.monthlyOverview.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{m.month}</td>
                        <td className="p-3 text-right font-mono text-emerald-700 font-bold">৳{m.income.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono text-slate-700">৳{m.expense.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono text-slate-700">৳{m.payroll.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono text-rose-700 font-black">৳{m.totalExpense.toLocaleString('en-IN')}</td>
                        <td className={`p-3 text-right font-mono font-black ${m.net >= 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                          ৳{m.net.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expense Distribution Badges */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <span>খাতভিত্তিক খরচের বণ্টন (%)</span>
              </h3>

              <div className="space-y-3 pt-2">
                {summaryData.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{cat.category}</span>
                      <span className="text-slate-900 font-mono">৳{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EXPENSE MANAGEMENT */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Header & Controls */}
          <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-rose-400" />
                <span>দৈনিক ও মাসিক খরচ ভাউচার খাতা (Expense Log)</span>
              </h3>
              <p className="text-xs text-slate-300">
                ক্যাম্পাস ভাড়া, ইউটিলিটি, স্টেশনারি ও আপ্যায়ন খরচের স্বচ্ছ ভাউচার ট্র্যাকিং
              </p>
            </div>

            <button
              onClick={() => {
                setEditingExpense(null);
                setShowAddExpenseModal(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addExpenseVoucher')}</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">খাত / ক্যাটাগরি</label>
              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
              >
                <option value="ALL">-- সকল ক্যাটাগরি --</option>
                {expenseCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.bn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">পেমেন্ট মেথড</label>
              <select
                value={expenseMethodFilter}
                onChange={(e) => setExpenseMethodFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
              >
                <option value="ALL">-- সকল মেথড --</option>
                <option value="CASH">ক্যাশ (নগদ)</option>
                <option value="BKASH">বিকাশ</option>
                <option value="NAGAD">নগদ</option>
                <option value="BANK_TRANSFER">ব্যাংক ট্রান্সফার</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">সার্চ (ভাউচার নং / শিরোনাম)</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="ভাউচার নং বা শিরোনাম লিখুন..."
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchExpenses()}
                  className="w-full pl-9 p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          {loadingExpenses ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold">খরচের তালিকা লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 w-32">ভাউচার নং</th>
                    <th className="py-3 px-3 w-28">তারিখ</th>
                    <th className="py-3 px-3">খাত / ক্যাটাগরি</th>
                    <th className="py-3 px-4 min-w-[200px]">খরচের বিবরণ</th>
                    <th className="py-3 px-3">প্রাপক / ভেন্ডর</th>
                    <th className="py-3 px-3 text-center">মেথড</th>
                    <th className="py-3 px-3 text-right font-black">পরিমাণ (টাকা)</th>
                    <th className="py-3 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{exp.voucherNo}</td>
                      <td className="p-3 text-slate-600">{exp.expenseDate}</td>
                      <td className="p-3 font-bold text-indigo-900">{exp.categoryBn}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{exp.title}</div>
                        {exp.description && <div className="text-[10px] text-slate-500">{exp.description}</div>}
                      </td>
                      <td className="p-3 text-slate-700">{exp.recipientName}</td>
                      <td className="p-3 text-center">{getMethodBadge(exp.paymentMethod)}</td>
                      <td className="p-3 text-right font-mono font-black text-rose-700 text-sm">
                        ৳{exp.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingExpense(exp);
                              setExpenseForm({
                                category: exp.category,
                                categoryBn: exp.categoryBn,
                                title: exp.title,
                                description: exp.description || '',
                                amount: exp.amount,
                                expenseDate: exp.expenseDate,
                                paymentMethod: exp.paymentMethod,
                                recipientName: exp.recipientName,
                                remarks: exp.remarks || ''
                              });
                              setShowAddExpenseModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: TEACHER PAYROLL & SALARY SLIPS */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>শিক্ষক সম্মানী ও মাসিক বেতন ব্যবস্থাপনা (Payroll Hub)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  মাসিক ফিক্সড ও ক্লাস ভিত্তিক বেতন অনুমোদন, পেমেন্ট ও ডিজিটাল পে-স্লিপ জেনারেশন
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>মাসিক বেতন প্রস্তুত</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">বেতনের মাস</label>
                <select
                  value={payrollMonthFilter}
                  onChange={(e) => setPayrollMonthFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                >
                  <option value="2026-08">আগস্ট ২০২৬ (চলতি মাস)</option>
                  <option value="2026-07">জুলাই ২০২৬</option>
                  <option value="2026-06">জুন ২০২৬</option>
                  <option value="ALL">-- সকল মাস --</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">পেমেন্ট স্ট্যাটাস</label>
                <select
                  value={payrollStatusFilter}
                  onChange={(e) => setPayrollStatusFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                >
                  <option value="ALL">-- সকল স্ট্যাটাস --</option>
                  <option value="PAID">পরিশোধিত (PAID)</option>
                  <option value="PENDING">বকেয়া / অপেক্ষমাণ (PENDING)</option>
                </select>
              </div>
            </div>

            {/* Payroll Table */}
            {loadingPayroll ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold">বেতন তালিকা লোড হচ্ছে...</p>
              </div>
            ) : (
              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-3 w-32">পে-স্লিপ নং</th>
                      <th className="py-3 px-4 min-w-[180px]">শিক্ষকের নাম</th>
                      <th className="py-3 px-3 text-center">চুক্তি ধরণ</th>
                      <th className="py-3 px-3 text-right">মূল বেতন</th>
                      <th className="py-3 px-3 text-right text-emerald-700">ভাতা (+)</th>
                      <th className="py-3 px-3 text-right text-rose-700">কর্তন (-)</th>
                      <th className="py-3 px-3 text-right font-black">নিট প্রদেয়</th>
                      <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                      <th className="py-3 px-3 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {payrollList.map((p) => {
                      const isPaid = p.paymentStatus === 'PAID';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{p.payslipNo}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{p.teacherName}</div>
                            <div className="text-[10px] text-slate-500">{p.bankAccountNo || 'অ্যাকাউন্ট'}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {p.salaryType === 'PER_CLASS' ? 'ক্লাস ভিত্তিক' : 'মাসিক ফিক্সড'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">
                            ৳{p.baseSalary.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                            +৳{p.totalAllowances.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right font-mono text-rose-700 font-bold">
                            -৳{p.totalDeductions.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right font-mono font-black text-indigo-900 text-sm">
                            ৳{p.netPayable.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isPaid ? '✓ পরিশোধিত' : '⏳ বকেয়া'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              {!isPaid && (
                                <button
                                  onClick={() => {
                                    setSelectedPayItem(p);
                                    setPayFormData({
                                      paymentMethod: p.paymentMethod || 'BANK_TRANSFER',
                                      paymentDate: new Date().toISOString().split('T')[0],
                                      transactionId: '',
                                      remarks: ''
                                    });
                                    setShowPayModal(true);
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center space-x-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>পে করুন</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleViewPayslip(p.id)}
                                className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>পে-স্লিপ</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CASHBOOK & FINANCIAL STATEMENT */}
      {activeTab === 'cashbook' && cashbookData && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>কম্বাইন্ড ক্যাশবুক ও লেজার স্টেটমেন্ট (Cashbook Ledger)</span>
              </h3>
              <p className="text-xs text-slate-300">
                সকল ফি আদায় (ইনফ্লো), সাধারণ ব্যয় ও শিক্ষক বেতন (আউটফ্লো)-এর দৈনিক ব্যালেন্স লেজার
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4 text-cyan-300" />
              <span>{t('printCashbook')}</span>
            </button>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3 w-28">তারিখ</th>
                  <th className="py-3 px-3 w-32">ভাউচার/ইনভয়েস</th>
                  <th className="py-3 px-3">খাত ও বিবরণ</th>
                  <th className="py-3 px-3 text-center">মেথড</th>
                  <th className="py-3 px-3 text-right text-emerald-700 font-bold">ইনফ্লো / জমা (+)</th>
                  <th className="py-3 px-3 text-right text-rose-700 font-bold">আউটফ্লো / খরচ (-)</th>
                  <th className="py-3 px-3 text-right font-black">রানিং ব্যালেন্স</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {cashbookData.ledger.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-slate-600">{tx.date}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{tx.referenceNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{tx.title}</div>
                      <div className="text-[10px] text-slate-500">{tx.category} • {tx.remarks}</div>
                    </td>
                    <td className="p-3 text-center">{getMethodBadge(tx.paymentMethod)}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700">
                      {tx.inflow > 0 ? `৳${tx.inflow.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-700">
                      {tx.outflow > 0 ? `৳${tx.outflow.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className={`p-3 text-right font-mono font-black ${
                      tx.balanceAfter >= 0 ? 'text-emerald-800' : 'text-slate-900'
                    }`}>
                      ৳{tx.balanceAfter.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-rose-600" />
                <span>{editingExpense ? 'খরচ ভাউচার সম্পাদনা' : 'নতুন খরচ ভাউচার এন্ট্রি'}</span>
              </h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('expenseCategory')} *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:ring-2 focus:ring-rose-500"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.key} value={c.key}>{c.bn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('expenseTitle')} *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আগস্ট মাসের ভবন ভাড়া"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('expenseAmount')} *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="৳ পরিমাণ"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-rose-700 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('expenseDate')} *</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.expenseDate}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('paymentMethod')} *</label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="CASH">ক্যাশ (নগদ)</option>
                    <option value="BKASH">বিকাশ</option>
                    <option value="NAGAD">নগদ</option>
                    <option value="BANK_TRANSFER">ব্যাংক ট্রান্সফার</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('recipientName')}</label>
                  <input
                    type="text"
                    placeholder="প্রাপকের নাম / দোকান"
                    value={expenseForm.recipientName}
                    onChange={(e) => setExpenseForm({ ...expenseForm, recipientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মেমো / রেফারেন্স নোট</label>
                <input
                  type="text"
                  placeholder="মেমো নং, চেক নম্বর বা ট্রানজেকশন আইডি"
                  value={expenseForm.remarks}
                  onChange={(e) => setExpenseForm({ ...expenseForm, remarks: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERATE MONTHLY PAYROLL MODAL */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>{t('generateMonthlyPayroll')}</span>
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              সকল শিক্ষকের চুক্তিভিত্তিক মূল বেতন ও ভাতাসমূহ হিসাব করে নির্বাচিত মাসের বেতন প্রস্তুত করা হবে।
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleGeneratePayroll('2026-08', 'আগস্ট ২০২৬')}
                className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold text-xs text-left flex items-center justify-between transition-all"
              >
                <div>
                  <p className="font-black">আগস্ট ২০২৬ (চলতি মাস)</p>
                  <p className="text-[10px] text-indigo-700">৮ জন শিক্ষকের মাসিক বেতন ড্রাফট প্রস্তুত</p>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleGeneratePayroll('2026-09', 'সেপ্টেম্বর ২০২৬')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs text-left flex items-center justify-between transition-all"
              >
                <div>
                  <p className="font-black">সেপ্টেম্বর ২০২৬ (আগামী মাস)</p>
                  <p className="text-[10px] text-slate-500">অগ্রিম বেতন স্লট তৈরি</p>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DISBURSE SALARY MODAL */}
      {showPayModal && selectedPayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>{t('disburseSalary')}</span>
              </h3>
              <button onClick={() => setShowPayModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500 font-bold">শিক্ষকের নাম:</p>
              <p className="font-black text-slate-900 text-sm">{selectedPayItem.teacherName}</p>
              <p className="text-slate-500 font-bold pt-1">প্রদেয় নিট বেতন:</p>
              <p className="font-mono font-black text-emerald-700 text-lg">৳{selectedPayItem.netPayable.toLocaleString('en-IN')}</p>
            </div>

            <form onSubmit={handleDisbursePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                <select
                  value={payFormData.paymentMethod}
                  onChange={(e) => setPayFormData({ ...payFormData, paymentMethod: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BANK_TRANSFER">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                  <option value="BKASH">বিকাশ (bKash)</option>
                  <option value="NAGAD">নগদ (Nagad)</option>
                  <option value="CASH">ক্যাশ (নগদ প্রদান)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পরিশোধের তারিখ</label>
                <input
                  type="date"
                  required
                  value={payFormData.paymentDate}
                  onChange={(e) => setPayFormData({ ...payFormData, paymentDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি / চেক নং</label>
                <input
                  type="text"
                  placeholder="যেমন: NGA-PAY-880912 বা CHQ-99120"
                  value={payFormData.transactionId}
                  onChange={(e) => setPayFormData({ ...payFormData, transactionId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  নিশ্চিতভাবে প্রদান করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 360° OFFICIAL SALARY PAY-SLIP MODAL & PRINT */}
      {showPayslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-800 my-auto print:border-none print:shadow-none print:p-0">
            {/* Modal Actions Bar (Hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="font-black text-sm text-slate-900">অফিসিয়াল স্যালারি পে-স্লিপ (Pay Slip)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printPayslip')}</span>
                </button>
                <button onClick={() => setShowPayslipModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingPayslip ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold">পে-স্লিপ লোড হচ্ছে...</p>
              </div>
            ) : payslipData ? (
              <div className="space-y-6">
                {/* Official Letterhead with Logo */}
                <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b-2 border-slate-900 gap-4 text-center sm:text-left">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/logo.png"
                      alt="NextGen Academy Logo"
                      className="w-16 h-16 object-contain drop-shadow-md"
                    />
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-wide">
                        {payslipData.institute.nameBn}
                      </h1>
                      <h2 className="text-xs font-black text-indigo-950 tracking-widest uppercase">
                        {payslipData.institute.nameEn}
                      </h2>
                      <p className="text-[10px] font-bold text-amber-700 tracking-widest mt-0.5">
                        {payslipData.institute.tagline}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-1">
                        {payslipData.institute.address} • হেল্পলাইন: {payslipData.institute.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center sm:text-right text-xs">
                    <span className="text-[10px] font-black uppercase text-indigo-700 px-2.5 py-0.5 bg-indigo-50 rounded-full border border-indigo-200">
                      স্যালারি পে-স্লিপ
                    </span>
                    <p className="font-mono font-bold text-slate-900 mt-1.5">নং: {payslipData.payslipNo}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{payslipData.monthBn}</p>
                  </div>
                </div>

                {/* Teacher Metadata Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">শিক্ষকের নাম</span>
                    <span className="font-black text-slate-900 block mt-0.5">{payslipData.teacher.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">আইডি ও পদবি</span>
                    <span className="font-black text-slate-900 block mt-0.5">
                      {payslipData.teacher.teacherIdNumber} • {payslipData.teacher.designation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">মোবাইল ও বিভাগ</span>
                    <span className="font-black text-slate-900 block mt-0.5">
                      {payslipData.teacher.phone} ({payslipData.teacher.department})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">পেমেন্ট মেথড ও তারিখ</span>
                    <span className="font-black text-slate-900 block mt-0.5">
                      {payslipData.paymentMethod} • {payslipData.paymentDate}
                    </span>
                  </div>
                </div>

                {/* Earnings & Deductions Dual Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Earnings */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-emerald-50 text-emerald-900 font-bold p-2.5 border-b border-emerald-200 flex justify-between">
                      <span>আয় / সম্মানী (Earnings)</span>
                      <span>পরিমাণ (৳)</span>
                    </div>
                    <div className="divide-y divide-slate-100 p-2 space-y-1.5">
                      {payslipData.earnings.map((e, idx) => (
                        <div key={idx} className="flex justify-between py-1 px-2">
                          <span className="text-slate-700">{e.titleBn}</span>
                          <span className="font-mono font-bold text-slate-900">৳{e.amount.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-2 px-2 border-t-2 border-slate-300 font-black text-emerald-900 bg-emerald-50/50 rounded">
                        <span>মোট আয় (Gross Earnings):</span>
                        <span className="font-mono">৳{payslipData.totalEarnings.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-rose-50 text-rose-900 font-bold p-2.5 border-b border-rose-200 flex justify-between">
                      <span>কর্তন (Deductions)</span>
                      <span>পরিমাণ (৳)</span>
                    </div>
                    <div className="divide-y divide-slate-100 p-2 space-y-1.5">
                      {payslipData.deductions.map((d, idx) => (
                        <div key={idx} className="flex justify-between py-1 px-2">
                          <span className="text-slate-700">{d.titleBn}</span>
                          <span className="font-mono font-bold text-rose-700">৳{d.amount.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-2 px-2 border-t-2 border-slate-300 font-black text-rose-900 bg-rose-50/50 rounded">
                        <span>মোট কর্তন (Total Deductions):</span>
                        <span className="font-mono">৳{payslipData.totalDeductions.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Paid Hero Box */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">সর্বমোট নিট প্রদেয় বেতন (Net Payable)</span>
                    <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                      ৳{payslipData.netPayable.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-300 italic block mt-0.5">
                      কথায়: {payslipData.netAmountInWords}
                    </span>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      payslipData.paymentStatus === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-slate-950 border-amber-400'
                    }`}>
                      {payslipData.paymentStatus === 'PAID' ? '✓ পেইড (PAID)' : '⏳ আনপেইড (PENDING)'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1.5">TrxID: {payslipData.transactionId}</p>
                  </div>
                </div>

                {/* 3-Party Signatures */}
                <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs font-bold text-slate-800">
                  <div className="border-t-2 border-slate-400 pt-2">{payslipData.authorizedSignatures.accountant}</div>
                  <div className="border-t-2 border-slate-400 pt-2">{payslipData.authorizedSignatures.principal}</div>
                  <div className="border-t-2 border-slate-400 pt-2">{payslipData.authorizedSignatures.receiver}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Offline Cash Payment Modal */}
      <OfflineCashPaymentModal
        isOpen={showCashPaymentModal}
        onClose={() => setShowCashPaymentModal(false)}
        onPaymentSuccess={(receipt) => {
          setShowCashPaymentModal(false);
          setCurrentReceiptData(receipt);
          loadSummary();
          fetchExpenses();
          fetchCashbook();
          showToast('ক্যাশ ফি সফলভাবে আদায় হয়েছে ও মানি রিসিট প্রস্তুত!');
        }}
      />

      {/* Money Receipt Printable Slip Modal */}
      <MoneyReceiptModal
        receipt={currentReceiptData}
        isOpen={!!currentReceiptData}
        onClose={() => setCurrentReceiptData(null)}
      />
    </div>
  );
}
