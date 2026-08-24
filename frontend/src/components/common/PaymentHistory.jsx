import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer,
  Receipt,
  Calendar,
  Wallet
} from 'lucide-react';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';

// Exact Requested Dummy Invoices for UI Testing
export const DUMMY_INVOICES = [
  {
    id: 101,
    invoiceId: 'INV-2608-01',
    invoiceNo: 'INV-2608-01',
    description: 'আগস্ট ২০২৬ - মাসিক বেতন',
    titleBn: 'আগস্ট ২০২৬ - মাসিক বেতন',
    titleEn: 'August 2026 - Monthly Tuition Fee',
    month: 'আগস্ট',
    year: '২০২৬',
    baseAmount: 1500,
    discount: 0,
    discountAmount: 0,
    payable: 1500,
    amount: 1500,
    dueDate: '2026-08-10',
    status: 'Unpaid',
    payments: []
  },
  {
    id: 102,
    invoiceId: 'INV-2607-05',
    invoiceNo: 'INV-2607-05',
    description: 'জুলাই ২০২৬ - মাসিক বেতন',
    titleBn: 'জুলাই ২০২৬ - মাসিক বেতন',
    titleEn: 'July 2026 - Monthly Tuition Fee',
    month: 'জুলাই',
    year: '২০২৬',
    baseAmount: 1500,
    discount: 200,
    discountAmount: 200,
    discountReason: 'MERIT_SCHOLARSHIP',
    payable: 1300,
    amount: 1300,
    dueDate: '2026-07-10',
    status: 'Paid',
    payments: [
      {
        transactionId: 'BKASH-TXN-88741',
        method: 'BKASH',
        paidAt: '2026-07-08T10:30:00.000Z'
      }
    ]
  }
];

export default function PaymentHistory({
  invoices: propInvoices = [],
  studentName = 'সাকিব আল হাসান',
  studentIdNumber = 'NGA-26-4821',
  studentClass = '৯ম শ্রেণি',
  rollNo = '০১',
  onPaymentSuccess
}) {
  const [invoices, setInvoices] = useState(propInvoices);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  // 1. Inject Demo Data if the invoices array is empty
  useEffect(() => {
    if (!propInvoices || propInvoices.length === 0) {
      setInvoices(DUMMY_INVOICES);
    } else {
      setInvoices(propInvoices);
    }
  }, [propInvoices]);

  // 2. Dynamic UI Summary Cards Calculations
  const isPaid = (status) => String(status || '').toLowerCase() === 'paid';
  const isUnpaid = (status) => String(status || '').toLowerCase() === 'unpaid';

  const totalBase = invoices.reduce(
    (sum, inv) => sum + (Number(inv.baseAmount) || Number(inv.payable) || Number(inv.amount) || 0),
    0
  );

  const totalDiscount = invoices.reduce(
    (sum, inv) => sum + (Number(inv.discount) || Number(inv.discountAmount) || 0),
    0
  );

  const totalPaid = invoices
    .filter((inv) => isPaid(inv.status))
    .reduce(
      (sum, inv) => sum + (Number(inv.payable) || Number(inv.amount) || Number(inv.baseAmount) || 0),
      0
    );

  const totalDue = invoices
    .filter((inv) => isUnpaid(inv.status))
    .reduce(
      (sum, inv) => sum + (Number(inv.payable) || Number(inv.amount) || Number(inv.baseAmount) || 0),
      0
    );

  const handleOpenReceipt = (inv) => {
    const base = Number(inv.baseAmount) || Number(inv.payable) || Number(inv.amount) || 0;
    const disc = Number(inv.discount) || Number(inv.discountAmount) || 0;
    const net = Number(inv.payable) || Number(inv.amount) || base - disc;

    setReceiptData({
      receiptNo: `RCPT-2026-${(inv.id || 102).toString().padStart(5, '0')}`,
      transactionId: inv.payments?.[0]?.transactionId || 'BKASH-TXN-88741',
      invoiceNo: inv.invoiceId || inv.invoiceNo || 'INV-2607-05',
      invoiceTitleBn: inv.description || inv.titleBn || 'জুলাই ২০২৬ - মাসিক বেতন',
      invoiceTitleEn: inv.titleEn || 'Monthly Tuition Fee',
      baseAmount: base,
      discountType: disc > 0 ? 'FIXED' : 'NONE',
      discountValue: disc,
      discountReason: inv.discountReason || 'মেধাবৃত্তি',
      discountAmount: disc,
      amountPaid: net,
      currency: 'BDT (৳)',
      method: inv.payments?.[0]?.method || 'BKASH',
      paidAt: inv.payments?.[0]?.paidAt || '2026-07-08T10:30:00.000Z',
      studentName,
      studentIdNumber,
      rollNo,
      className: studentClass
    });
  };

  const handlePaySuccess = (receipt) => {
    setSelectedInvoiceForPayment(null);
    setReceiptData(receipt);

    // Optimistically update invoice to Paid
    if (selectedInvoiceForPayment) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.invoiceId === selectedInvoiceForPayment.invoiceId || inv.id === selectedInvoiceForPayment.id
            ? {
                ...inv,
                status: 'Paid',
                payments: [
                  {
                    transactionId: receipt?.transactionId || 'BKASH-TXN-SUCCESS',
                    method: receipt?.method || 'BKASH',
                    paidAt: new Date().toISOString()
                  }
                ]
              }
            : inv
        )
      );
    }

    if (onPaymentSuccess) {
      onPaymentSuccess(receipt);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================================= */}
      {/* 2. SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Base Fee */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              মোট মূল ফি
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tracking-tight">
            ৳ {totalBase.toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
            ধার্যকৃত মোট বেস অ্যামাউন্ট
          </span>
        </div>

        {/* Total Discount / Scholarship */}
        <div className="bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 rounded-3xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              প্রাপ্ত মোট ছাড়
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2 font-mono tracking-tight">
            ৳ {totalDiscount.toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            মেধাবৃত্তি ও অনুমোদিত মওকুফ
          </span>
        </div>

        {/* Total Paid Fee */}
        <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/50 rounded-3xl p-5 border border-blue-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800">
              পরিশোধিত ফি
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2 font-mono tracking-tight">
            ৳ {totalPaid.toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-blue-600 font-semibold block mt-1">
            {invoices.filter((i) => isPaid(i.status)).length}টি ইনভয়েস পরিশোধিত
          </span>
        </div>

        {/* Current Net Due */}
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-rose-50/50 rounded-3xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
              বর্তমান নিট বকেয়া
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2 font-mono tracking-tight">
            ৳ {totalDue.toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">
            {invoices.filter((i) => isUnpaid(i.status)).length}টি ইনভয়েস অপরিশোধিত
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INVOICES TABLE CARD */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>ফি ও পেমেন্ট হিস্ট্রি (Fees & Payment History)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              মাসিক বেতন, স্কলারশিপ ডিসকাউন্ট এবং ডিজিটাল মানি রিসিট সংগ্রহ করুন
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200/70 shadow-sm">
              {studentClass} • রোল: {rollNo}
            </span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200">
              <tr>
                <th className="p-3.5">ইনভয়েস নম্বর</th>
                <th className="p-3.5">ফি বিবরণ</th>
                <th className="p-3.5 text-right">মূল ফি</th>
                <th className="p-3.5 text-center">ছাড় / স্কলারশিপ</th>
                <th className="p-3.5 text-right">প্রদেয় মোট ফি</th>
                <th className="p-3.5 text-center">জমার শেষ তারিখ</th>
                <th className="p-3.5 text-center">স্ট্যাটাস</th>
                <th className="p-3.5 text-center">অ্যাকশন (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.map((inv, idx) => {
                const base = Number(inv.baseAmount) || Number(inv.payable) || Number(inv.amount) || 0;
                const disc = Number(inv.discount) || Number(inv.discountAmount) || 0;
                const net = Number(inv.payable) || Number(inv.amount) || base - disc;
                const unpaid = isUnpaid(inv.status);
                const paid = isPaid(inv.status);

                return (
                  <tr key={inv.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Invoice ID */}
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {inv.invoiceId || inv.invoiceNo || `INV-2608-0${idx + 1}`}
                    </td>

                    {/* Description */}
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800 text-xs">
                        {inv.description || inv.titleBn || 'মাসিক বেতন'}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {inv.month || 'আগস্ট'} {inv.year || '২০২৬'}
                      </span>
                    </td>

                    {/* Base Amount */}
                    <td className="p-3.5 text-right font-semibold text-slate-700 font-mono">
                      ৳ {base.toLocaleString('en-BD')}
                    </td>

                    {/* Discount */}
                    <td className="p-3.5 text-center">
                      {disc > 0 ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-black text-[10px] border border-emerald-200 font-mono">
                            - ৳ {disc.toLocaleString('en-BD')}
                          </span>
                          <span className="text-[9px] text-emerald-700 font-bold mt-0.5">
                            {inv.discountReason === 'MERIT_SCHOLARSHIP' ? 'মেধাবৃত্তি' : 'অনুমোদিত ছাড়'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">-</span>
                      )}
                    </td>

                    {/* Payable Net Amount */}
                    <td className="p-3.5 text-right font-black text-slate-900 text-sm font-mono">
                      ৳ {net.toLocaleString('en-BD')}
                    </td>

                    {/* Due Date */}
                    <td className="p-3.5 text-center text-slate-500 font-mono font-medium">
                      {inv.dueDate}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          paid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {paid ? 'পরিশোধিত (Paid)' : 'বকেয়া (Unpaid)'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 text-center">
                      {unpaid ? (
                        /* Emerald Pay Now Button */
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceForPayment(inv)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-600/25 flex items-center space-x-1.5 mx-auto transition-all transform active:scale-95 border border-emerald-400/30"
                          title="বিকাশ / নগদ দিয়ে ফি পরিশোধ করুন"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>পরিশোধ করুন (Pay Now)</span>
                        </button>
                      ) : (
                        /* Gray/Blue Receipt Download Button */
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(inv)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-blue-200/80 text-xs font-bold shadow-sm flex items-center space-x-1.5 mx-auto transition-all transform active:scale-95"
                          title="মানি রিসিট দেখুন ও প্রিন্ট করুন"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-600" />
                          <span>রশিদ (Receipt)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Modal (bKash, Nagad, etc.) */}
      {selectedInvoiceForPayment && (
        <PaymentModal
          invoice={selectedInvoiceForPayment}
          isOpen={!!selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onPaymentSuccess={handlePaySuccess}
        />
      )}

      {/* Money Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          receipt={receiptData}
          isOpen={!!receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
}
