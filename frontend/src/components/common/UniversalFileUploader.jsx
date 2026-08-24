import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Check,
  Film,
  Music,
  FolderOpen,
  Cloud,
  FileCheck,
  Loader2,
  File
} from 'lucide-react';
import {
  uploadToSupabaseStorage,
  isSupabaseConfigured,
  formatFileSize,
  getFileTypeCategory,
  GLOBAL_ACCEPTED_FILE_TYPES,
  GLOBAL_MAX_FILE_SIZE_MB
} from '../../services/supabaseStorage';

export default function UniversalFileUploader({
  label = 'ফাইল ও ডকুমেন্ট আপলোড (Upload PDF / Document / File)',
  value = '',
  fileName = '',
  fileSize = '',
  accept = '*/*',
  maxMb = GLOBAL_MAX_FILE_SIZE_MB,
  bucket = 'general-uploads',
  folder = 'uploads',
  helperText = '',
  placeholder = 'https://drive.google.com/... বা অনলাইন ক্লাউড ফাইল লিঙ্ক দিন',
  previewType = 'auto', // 'auto' | 'image' | 'file'
  required = false,
  disabled = false,
  className = ''
}) {
  // Normalize initial values
  const initialUrl = typeof value === 'object' && value !== null ? (value.fileUrl || value.url || '') : (value || '');
  const initialFileName = typeof value === 'object' && value !== null ? (value.fileName || fileName || '') : (fileName || '');
  const initialFileSize = typeof value === 'object' && value !== null ? (value.fileSize || fileSize || '') : (fileSize || '');

  const isDataUrl = initialUrl.startsWith('data:');
  const [activeTab, setActiveTab] = useState(isDataUrl || initialFileName ? 'DEVICE' : 'LINK');
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [currentFileName, setCurrentFileName] = useState(initialFileName);
  const [currentFileSize, setCurrentFileSize] = useState(initialFileSize);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    const rawUrl = typeof value === 'object' && value !== null ? (value.fileUrl || value.url || '') : (value || '');
    const rawName = typeof value === 'object' && value !== null ? (value.fileName || fileName || '') : (fileName || '');
    const rawSize = typeof value === 'object' && value !== null ? (value.fileSize || fileSize || '') : (fileSize || '');

    setCurrentUrl(rawUrl);
    if (rawName) setCurrentFileName(rawName);
    if (rawSize) setCurrentFileSize(rawSize);

    if (rawUrl.startsWith('data:') || rawName) {
      setActiveTab('DEVICE');
    }
  }, [value, fileName, fileSize]);

  // Handle Direct Browser Upload
  const handleDirectUpload = async (file) => {
    if (!file) return;
    setErrorMessage('');
    setSuccessMessage('');

    // Check 100MB size limit
    const maxSizeBytes = maxMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`ফাইলের আকার ${maxMb}MB এর চেয়ে বেশি হতে পারবে না (বর্তমান আকার: ${formatFileSize(file.size)})`);
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    try {
      // Direct browser-to-Supabase upload (bypasses backend and Vercel limits)
      const uploadResult = await uploadToSupabaseStorage(file, {
        bucket,
        folder,
        maxMb,
        onProgress: (p) => setUploadProgress(p)
      });

      setCurrentUrl(uploadResult.publicUrl);
      setCurrentFileName(uploadResult.fileName);
      setCurrentFileSize(uploadResult.fileSize);
      setSuccessMessage('ফাইল সফলভাবে ক্লাউড স্টোরেজে সংরক্ষিত হয়েছে!');

      // Emit public URL and metadata to parent form
      if (onChange) {
        onChange({
          url: uploadResult.publicUrl,
          fileUrl: uploadResult.publicUrl,
          pdf_link: uploadResult.publicUrl,
          downloadUrl: uploadResult.publicUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          fileType: uploadResult.fileType,
          rawSizeBytes: uploadResult.rawSizeBytes,
          storageProvider: uploadResult.storageProvider
        });
      }
    } catch (err) {
      console.error('Direct upload failure:', err);
      setErrorMessage(err.message || 'ফাইল আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleDirectUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDirectUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setCurrentUrl(url);
    setErrorMessage('');
    setSuccessMessage('');

    let derivedName = '';
    if (url) {
      try {
        const u = new URL(url);
        derivedName = decodeURIComponent(u.pathname.split('/').pop() || 'Cloud File');
      } catch (err) {
        derivedName = 'External Link';
      }
    }
    setCurrentFileName(derivedName);
    setCurrentFileSize('Cloud URL');

    if (onChange) {
      onChange({
        url,
        fileUrl: url,
        pdf_link: url,
        downloadUrl: url,
        fileName: derivedName || 'External File Link',
        fileSize: 'Cloud URL',
        fileType: 'link'
      });
    }
  };

  const handleRemove = () => {
    setCurrentUrl('');
    setCurrentFileName('');
    setCurrentFileSize('');
    setErrorMessage('');
    setSuccessMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange({
        url: '',
        fileUrl: '',
        pdf_link: '',
        downloadUrl: '',
        fileName: '',
        fileSize: '',
        fileType: ''
      });
    }
  };

  const fileMeta = getFileTypeCategory(currentFileName, '');
  const isImage = fileMeta.type === 'IMAGE' || (currentUrl && (currentUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(currentUrl)));
  const isPdf = fileMeta.type === 'PDF' || (currentUrl && currentUrl.toLowerCase().includes('.pdf'));
  const isExcel = fileMeta.type === 'EXCEL';
  const isDoc = fileMeta.type === 'DOC';
  const isZip = fileMeta.type === 'ZIP';
  const isAudio = fileMeta.type === 'AUDIO';
  const isVideo = fileMeta.type === 'VIDEO';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <FolderOpen className="w-4 h-4 text-emerald-600" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Tab Switcher: Direct Device Upload vs Cloud Link */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('DEVICE')}
            disabled={disabled || uploading}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'DEVICE'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>সরাসরি আপলোড (All Files)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LINK')}
            disabled={disabled || uploading}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'LINK'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>ড্রাইভ / ক্লাউড লিঙ্ক</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Direct File Upload Area */}
      {activeTab === 'DEVICE' && (
        <div className="space-y-2">
          <input ref={fileInputRef} type="file" accept={accept || "*/*"}
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          {!currentUrl && !uploading ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <UploadCloud className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  <span className="text-emerald-700 underline underline-offset-2">এখানে ক্লিক করে ফাইল সিলেক্ট করুন</span> অথবা ড্রপ করুন
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  সাপোর্টেড ফরম্যাট: PDF, Word, Excel, PPT, CSV, ZIP, অডিও, ভিডিও, ছবি (সর্বোচ্চ {maxMb}MB)
                </p>
              </div>

              {isSupabaseConfigured() && (
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                  <Cloud className="w-3 h-3 text-teal-600" />
                  <span>Supabase Direct Storage Active (Vercel Limit Bypassed)</span>
                </div>
              )}
            </div>
          ) : uploading ? (
            /* Uploading Progress Bar */
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 text-center space-y-3 animate-in fade-in">
              <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Uploading file... Please wait ({uploadProgress}%)</span>
              </div>

              <div className="w-full bg-emerald-200/70 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <p className="text-[10px] text-emerald-700 font-medium">
                ফাইলটি সরাসরি Supabase Storage CDN এ আপলোড হচ্ছে।
              </p>
            </div>
          ) : (
            /* Smart Uploaded File Preview Card */
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Image thumbnail vs generic Document icon */}
                {isImage && currentUrl ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex-shrink-0 bg-slate-100">
                    <img
                      src={currentUrl}
                      alt={currentFileName || 'Image preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${fileMeta.color}`}>
                    {isPdf ? (
                      <FileText className="w-5 h-5 text-rose-600" />
                    ) : isExcel ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    ) : isDoc ? (
                      <FileText className="w-5 h-5 text-blue-600" />
                    ) : isZip ? (
                      <FileArchive className="w-5 h-5 text-slate-700" />
                    ) : isAudio ? (
                      <Music className="w-5 h-5 text-pink-600" />
                    ) : isVideo ? (
                      <Film className="w-5 h-5 text-violet-600" />
                    ) : (
                      <File className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={currentFileName}>
                    {currentFileName || (isImage ? 'Uploaded Image' : 'Uploaded Document')}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium mt-0.5">
                    <span className="font-mono">{currentFileSize || 'Ready'}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      {fileMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 transition-colors"
                    title="ফাইল দেখুন বা প্রিভিউ করুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">দেখুন</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                  title="অন্য ফাইল আপলোড করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                  title="ফাইল মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Cloud / Drive URL Input */}
      {activeTab === 'LINK' && (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={currentUrl}
              onChange={handleUrlChange}
              disabled={disabled || uploading}
              placeholder={placeholder}
              className="w-full pl-9 pr-10 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                title="লিঙ্কটি ওপেন করুন"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Helper text or validation messages */}
      {helperText && !errorMessage && !successMessage && (
        <p className="text-[11px] text-slate-500 font-medium pl-1">{helperText}</p>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}
    </div>
  );
}
