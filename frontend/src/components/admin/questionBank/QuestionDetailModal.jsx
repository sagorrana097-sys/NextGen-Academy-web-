import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit,
  Save,
  Tag,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';
import api from '../../../services/api';

export default function QuestionDetailModal({ question, onClose, onQuestionUpdated }) {
  if (!question) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    questionText: question.questionText || '',
    answer: question.answer || '',
    explanation: question.explanation || '',
    chapter: question.chapter || '',
    topic: question.topic || '',
    difficulty: question.difficulty || 'MEDIUM',
    options: question.options || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await api.put(`/questions/${question.id}`, formData);
      setSaveMessage('সফলভাবে আপডেট করা হয়েছে!');
      setIsEditing(false);
      if (onQuestionUpdated) onQuestionUpdated(res.data?.data || formData);
    } catch (err) {
      console.error('Update question error:', err);
      setSaveMessage('আপডেট ব্যর্থ হয়েছে: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const originalFileUrl = question.originalFileUrl || question.fileUrl || (question.googleDriveFileId ? `https://drive.google.com/file/d/${question.googleDriveFileId}/view` : null);
  const downloadUrl = question.downloadOriginalUrl || (question.sourceMaterialId ? `/api/materials/${question.sourceMaterialId}/download` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-400 font-mono font-bold text-xs">
              {question.questionType || 'MCQ'} #{question.id}
            </span>
            <h3 className="text-base font-bold text-white">
              প্রশ্ন বিস্তারিত ও উৎস ট্র্যাকিং
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center space-x-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>সম্পাদনা</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs transition"
              >
                বাতিল
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* QUESTION STEM */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">প্রশ্নের মূল বক্তব্য (Question Stem)</label>
            {isEditing ? (
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              />
            ) : (
              <div className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap font-sans">
                {question.questionText}
              </div>
            )}
          </div>

          {/* OPTIONS */}
          <div className="space-y-3">
            <label className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">অপশনসমূহ (Options)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isEditing ? formData.options : (question.options || [])).map((opt, idx) => {
                const isCorrect = (isEditing ? formData.answer : question.answer) === opt.key;
                return (
                  <div
                    key={opt.key || idx}
                    onClick={() => isEditing && setFormData({ ...formData, answer: opt.key })}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    } ${isEditing ? 'cursor-pointer hover:border-slate-700' : ''}`}
                  >
                    <div className="flex items-center space-x-2.5 w-full">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                            setFormData({ ...formData, options: newOpts });
                          }}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white w-full"
                        />
                      ) : (
                        <span className="truncate">{opt.text}</span>
                      )}
                    </div>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXPLANATION */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <label className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">উত্তর ও ব্যাখ্যা (Explanation)</label>
            {isEditing ? (
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={2}
                placeholder="সঠিক উত্তরের ব্যাখ্যা লিখুন..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              />
            ) : (
              <div className="text-xs text-slate-300 leading-relaxed">
                {question.explanation || 'কোনো ব্যাখ্যা সংযুক্ত করা হয়নি।'}
              </div>
            )}
          </div>

          {/* ACADEMIC METADATA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block">বোর্ড ও সাল</span>
              <span className="font-bold text-indigo-300 text-xs">{question.board} '{String(question.year).slice(-2)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">অধ্যায়</span>
              <span className="font-bold text-slate-200 text-xs truncate block">{question.chapter || 'সাধারণ'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">টপিক</span>
              <span className="font-bold text-slate-200 text-xs truncate block">{question.topic || 'সাধারণ'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">কঠিন্যতার স্তর</span>
              <span className="font-bold text-slate-200 text-xs">{question.difficulty || 'MEDIUM'}</span>
            </div>
          </div>

          {/* ORIGINAL FILE TRACEABILITY & DOWNLOAD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>মূল উৎস ফাইল (Original Immutable File)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                উৎস ফাইল: <span className="text-white font-mono">{question.sourceFileName || 'original_document.docx'}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {originalFileUrl && (
                <a
                  href={originalFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ড্রাইভে দেখুন</span>
                </a>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>মূল ফাইল ডাউনলোড</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        {isEditing && (
          <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
