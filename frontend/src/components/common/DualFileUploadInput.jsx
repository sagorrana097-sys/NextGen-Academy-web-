import React, { useState, useRef, useEffect } from 'react';
import {
  Link as LinkIcon,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCheck,
  X,
  Eye,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DualFileUploadInput({
  label = 'ক্লাস নোট / স্টাডি ফাইল (Lecture Notes / File Attachment)',
  value = '',
  fileName = '',
  fileSize = '',
  onChange,
  accept = '.pdf,.doc,.docx,image/*,.ppt,.pptx',
  placeholder = 'https://drive.google.com/file/d/... বা অনলাইন লিঙ্ক'
}) {
  // Determine initial mode: if value starts with data:, set to 'UPLOAD', else 'URL'
  const isDataUrl = value && value.startsWith('data:');
  const [activeTab, setActiveTab] = useState(isDataUrl || fileName ? 'UPLOAD' : 'URL');
  const [selectedFileName, setSelectedFileName] = useState(fileName || '');
  const [selectedFileSize, setSelectedFileSize] = useState(fileSize || '');
  const [readingFile, setReadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
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

  // Format file size nicely
  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle local device file reading
  const processFile = (file) => {
    if (!file) return;

    setReadingFile(true);
    const sizeStr = formatSize(file.size);
    const nameStr = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setSelectedFileName(nameStr);
      setSelectedFileSize(sizeStr);
      setReadingFile(false);

      if (onChange) {
        onChange({
          url: dataUrl,
          fileName: nameStr,
          fileSize: sizeStr,
          rawFile: file
        });
      }
    };
    reader.onerror = () => {
      alert('ফাইল পড়তে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileName('');
    setSelectedFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange({
        url: '',
        fileName: '',
        fileSize: '',
        rawFile: null
      });
    }
  };

  const handleUrlInputChange = (e) => {
    const newUrl = e.target.value;
    if (onChange) {
      onChange({
        url: newUrl,
        fileName: '',
        fileSize: '',
        rawFile: null
      });
    }
  };

  const getFileIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
      return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    }
    return <FileCheck className="w-5 h-5 text-indigo-500" />;
  };

  const handlePreviewCurrentFile = () => {
    if (!value) return;
    if (value.startsWith('data:')) {
      // Open base64 in a new tab or trigger download preview
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${value}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      } else {
        const link = document.createElement('a');
        link.href = value;
        link.download = selectedFileName || 'attachment.pdf';
        link.click();
      }
    } else {
      window.open(value, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>

        {/* Dual Tab Switcher */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('URL')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'URL'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>গুগল ড্রাইভ / ক্লাউড লিংক</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('UPLOAD')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'UPLOAD'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>ডিভাইস থেকে ফাইল আপলোড</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Drive / Cloud URL Input */}
      {activeTab === 'URL' && (
        <div className="relative animate-in fade-in duration-150">
          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={value && !value.startsWith('data:') ? value : ''}
            onChange={handleUrlInputChange}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      )}

      {/* Mode 2: Device File Upload Dropzone */}
      {activeTab === 'UPLOAD' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          {value && (value.startsWith('data:') || selectedFileName) ? (
            /* Selected File Preview Badge */
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                  {getFileIcon(selectedFileName)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block max-w-xs">
                      {selectedFileName || 'সংযুক্ত ফাইল (Selected Document)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase shrink-0">
                      ✓ প্রস্তুত
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    আকার: {selectedFileSize || '3.5 MB'} • সরাসরি ডাউনলোডযোগ্য
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePreviewCurrentFile}
                  title="ফাইল প্রিভিউ দেখুন"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">প্রিভিউ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  title="অন্য ফাইল নির্বাচন করুন"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">পরিবর্তন</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveFile}
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
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 hover:bg-emerald-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {readingFile ? 'ফাইল প্রসেস হচ্ছে...' : 'কম্পিউটার বা মোবাইল থেকে ফাইল ব্রাউজ করুন'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PDF, Word Document (.docx), Images বা প্রেজেন্টেশন স্লাইড নির্বাচন করুন (সর্বোচ্চ 50MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
