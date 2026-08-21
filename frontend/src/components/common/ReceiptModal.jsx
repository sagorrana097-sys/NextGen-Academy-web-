import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  X,
  Printer,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Building,
  Phone,
  QrCode,
  Sparkles,
  Receipt
} from 'lucide-react';

export default function ReceiptModal({ receipt, isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const academyName = settings?.academyName || 'নেক্সটজেন একাডেমি';
  const academyNameEn = settings?.academyNameEn || 'NEXTGEN ACADEMY';
  const hotline = settings?.hotline || '01792818005';
  const email = settings?.email || 'admin@nextgen.edu.bd';
  const address = settings?.address || 'গাজীপুর ক্যাম্পাস, ঢাকা, বাংলাদেশ';
  const logoUrl = settings?.logoUrl || '/logo.png';

  const receiptNo = receipt.receiptNo || `MR-2026-${String(receipt.id || Math.floor(Math.random()*90000 + 10000))}`;
  const trxId = receipt.transactionId || receipt.trxId || 'BKASH-TXN-99824';
  const studentName = receipt.studentName || receipt.student?.user?.name || 'শিক্ষার্থী';
  const studentId = receipt.studentIdNumber || receipt.student?.studentIdNumber || 'NGA-2026-801';
  const className = receipt.className || receipt.student?.class?.nameBn || '১০ম শ্রেণি (SSC)';
  const sectionName = receipt.sectionName || receipt.student?.section?.nameBn || 'পদ্মা';
  const baseAmount = Number(receipt.baseAmount || receipt.amountPaid || 3500);
  const discountAmount = Number(receipt.discountAmount || 0);
  const netPaid = Number(receipt.amountPaid || baseAmount - discountAmount);
  const paymentMethod = receipt.method || receipt.paymentMethod || 'bKash Digital MFS';
  const paidAt = receipt.paidAt ? new Date(receipt.paidAt).toLocaleString('bn-BD') : new Date().toLocaleString('bn-BD');

  const qrData = `https://nextgen.edu.bd/verify/receipt?receiptNo=${receiptNo}&trx=${trxId}&amount=${netPaid}&date=${encodeURIComponent(paidAt)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-money-receipt-sheet, #printable-money-receipt-sheet * {
            visibility: visible;
          }
          #printable-money-receipt-sheet {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
            z-index: 99999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {lang === 'bn' ? 'অফিসিয়াল পেমেন্ট মানি রিসিট' : 'Official Payment Money Receipt'}
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">রসিদ নং: {receiptNo}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <div
            id="printable-money-receipt-sheet"
            className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-5 text-slate-800 relative"
          >
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={logoUrl} alt="Watermark" className="w-80 h-80 object-contain" />
            </div>

            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300 space-y-1 relative z-10">
              <div className="flex items-center justify-center space-x-2.5 mb-1.5">
                <img
                  src={logoUrl}
                  alt="NextGen Logo"
                  className="w-10 h-10 object-contain rounded-full bg-slate-900 p-1 shadow"
                />
                <div className="text-left">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {academyName}
                  </h2>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-english">
                    {academyNameEn}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-medium">
                {address} • হেল্পলাইন: {hotline} • ইমেইল: {email}
              </p>

              <div className="pt-2 flex items-center justify-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black uppercase font-mono">
                  MONEY RECEIPT #{receiptNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  সেশন: ২০২৬
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200 relative z-10">
              <div>
                <span className="text-slate-500 font-medium block">শিক্ষার্থীর নাম:</span>
                <strong className="font-bold text-slate-900 text-sm">{studentName}</strong>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">শিক্ষার্থী আইডি নং:</span>
                <strong className="font-mono font-bold text-indigo-700">{studentId}</strong>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">শ্রেণি ও শাখা:</span>
                <strong className="font-bold text-slate-800">{className} ({sectionName})</strong>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">পরিশোধের মাধ্যম:</span>
                <strong className="font-bold text-emerald-700">{paymentMethod}</strong>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">ট্রানজেকশন আইডি (TrxID):</span>
                <strong className="font-mono font-bold text-slate-900">{trxId}</strong>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">পরিশোধের সময়:</span>
                <strong className="font-medium text-slate-700">{paidAt}</strong>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-xl border border-slate-300 overflow-hidden relative z-10">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-left">বিবরণ (Description)</th>
                    <th className="py-2.5 px-3 text-right">পরিমাণ (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <div>
                        <span>{receipt.invoiceTitleBn || 'মাসিক টিউশন ও কোচিং ফি'}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Invoice #{receipt.invoiceNo || 'INV-2026'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      ৳ {baseAmount.toLocaleString('en-BD')}
                    </td>
                  </tr>

                  {discountAmount > 0 && (
                    <tr className="bg-emerald-50/50">
                      <td className="py-2 px-3 text-emerald-800 font-semibold">
                        <div className="flex items-center space-x-1.5">
                          <span>প্রদত্ত বিশেষ স্কলারশিপ / ওয়েভার ছাড়</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            {receipt.discountReason === 'MERIT_SCHOLARSHIP'
                              ? 'মেধাবৃত্তি'
                              : receipt.discountReason === 'SIBLING_DISCOUNT'
                              ? 'সহোদর ছাড়'
                              : 'অনুমোদিত ছাড়'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        - ৳ {discountAmount.toLocaleString('en-BD')}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-emerald-50/90 border-t-2 border-emerald-300 font-black text-xs">
                  <tr>
                    <td className="py-3 px-3 text-slate-900">সর্বমোট পরিশোধিত (Net Paid Amount):</td>
                    <td className="py-3 px-3 text-right text-emerald-800 text-base font-mono">
                      ৳ {netPaid.toLocaleString('en-BD')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Official Stamps, QR & Signature */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 relative z-10">
              {/* Green Verified Stamp */}
              <div className="flex items-center space-x-3">
                <div className="px-3.5 py-1.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider transform -rotate-3 flex items-center space-x-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>PAID & VERIFIED</span>
                </div>

                <div className="hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-medium">ডিজিটাল অনলাইন পেমেন্ট</p>
                  <p className="text-[9px] font-bold text-emerald-700">স্বয়ংক্রিয়ভাবে অনুমোদিত</p>
                </div>
              </div>

              {/* QR Code & Signature */}
              <div className="flex items-center space-x-3">
                <img
                  src={qrCodeUrl}
                  alt="Receipt Verification QR"
                  className="w-14 h-14 p-0.5 bg-white border border-slate-300 rounded-lg shadow-sm"
                />

                <div className="text-right">
                  <p className="text-[11px] font-serif italic text-indigo-900 font-bold underline">NextGen Accounts</p>
                  <p className="text-[9px] text-slate-500 font-bold">অনুমোদিত হিসাব কর্মকর্তা</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center space-x-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>মানি রিসিট প্রিন্ট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
