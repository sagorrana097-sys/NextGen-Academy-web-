import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  UploadCloud,
  FileCheck,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  File,
  X,
  Sparkles,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DigitalHomeworkDropzone({ homework, onSubmitted }) {
  const { lang, t } = useLanguage();
  const [fileData, setFileData] = useState({
    fileUrl: '',
    fileName: '',
    fileSize: ''
  });
  const [studentNote, setStudentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileData.fileUrl && !studentNote.trim()) return;

    setIsSubmitting(true);
    // Simulate upload with progress
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {}
      if (onSubmitted) {
        onSubmitted({
          homeworkId: homework.id,
          fileName: fileData.fileName || 'Homework_Submission',
          fileUrl: fileData.fileUrl,
          fileSize: fileData.fileSize,
          note: studentNote
        });
      }
    }, 1000);
  };

  if (submissionSuccess) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2.5 animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-100">
          হোমওয়ার্ক সফলভাবে জমা দেওয়া হয়েছে!
        </h4>
        <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
          আপনার ফাইল ও নোট সংশ্লিষ্ট শিক্ষকের কাছে পাঠানো হয়েছে। খুব শীঘ্রই মূল্যায়ন নম্বর পাওয়া যাবে।
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-left">
      {/* Universal File Uploader */}
      <UniversalFileUploader
        label="ডিজিটাল হোমওয়ার্ক ফাইল (Homework File / Mobile Photo / Drive Link)"
        value={fileData.fileUrl}
        fileName={fileData.fileName}
        fileSize={fileData.fileSize}
        accept="*/*"
        maxMb={100}
        helperText="খাতার ছবি তুলে, PDF ফাইল হিসেবে, অথবা গুগল ড্রাইভ লিংক দিয়ে জমা দিন (Max 25MB)"
        onChange={({ fileUrl, url, fileName, fileSize }) => {
          setFileData({
            fileUrl: fileUrl || url || '',
            fileName: fileName || '',
            fileSize: fileSize || ''
          });
        }}
      />

      {/* Optional Note / Answer Textarea */}
      <div className="relative">
        <textarea
          rows={2}
          value={studentNote}
          onChange={(e) => setStudentNote(e.target.value)}
          placeholder="শিক্ষকের উদ্দেশ্যে কোনো বার্তা বা উত্তরের বিবরণ লিখুন (ঐচ্ছিক)..."
          className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || (!fileData.fileUrl && !studentNote.trim())}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isSubmitting ? 'আপলোড হচ্ছে...' : 'হোমওয়ার্ক ফাইল জমা দিন'}</span>
      </button>
    </form>
  );
}
