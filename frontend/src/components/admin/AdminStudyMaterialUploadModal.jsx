import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  Sparkles,
  Loader2,
  Trash2,
  Eye,
  RefreshCw,
  BookOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Music,
  Film,
  File
} from 'lucide-react';
import { materialAPI } from '../../services/api';
import {
  uploadToSupabaseStorage,
  formatFileSize,
  getFileTypeCategory,
  GLOBAL_ACCEPTED_FILE_TYPES,
  GLOBAL_MAX_FILE_SIZE_MB
} from '../../services/supabaseStorage';

export default function AdminStudyMaterialUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text'
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '', details: '' }

  // List of existing source materials
  const [sourceMaterials, setSourceMaterials] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSourceMaterials();
      setFeedback(null);
    }
  }, [isOpen]);

  const fetchSourceMaterials = async () => {
    try {
      setLoadingList(true);
      const res = await materialAPI.getSourceMaterials();
      if (res && res.data) {
        setSourceMaterials(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch source materials:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > GLOBAL_MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFeedback({
          type: 'error',
          message: `ফাইলের আকার ${GLOBAL_MAX_FILE_SIZE_MB}MB এর চেয়ে বেশি হতে পারবে না (বর্তমান: ${formatFileSize(file.size)})`
        });
        setSelectedFile(null);
        setFilePreviewUrl('');
        return;
      }

      setSelectedFile(file);

      // Create preview URL for images or documents
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (re) => setFilePreviewUrl(re.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreviewUrl('');
      }

      if (!title) {
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(baseName);
      }
      setFeedback(null);
    }
  };

  const handleProcessAndUpload = async (e) => {
    e.preventDefault();
    if (uploadMode === 'file' && !selectedFile) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি ফাইল সিলেক্ট করুন।' });
      return;
    }
    if (uploadMode === 'text' && !pastedText.trim()) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে স্টাডি সোর্স টেক্সট পেস্ট করুন।' });
      return;
    }
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'সোর্স ডকুমেন্টের শিরোনাম (Title) দিন।' });
      return;
    }

    try {
      setIsProcessing(true);
      setFeedback(null);

      let publicUploadedUrl = '';
      let extractedContent = pastedText.trim();

      // 1. Direct Client-Side Supabase Upload (Bypasses Vercel 4.5MB Serverless Limit)
      if (uploadMode === 'file' && selectedFile) {
        // Direct browser-to-Supabase upload
        const uploadResult = await uploadToSupabaseStorage(selectedFile, {
          bucket: 'general-uploads',
          folder: 'study-materials',
          maxMb: GLOBAL_MAX_FILE_SIZE_MB
        });

        publicUploadedUrl = uploadResult.publicUrl;

        // If it's a text-based file, read directly in client
        if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
          extractedContent = await selectedFile.text();
        } else if (!extractedContent) {
          extractedContent = `[${selectedFile.name}] (${formatFileSize(selectedFile.size)}) - সোর্স ম্যাটেরিয়াল ফাইল সংযুক্ত।`;
        }
      }

      // 2. Save metadata & content to database via API
      const res = await materialAPI.createStudyMaterial({
        title: title.trim(),
        titleBn: title.trim(),
        category,
        content_text: extractedContent,
        contentText: extractedContent,
        fileUrl: publicUploadedUrl,
        fileName: selectedFile ? selectedFile.name : '',
        fileSize: selectedFile ? formatFileSize(selectedFile.size) : '',
        fileType: selectedFile ? selectedFile.name.split('.').pop().toUpperCase() : 'TXT'
      });

      if (res && (res.success || res.data)) {
        const created = res.data;
        const charCount = created?.content_text?.length || extractedContent.length || 0;

        setFeedback({
          type: 'success',
          message: 'স্টাডি ম্যাটেরিয়াল সফলভাবে ক্লাউড স্টোরেজে আপলোড ও ডাটাবেজে সংরক্ষণ করা হয়েছে!',
          details: `"${created.title || title}" ক্লাউডে সংরক্ষিত হয়েছে (${charCount.toLocaleString('bn-BD')}টি অক্ষর)। এটি এখন AI প্রশ্ন তৈরিতে সরাসরি ব্যবহার করা যাবে।`
        });

        // Reset form
        setTitle('');
        setSelectedFile(null);
        setFilePreviewUrl('');
        setPastedText('');
        fetchSourceMaterials();

        if (onUploadSuccess) onUploadSuccess(created);
      } else {
        throw new Error(res?.error?.message || res?.message || 'আপলোড ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error('Process & Upload Error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'ফাইল প্রসেসিংয়ের সময় সমস্যা দেখা দিয়েছে।'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই সোর্স ডকুমেন্টটি মুছে ফেলতে চান?')) return;
    try {
      await materialAPI.deleteMaterial(id);
      fetchSourceMaterials();
    } catch (err) {
      alert('ডিলিট ব্যর্থ হয়েছে: ' + err.message);
    }
  };

  if (!isOpen) return null;

  const fileMeta = selectedFile ? getFileTypeCategory(selectedFile.name, selectedFile.type) : null;
  const isImageFile = selectedFile && (selectedFile.type.startsWith('image/') || fileMeta?.type === 'IMAGE');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden text-white flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white flex items-center space-x-2">
                <span>স্টাডি ম্যাটেরিয়াল ও সোর্স-কনটেক্সট এআই প্রসেসর</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
                  Universal File Storage
                </span>
              </h3>
              <p className="text-xs text-indigo-200/80">
                যেকোনো ফাইল (PDF, Word, Excel, ZIP, ইত্যাদি) আপলোড করুন বা টেক্সট পেস্ট করে প্রশ্ন তৈরি করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Feedback Toast Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 animate-in fade-in duration-200 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-sm">{feedback.message}</h4>
                {feedback.details && (
                  <p className="text-xs opacity-90 leading-relaxed font-sans">{feedback.details}</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleProcessAndUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  সোর্স ম্যাটেরিয়াল শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: ১০ম শ্রেণি পদার্থবিজ্ঞান - অধ্যায় ২ গতি শিট"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">ক্যাটাগরি / বিষয়</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="GENERAL">সাধারণ (General)</option>
                  <option value="PHYSICS">পদার্থবিজ্ঞান (Physics)</option>
                  <option value="CHEMISTRY">রসায়ন (Chemistry)</option>
                  <option value="MATH">উচ্চতর গণিত (Higher Math)</option>
                  <option value="BIOLOGY">জীববিজ্ঞান (Biology)</option>
                  <option value="BANGLA">বাংলা (Bangla)</option>
                  <option value="ENGLISH">ইংরেজি (English)</option>
                  <option value="ICT">তথ্য ও যোগাযোগ প্রযুক্তি (ICT)</option>
                </select>
              </div>
            </div>

            {/* Upload Method Switcher */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  uploadMode === 'file'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                সরাসরি ফাইল আপলোড (All Formats)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  uploadMode === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                সরাসরি টেক্সট পেস্ট
              </button>
            </div>

            {/* Mode 1: File Input */}
            {uploadMode === 'file' ? (
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 rounded-2xl p-6 text-center transition-all bg-slate-950/40">
                <input
                  type="file"
                  id="source-file-upload"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <label
                    htmlFor="source-file-upload"
                    className="cursor-pointer space-y-2 flex flex-col items-center justify-center block"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        <span className="text-indigo-400 underline">ফাইল নির্বাচন করুন</span> অথবা এখানে ড্র্যাগ করুন
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, DOCX, XLSX, PPT, TXT, CSV, ZIP, মিডিয়া (সর্বোচ্চ {GLOBAL_MAX_FILE_SIZE_MB}MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center space-x-3 text-left">
                      {isImageFile && filePreviewUrl ? (
                        <img
                          src={filePreviewUrl}
                          alt="Thumbnail"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 ${fileMeta?.color || 'text-indigo-400 bg-indigo-950/40 border-indigo-700'}`}>
                          {fileMeta?.type === 'PDF' ? (
                            <FileText className="w-5 h-5 text-rose-400" />
                          ) : fileMeta?.type === 'EXCEL' ? (
                            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                          ) : fileMeta?.type === 'ZIP' ? (
                            <FileArchive className="w-5 h-5 text-slate-400" />
                          ) : (
                            <File className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-white truncate max-w-sm">
                          {selectedFile.name}
                        </h4>
                        <p className="text-xs text-indigo-300 font-mono">
                          {formatFileSize(selectedFile.size)} • {fileMeta?.label || 'Document'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreviewUrl('');
                      }}
                      className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Direct Text Input */
              <div className="space-y-1.5">
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="বইয়ের অধ্যায়, প্যারাগ্রাফ বা লেকচার নোটস সরাসরি এখানে পেস্ট করুন..."
                  className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>ন্যূনতম ১০০+ অক্ষর দিলে ভালো মানের প্রশ্ন তৈরি হবে</span>
                  <span>অক্ষর সংখ্যা: {pastedText.length.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || (uploadMode === 'file' ? !selectedFile : !pastedText.trim())}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading to Supabase Storage & Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>ক্লাউড স্টোরেজে আপলোড ও এআই সোর্স সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </form>

          {/* List of Existing Materials */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="font-bold text-sm text-slate-300 flex items-center justify-between">
              <span>সংরক্ষিত স্টাডি সোর্স ডাটাবেজ ({sourceMaterials.length})</span>
              <button
                type="button"
                onClick={fetchSourceMaterials}
                className="text-xs text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>রিফ্রেশ</span>
              </button>
            </h4>

            {loadingList ? (
              <div className="p-4 text-center text-slate-500 text-xs">ডাটা লোড হচ্ছে...</div>
            ) : sourceMaterials.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                এখনো কোনো সোর্স ম্যাটেরিয়াল আপলোড করা হয়নি। উপরে ফাইল আপলোড করুন।
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sourceMaterials.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">
                          {item.title || item.titleBn}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.category} • {(item.content_text?.length || 0).toLocaleString('bn-BD')} অক্ষর
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                          title="ফাইল প্রিভিউ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
