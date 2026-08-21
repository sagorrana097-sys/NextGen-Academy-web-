import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  Trash2,
  X,
  Check,
  ShieldAlert
} from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  itemType = 'আইটেম',
  loading = false
}) {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100 animate-in zoom-in-95 duration-150 relative overflow-hidden">
        {/* Glowing Danger Aura */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 text-rose-600">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-inner">
              <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {title || (lang === 'bn' ? 'স্থায়ীভাবে মুছে ফেলার সতর্কতা' : 'Permanent Deletion Warning')}
              </h3>
              <p className="text-[11px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">
                {itemType} Deletion Safeguard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-3 pt-1">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {message || (
              lang === 'bn'
                ? `আপনি কি নিশ্চিতভাবে এই ${itemType}টি সিস্টেম থেকে চিরতরে মুছে ফেলতে চান? এই পদক্ষেপটি অপরিবর্তনীয়।`
                : `Are you sure you want to permanently delete this ${itemType}? This action cannot be undone.`
            )}
          </p>

          {itemName && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-mono font-bold text-slate-800 break-all flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{itemName}</span>
            </div>
          )}

          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-[11px] text-rose-800 font-medium leading-normal flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>সতর্কতা: মুছে ফেলার সাথে সাথে সংশ্লিষ্ট সকল তথ্য এবং নির্ভরশীল রেকর্ড স্থায়ীভাবে ডাটাবেজ থেকে বিলুপ্ত হবে।</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? (lang === 'bn' ? 'মুছে ফেলা হচ্ছে...' : 'Deleting...') : (lang === 'bn' ? 'হ্যাঁ, নিশ্চিত ডিলিট করুন' : 'Confirm Delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
