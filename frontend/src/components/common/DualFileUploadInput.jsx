import React, { useState, useRef, useEffect } from 'react';
import {
  Link as LinkIcon,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  FileCheck,
  X,
  Eye,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Cloud,
  Loader2,
  AlertCircle,
  Film,
  Music,
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

export default function DualFileUploadInput({
  label = 'ক্লাস নোট / স্টাডি ফাইল (Lecture Notes / File Attachment)',
  value = '',
  fileName = '',
  fileSize = '',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,' + GLOBAL_ACCEPTED_FILE_TYPES,
  maxMb = GLOBAL_MAX_FILE_SIZE_MB,
  bucket = 'general-uploads',
  folder = 'notes',
  placeholder = 'https://drive.google.com/file/d/... বা অনলাইন লিঙ্ক'
}) {
  const isDataUrl = value && value.startsWith('data:');
  const [activeTab, setActiveTab] = useState(isDataUrl || fileName ? 'UPLOAD' : 'URL');
  const [currentUrl, setCurrentUrl] = useState(value || '');
  const [selectedFileName, setSelectedFileName] = useState(fileName || '');
  const [selectedFileSize, setSelectedFileSize] = useState(fileSize || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (value !== currentUrl) {
      setCurrentUrl(value || '');
    }
    if (fileName && fileName !== selectedFileName) {
      setSelectedFileName(fileName);
    }
    if (fileSize && fileSize !== selectedFileSize) {
      setSelectedFileSize(fileSize);
    }
    if (value && value.startsWith('data:')) {
      setActiveTab('UPLOAD');
    }
  }, [value, fileName, fileSize]);

  // Handle direct upload to Supabase
  const handleDirectUpload = async (file) => {
    if (!file) return;
    setErrorMessage('');

    // Check 100MB limit
    const maxSizeBytes = maxMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`ফাইলের আকার ${maxMb}MB এর চেয়ে বেশি হতে পারবে না (বর্তমান আকার: ${formatFileSize(file.size)})`);
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    try {
      const uploadResult = await uploadToSupabaseStorage(file, {
        bucket,
        folder,
        maxMb,
        onProgress: (p) => setUploadProgress(p)
      });

      setCurrentUrl(uploadResult.publicUrl);
      setSelectedFileName(uploadResult.fileName);
      setSelectedFileSize(uploadResult.fileSize);

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
      console.error('Direct upload error:', err);
      setErrorMessage(err.message || 'ফাইল আপলোড ব্যর্থ হয়েছে');
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

    let derivedName = '';
    if (url) {
      try {
        const u = new URL(url);
        derivedName = decodeURIComponent(u.pathname.split('/').pop() || 'Drive Document');
      } catch (err) {
        derivedName = 'External Link';
      }
    }
    setSelectedFileName(derivedName);
    setSelectedFileSize('Cloud URL');

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
    setSelectedFileName('');
    setSelectedFileSize('');
    setErrorMessage('');
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

  const fileMeta = getFileTypeCategory(selectedFileName, '');
  const isImage = fileMeta.type === 'IMAGE' || (currentUrl && (currentUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(currentUrl)));
  const isPdf = fileMeta.type === 'PDF' || (currentUrl && currentUrl.toLowerCase().includes('.pdf'));
  const isExcel = fileMeta.type === 'EXCEL';
  const isDoc = fileMeta.type === 'DOC';
  const isZip = fileMeta.type === 'ZIP';
  const isAudio = fileMeta.type === 'AUDIO';
  const isVideo = fileMeta.type === 'VIDEO';

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <span>{label}</span>
        </label>

        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('UPLOAD')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all flex items-center space-x-1 ${
              activeTab === 'UPLOAD'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>সরাসরি আপলোড</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('URL')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all flex items-center space-x-1 ${
              activeTab === 'URL'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>অনলাইন ড্রাইভ লিংক</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Direct File Upload */}
      {activeTab === 'UPLOAD' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
          />

          {!currentUrl && !uploading ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-1.5 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40'
              }`}
            >
              <UploadCloud className="w-6 h-6 text-emerald-600 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  <span className="text-emerald-700 underline">ফাইল সিলেক্ট করুন</span> অথবা ড্রপ করুন
                </p>
                <p className="text-[10px] text-slate-500">
                  সাপোর্টেড ফরম্যাট: PDF, Word, Excel, PPT, CSV, ZIP, মিডিয়া (সর্বোচ্চ {maxMb}MB)
                </p>
              </div>
            </div>
          ) : uploading ? (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-800">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Uploading file... Please wait ({uploadProgress}%)</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Smart File Preview Card */
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                {/* Image thumbnail vs generic Document icon */}
                {isImage && currentUrl ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                    <img
                      src={currentUrl}
                      alt={selectedFileName || 'Preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${fileMeta.color}`}>
                    {isPdf ? (
                      <FileText className="w-4 h-4 text-rose-600" />
                    ) : isExcel ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    ) : isDoc ? (
                      <FileText className="w-4 h-4 text-blue-600" />
                    ) : isZip ? (
                      <FileArchive className="w-4 h-4 text-slate-700" />
                    ) : isAudio ? (
                      <Music className="w-4 h-4 text-pink-600" />
                    ) : isVideo ? (
                      <Film className="w-4 h-4 text-violet-600" />
                    ) : (
                      <File className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={selectedFileName}>
                    {selectedFileName || (isImage ? 'Uploaded Image' : 'Uploaded File')}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                    <span className="font-mono">{selectedFileSize || 'Ready'}</span>
                    <span>•</span>
                    <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      {fileMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="প্রিভিউ দেখুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="অন্য ফাইল আপলোড করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Drive URL Input */}
      {activeTab === 'URL' && (
        <div className="relative">
          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={currentUrl}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="w-full pl-8 pr-8 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-indigo-600"
              title="লিঙ্কটি ওপেন করুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center space-x-1.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
