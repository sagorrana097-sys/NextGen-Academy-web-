/**
 * Supabase Client-Side Direct Storage Upload Service
 * Bypasses backend/Vercel serverless payload limits by uploading files directly
 * from the browser to Supabase Storage buckets ('book-files', 'study-files', etc.).
 */

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
  '';
const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) ||
  '';
const DEFAULT_BUCKET =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_STORAGE_BUCKET) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_STORAGE_BUCKET) ||
  'general-uploads';

/**
 * Checks if Supabase storage is configured with valid credentials
 */
export function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http')
  );
}

export const GLOBAL_ACCEPTED_FILE_TYPES = '*/*';
export const GLOBAL_MAX_FILE_SIZE_MB = 100;

/**
 * Format bytes to human readable format (KB, MB, GB)
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Direct Client-Side File Upload to Supabase Storage
 * @param {File} file - The browser File object from <input type="file" />
 * @param {Object} options - Upload options { bucket, folder, onProgress, upsert, maxMb }
 * @returns {Promise<{ publicUrl: string, filePath: string, fileName: string, fileSize: string, fileType: string }>}
 */
export async function uploadToSupabaseStorage(file, options = {}) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const maxMb = options.maxMb || GLOBAL_MAX_FILE_SIZE_MB;
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`ফাইলের আকার ${maxMb}MB এর বেশি হতে পারবে না (বর্তমান আকার: ${formatFileSize(file.size)})`);
  }

  const bucket = options.bucket || DEFAULT_BUCKET;
  const folder = options.folder || 'uploads';
  const onProgress = options.onProgress || (() => {});

  // Clean and sanitize file name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;

  // If Supabase credentials are configured, execute direct browser-to-Supabase upload
  if (isSupabaseConfigured()) {
    try {
      onProgress(15);
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${bucket}/${filePath}`;

      const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': options.upsert !== false ? 'true' : 'false'
      };

      onProgress(45);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: file
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || errJson.error || `Upload failed with status ${response.status}`);
      }

      onProgress(85);

      // Generate public URL
      const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${filePath}`;

      onProgress(100);

      return {
        publicUrl,
        filePath,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        rawSizeBytes: file.size,
        fileType: file.type || 'application/octet-stream',
        storageProvider: 'SUPABASE'
      };
    } catch (err) {
      console.error('Supabase direct upload error:', err);
      throw new Error(`Supabase Storage আপলোড ব্যর্থ হয়েছে: ${err.message}`);
    }
  }

  // Fallback mode: When Supabase env variables are not yet added to Vercel
  // Generates optimized local Data URL for preview and testing with warning
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. Using local client fallback.');
  onProgress(30);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onProgress(100);
      resolve({
        publicUrl: e.target.result,
        filePath: `local/${timestamp}_${sanitizedName}`,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        rawSizeBytes: file.size,
        fileType: file.type || 'application/octet-stream',
        storageProvider: 'LOCAL_FALLBACK',
        warning: 'Supabase credentials not configured in .env. Live production requires VITE_SUPABASE_URL.'
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file on local device'));
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to get file type icon and category
 */
export function getFileTypeCategory(fileName = '', mimeType = '') {
  const ext = (fileName.split('.').pop() || '').toLowerCase();

  if (['pdf'].includes(ext) || mimeType.includes('pdf')) {
    return { type: 'PDF', label: 'PDF Document', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  }
  if (['doc', 'docx'].includes(ext) || mimeType.includes('word') || mimeType.includes('officedocument')) {
    return { type: 'DOC', label: 'Word Document', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType.includes('sheet') || mimeType.includes('excel')) {
    return { type: 'EXCEL', label: 'Excel Spreadsheet', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  }
  if (['ppt', 'pptx'].includes(ext) || mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return { type: 'PPT', label: 'PowerPoint Presentation', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) || mimeType.startsWith('image/')) {
    return { type: 'IMAGE', label: 'Image File', color: 'text-purple-600 bg-purple-50 border-purple-200' };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return { type: 'ZIP', label: 'Compressed Archive', color: 'text-slate-600 bg-slate-100 border-slate-300' };
  }
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext) || mimeType.startsWith('audio/')) {
    return { type: 'AUDIO', label: 'Audio Clip', color: 'text-pink-600 bg-pink-50 border-pink-200' };
  }
  if (['mp4', 'mkv', 'webm', 'mov', 'avi'].includes(ext) || mimeType.startsWith('video/')) {
    return { type: 'VIDEO', label: 'Video File', color: 'text-violet-600 bg-violet-50 border-violet-200' };
  }
  if (['txt', 'md'].includes(ext) || mimeType.includes('text/plain')) {
    return { type: 'TXT', label: 'Text Note', color: 'text-teal-600 bg-teal-50 border-teal-200' };
  }

  return { type: 'FILE', label: 'Universal File', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
}
