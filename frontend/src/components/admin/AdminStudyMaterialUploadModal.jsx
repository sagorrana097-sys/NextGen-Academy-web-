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
  File,
  HardDrive,
  FolderOpen,
  Check
} from 'lucide-react';
import { materialAPI, googleDriveAPI } from '../../services/api';
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
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text' | 'drive'
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '', details: '' }

  // Google Drive State
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [isScanningDrive, setIsScanningDrive] = useState(false);
  const [driveScanResult, setDriveScanResult] = useState(null);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState([]);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

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
          message: `ফাইলের সাইজ ${GLOBAL_MAX_FILE_SIZE_MB}MB-এর চেয়ে বড় হওয়া যাবে না।`
        });
        return;
      }
      setSelectedFile(file);
      if (!title.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }

      if (file.type.startsWith('image/')) {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl('');
      }
      setFeedback(null);
    }
  };

  // Google Drive Handlers
  const handleScanDriveFolder = async () => {
    if (!driveFolderUrl.trim()) {
      setFeedback({
        type: 'error',
        message: 'অনুগ্রহ করে গুগল ড্রাইভ ফোল্ডার লিংক দিন।'
      });
      return;
    }

    setIsScanningDrive(true);
    setFeedback(null);

    try {
      const res = await googleDriveAPI.scanFolder({ folderUrlOrId: driveFolderUrl.trim() });
      if (res.success && Array.isArray(res.files)) {
        setDriveScanResult(res);
        const supported = res.files.filter(f => f.isSupported);
        setSelectedDriveFiles(supported);
        setFeedback({
          type: 'success',
          message: `গুগল ড্রাইভ ফোল্ডার স্ক্যান সফল! ${res.files.length}টি ফাইল শনাক্ত হয়েছে (${supported.length}টি সাপোর্টেড)।`
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error?.message || 'গুগল ড্রাইভ স্ক্যান করা যায়নি।'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'গুগল ড্রাইভ স্ক্যান করার সময় সমস্যা হয়েছে।'
      });
    } finally {
      setIsScanningDrive(false);
    }
  };

  const toggleDriveFile = (file) => {
    setSelectedDriveFiles(prev => {
      const exists = prev.some(f => f.id === file.id);
      if (exists) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleSyncDriveMaterials = async () => {
    if (selectedDriveFiles.length === 0) {
      setFeedback({
        type: 'error',
        message: 'সিঙ্ক করার জন্য অন্তত একটি ফাইল সিলেক্ট করুন।'
      });
      return;
    }

    setIsSyncingDrive(true);
    setFeedback(null);

    try {
      const res = await googleDriveAPI.syncMaterials({
        files: selectedDriveFiles,
        category
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || `${selectedDriveFiles.length}টি ফাইল সফলভাবে স্টাডি ম্যাটেরিয়ালে সিঙ্ক হয়েছে!`,
          details: 'ড্রাইভের সব ফাইল স্বয়ংক্রিয়ভাবে টেক্সট এক্সট্রাক্ট করে এআই প্রশ্ন তৈরিতে প্রস্তুত করা হয়েছে।'
        });
        fetchSourceMaterials();
        if (onUploadSuccess) onUploadSuccess(res.data);
      } else {
        throw new Error(res.error?.message || 'সিঙ্ক ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'গুগল ড্রাইভ সিঙ্ক করার সময় সমস্যা দেখা দিয়েছে।'
      });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleUploadAndProcess = async (e) => {
    if (e) e.preventDefault();
    setFeedback(null);

    if (uploadMode === 'file' && !selectedFile) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।' });
      return;
    }

    if (uploadMode === 'text' && !pastedText.trim()) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে কিছু টেক্সট বা লেকচার নোট লিখুন।' });
      return;
    }

    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'স্টাডি ম্যাটেরিয়ালের একটি শিরোনাম (Title) দিন।' });
      return;
    }

    setIsProcessing(true);

    try {
      let publicUploadedUrl = '';
      let extractedContent = '';

      if (uploadMode === 'text') {
        extractedContent = pastedText.trim();
      } else if (selectedFile) {
        const uploadResult = await uploadToSupabaseStorage({
          file: selectedFile,
          folder: 'study_materials',
          userId: 'admin',
          category
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'ক্লাউড স্টোরেজে ফাইল আপলোড ব্যর্থ হয়েছে');
        }

        publicUploadedUrl = uploadResult.publicUrl;

        if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
          extractedContent = await selectedFile.text();
        } else if (!extractedContent) {
          extractedContent = `[${selectedFile.name}] (${formatFileSize(selectedFile.size)}) - সোর্স ম্যাটেরিয়াল ফাইল সংযুক্ত।`;
        }
      }

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
          message: 'স্টাডি ম্যাটেরিয়াল সফলভাবে আপলোড ও ডাটাবেজে সংরক্ষণ করা হয়েছে!',
          details: `"${created.title || title}" ক্লাউডে সংরক্ষিত হয়েছে (${charCount.toLocaleString('bn-BD')}টি অক্ষর)। এটি এখন AI প্রশ্ন তৈরিতে সরাসরি ব্যবহার করা যাবে।`
        });

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

  const getFileIcon = (fileType = '') => {
    const ft = (fileType || '').toUpperCase();
    if (ft.includes('PDF')) return <FileText className="w-5 h-5 text-rose-400" />;
    if (ft.includes('DOC') || ft.includes('DOCX')) return <FileCode className="w-5 h-5 text-blue-400" />;
    if (ft.includes('IMAGE') || ft.includes('JPG') || ft.includes('PNG')) return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    if (ft.includes('XLS') || ft.includes('SHEET')) return <FileSpreadsheet className="w-5 h-5 text-teal-400" />;
    return <File className="w-5 h-5 text-indigo-400" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  📚 স্টাডি সোর্স ম্যাটেরিয়াল ও গুগল ড্রাইভ সিঙ্ক
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  AI Knowledge Hub
                </span>
              </div>
              <p className="text-xs text-slate-300">
                PDF, Word, গুগল ড্রাইভ বা টেক্সট নোট যোগ করুন যা এআই প্রশ্ন তৈরিতে স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          {/* Feedback alerts */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-start space-x-3 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">{feedback.message}</p>
                {feedback.details && <p className="text-xs text-slate-300 font-normal">{feedback.details}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Upload / Sync Form */}
            <div className="lg:col-span-7 space-y-4">
              {/* Mode Tabs */}
              <div className="flex rounded-2xl bg-slate-900 border border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    uploadMode === 'file'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ফাইল আপলোড (PDF/Word)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode('drive')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    uploadMode === 'drive'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>গুগল ড্রাইভ সিঙ্ক</span>
                  <span className="px-1 py-0.2 bg-amber-400 text-slate-950 rounded text-[9px] font-black">NEW</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    uploadMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>টেক্সট পেস্ট</span>
                </button>
              </div>

              {/* Form Card */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                {uploadMode === 'drive' ? (
                  /* Google Drive Folder Sync UI */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        গুগল ড্রাইভ ফোল্ডার লিংক (Drive Folder URL / ID)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={driveFolderUrl}
                          onChange={(e) => setDriveFolderUrl(e.target.value)}
                          placeholder="https://drive.google.com/drive/folders/..."
                          className="flex-1 p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isScanningDrive || !driveFolderUrl.trim()}
                          onClick={handleScanDriveFolder}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
                        >
                          {isScanningDrive ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>স্ক্যান হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span>স্ক্যান</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {driveScanResult && driveScanResult.files && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">
                            ফাইল তালিকা ({driveScanResult.files.length}টি)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedDriveFiles.length === driveScanResult.files.length) {
                                setSelectedDriveFiles([]);
                              } else {
                                setSelectedDriveFiles(driveScanResult.files);
                              }
                            }}
                            className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px]"
                          >
                            {selectedDriveFiles.length === driveScanResult.files.length ? 'সব আনচেক' : 'সব সিলেক্ট'}
                          </button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {driveScanResult.files.map(file => {
                            const isSelected = selectedDriveFiles.some(f => f.id === file.id);
                            return (
                              <div
                                key={file.id}
                                onClick={() => toggleDriveFile(file)}
                                className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center space-x-2.5 ${
                                  isSelected
                                    ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span className="text-xs font-bold truncate flex-1">{file.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">{file.size}</span>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={isSyncingDrive || selectedDriveFiles.length === 0}
                          onClick={handleSyncDriveMaterials}
                          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                        >
                          {isSyncingDrive ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>ড্রাইভ ফাইল সিঙ্ক হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <HardDrive className="w-4 h-4" />
                              <span>সিঙ্ক ও এআই নলেজে সেভ করুন ({selectedDriveFiles.length} ফাইল)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard File / Text Upload UI */
                  <form onSubmit={handleUploadAndProcess} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        শিরোনাম (Title) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="যেমন: এসএসসি পদার্থবিজ্ঞান গতি অধ্যায় পূর্ণাঙ্গ লেকচার শিট"
                        className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="GENERAL">সাধারণ স্টাডি নোট (General)</option>
                        <option value="PHYSICS">পদার্থবিজ্ঞান (Physics)</option>
                        <option value="CHEMISTRY">রসায়ন (Chemistry)</option>
                        <option value="MATH">উচ্চতর ও সাধারণ গণিত (Math)</option>
                        <option value="BIOLOGY">জীববিজ্ঞান (Biology)</option>
                        <option value="ICT">তথ্য ও যোগাযোগ প্রযুক্তি (ICT)</option>
                        <option value="EXAM_SUGGESTION">পরীক্ষার স্পেশাল সাজেশন</option>
                      </select>
                    </div>

                    {uploadMode === 'file' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          ডকুমেন্ট ফাইল নির্বাচন করুন (PDF, Word, Text)
                        </label>
                        <input
                          type="file"
                          accept={GLOBAL_ACCEPTED_FILE_TYPES}
                          onChange={handleFileChange}
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                        />
                        {selectedFile && (
                          <div className="mt-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center justify-between">
                            <span>📄 {selectedFile.name}</span>
                            <span className="font-mono text-emerald-400">{formatFileSize(selectedFile.size)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          লেকচার টেক্সট বা হ্যান্ডনোট পেস্ট করুন
                        </label>
                        <textarea
                          rows={6}
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                          placeholder="অধ্যায়ের মূল পয়েন্ট, সংজ্ঞা, সমীকরণ ও ব্যাখ্যা এখানে লিখুন..."
                          className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>প্রসেস ও সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>সংরক্ষণ ও AI নলেজে যুক্ত করুন</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Existing Source Materials List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>সংরক্ষিত সোর্স ম্যাটেরিয়াল ({sourceMaterials.length}টি)</span>
                </h4>
                <button
                  type="button"
                  onClick={fetchSourceMaterials}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  title="রিফ্রেশ"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                {sourceMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors space-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(mat.fileType)}
                        <h5 className="text-xs font-bold text-white truncate max-w-[200px]">
                          {mat.title}
                        </h5>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300">
                        {mat.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {mat.content_text || 'কোনো সারাংশ টেক্সট পাওয়া যায়নি।'}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{mat.content_text ? `${mat.content_text.length} Chars` : 'N/A'}</span>
                      <span className="text-emerald-400 font-bold">✓ AI Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
