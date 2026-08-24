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
  FolderOpen
} from 'lucide-react';

export default function UniversalFileUploader({
  label = 'ফাইল ও ডকুমেন্ট আপলোড (Upload File)',
  value = '',
  fileName = '',
  fileSize = '',
  onChange,
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*',
  maxMb = 15,
  helperText = '',
  placeholder = 'https://drive.google.com/file/d/... বা ক্লাউড লিঙ্ক দিন',
  previewType = 'auto', // 'auto' | 'image' | 'file'
  required = false,
  disabled = false,
  className = ''
}) {
  // Normalize initial value (could be string URL or object)
  const initialUrl = typeof value === 'object' && value !== null ? (value.fileUrl || value.url || '') : (value || '');
  const initialFileName = typeof value === 'object' && value !== null ? (value.fileName || fileName || '') : (fileName || '');
  const initialFileSize = typeof value === 'object' && value !== null ? (value.fileSize || fileSize || '') : (fileSize || '');

  const isDataUrl = initialUrl.startsWith('data:');
  const [activeTab, setActiveTab] = useState(isDataUrl || initialFileName ? 'DEVICE' : 'LINK');
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [currentFileName, setCurrentFileName] = useState(initialFileName);
  const [currentFileSize, setCurrentFileSize] = useState(initialFileSize);
  const [readingFile, setReadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Format file size
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process Device File
  const processDeviceFile = (file) => {
    if (!file) return;
    setErrorMessage('');

    // Check size limit (default 15MB)
    const maxSizeBytes = maxMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`ফাইলের আকার ${maxMb}MB এর চেয়ে বেশি হতে পারবে না (বর্তমান আকার: ${formatBytes(file.size)})`);
      return;
    }

    setReadingFile(true);
    const sizeFormatted = formatBytes(file.size);
    const nameFormatted = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCurrentUrl(dataUrl);
      setCurrentFileName(nameFormatted);
      setCurrentFileSize(sizeFormatted);
      setReadingFile(false);

      notifyChange({
        fileType: 'device',
        fileUrl: dataUrl,
        url: dataUrl,
        fileName: nameFormatted,
        fileSize: sizeFormatted,
        rawFile: file
      });
    };

    reader.onerror = () => {
      setErrorMessage('ফাইল পড়তে সমস্যা হয়েছে। অনুগ্রহ করে অন্য কোনো ফাইল নির্বাচন করুন।');
      setReadingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const notifyChange = (payload) => {
    if (onChange) {
      onChange(payload);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processDeviceFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
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
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processDeviceFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setCurrentUrl('');
    setCurrentFileName('');
    setCurrentFileSize('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    notifyChange({
      fileType: activeTab === 'DEVICE' ? 'device' : 'link',
      fileUrl: '',
      url: '',
      fileName: '',
      fileSize: '',
      rawFile: null
    });
  };

  const handleLinkInputChange = (e) => {
    const newUrl = e.target.value;
    setCurrentUrl(newUrl);
    setErrorMessage('');
    notifyChange({
      fileType: 'link',
      fileUrl: newUrl,
      url: newUrl,
      fileName: newUrl ? newUrl.split('/').pop().split('?')[0] || 'Cloud Document' : '',
      fileSize: 'Cloud URL',
      rawFile: null
    });
  };

  const getFileIcon = (name = '', url = '') => {
    const lower = (name || url).toLowerCase();
    if (lower.endsWith('.pdf') || url.includes('application/pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || url.includes('image/')) {
      return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    }
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    if (lower.endsWith('.zip') || lower.endsWith('.rar') || lower.endsWith('.7z')) {
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    }
    if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.avi')) {
      return <Film className="w-5 h-5 text-indigo-500" />;
    }
    if (lower.endsWith('.mp3') || lower.endsWith('.wav')) {
      return <Music className="w-5 h-5 text-purple-500" />;
    }
    return <FolderOpen className="w-5 h-5 text-slate-500" />;
  };

  const isImage = () => {
    if (previewType === 'image') return true;
    const lower = (currentFileName || currentUrl).toLowerCase();
    return (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.webp') ||
      currentUrl.startsWith('data:image/')
    );
  };

  const handleOpenPreview = () => {
    if (!currentUrl) return;
    if (currentUrl.startsWith('data:')) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${currentUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      } else {
        const link = document.createElement('a');
        link.href = currentUrl;
        link.download = currentFileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.open(currentUrl, '_blank');
    }
  };

  // Detect link provider
  const getLinkProviderBadge = (url = '') => {
    if (!url) return null;
    if (url.includes('drive.google.com')) return { label: 'Google Drive', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (url.includes('dropbox.com')) return { label: 'Dropbox', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    if (url.includes('onedrive') || url.includes('1drv.ms')) return { label: 'OneDrive', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    return { label: 'ওয়েব লিংক (Web Link)', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  };

  const providerBadge = activeTab === 'LINK' ? getLinkProviderBadge(currentUrl) : null;

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {/* Header & Dual Option Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setActiveTab('DEVICE');
              setErrorMessage('');
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'DEVICE'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>📁 ডিভাইস থেকে নির্বাচন</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setActiveTab('LINK');
              setErrorMessage('');
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'LINK'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>🔗 গুগল ড্রাইভ / লিংক</span>
          </button>
        </div>
      </div>

      {/* Error Message Notification */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: DEVICE FILE UPLOAD (DRAG & DROP + PICKER) */}
      {/* ========================================================================= */}
      {activeTab === 'DEVICE' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept={accept}
            disabled={disabled}
            className="hidden"
          />

          {currentUrl && (currentUrl.startsWith('data:') || currentFileName) ? (
            /* Selected File Live Preview Card */
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 rounded-2xl flex items-center justify-between gap-3 transition-all">
              <div className="flex items-center space-x-3 overflow-hidden">
                {isImage() && currentUrl ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-sm">
                    <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                    {getFileIcon(currentFileName, currentUrl)}
                  </div>
                )}

                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block max-w-[200px] sm:max-w-xs">
                      {currentFileName || 'সংযুক্ত ফাইল (Selected File)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase shrink-0">
                      ✓ প্রস্তুত
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    আকার: {currentFileSize || '3.5 MB'} • সরাসরি ডাউনলোডযোগ্য ফরম্যাট
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  title="প্রিভিউ দেখুন"
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">প্রিভিউ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  title="অন্য ফাইল নির্বাচন করুন"
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">পরিবর্তন</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearFile}
                  title="ফাইল মুছে ফেলুন"
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Drop Area */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => {
                if (!disabled && fileInputRef.current) fileInputRef.current.click();
              }}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 hover:bg-emerald-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {readingFile ? 'ফাইল প্রসেস হচ্ছে...' : 'কম্পিউটার বা মোবাইল থেকে ফাইল ব্রাউজ করুন'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {helperText || `PDF, Word (.docx), Image, বা Zip ফাইল নির্বাচন করুন (সর্বোচ্চ ${maxMb}MB)`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: GOOGLE DRIVE / CLOUD LINK INPUT */}
      {/* ========================================================================= */}
      {activeTab === 'LINK' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              disabled={disabled}
              value={currentUrl && !currentUrl.startsWith('data:') ? currentUrl : ''}
              onChange={handleLinkInputChange}
              placeholder={placeholder}
              className="w-full pl-9 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            {currentUrl && !currentUrl.startsWith('data:') && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  title="লিংকটি টেস্ট করুন"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>টেস্ট</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {providerBadge && currentUrl && !currentUrl.startsWith('data:') && (
            <div className="flex items-center space-x-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-md border font-semibold ${providerBadge.color}`}>
                {providerBadge.label}
              </span>
              <span className="text-slate-400">অনলাইন লিঙ্ক সরাসরি সংযুক্ত হয়েছে</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
