/**
 * Canonical Cross-Domain Asset URL Resolver
 * 
 * Guarantees that extracted question diagrams, receipts, and media load seamlessly
 * whether the application is running in local development or deployed cross-domain
 * (e.g. Frontend on Vercel, Backend/Media on external host or S3/Supabase).
 */

export function getAssetUrl(path) {
  if (!path) return '';

  // Already an absolute URL or data URI
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 1. Check if VITE_API_URL or VITE_ASSET_BASE_URL is configured
  const assetBase = import.meta.env.VITE_ASSET_BASE_URL;
  if (assetBase && assetBase.trim()) {
    return `${assetBase.replace(/\/+$/, '')}${cleanPath}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && apiUrl.trim()) {
    // Strips trailing /api or /api/ to get the backend host origin
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    if (backendOrigin) {
      return `${backendOrigin}${cleanPath}`;
    }
  }

  // 2. Localhost fallback
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    return `http://localhost:5000${cleanPath}`;
  }

  // 3. Fallback to same-origin relative path
  return cleanPath;
}

export default getAssetUrl;
