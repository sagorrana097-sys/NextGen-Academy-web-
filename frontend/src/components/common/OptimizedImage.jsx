import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function OptimizedImage({
  src,
  webpSrc,
  alt = 'NextGen Academy Asset',
  className = '',
  placeholderClassName = '',
  aspectRatio = 'auto',
  priority = false,
  width,
  height,
  fallbackIcon = null
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Convert extension to webp if not explicitly provided and src is local/relative
  const computedWebpSrc = webpSrc || (src && !src.startsWith('data:') && !src.endsWith('.webp') ? src.replace(/\.(png|jpg|jpeg)$/i, '.webp') : null);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/50 flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton Loading State */}
      {!loaded && !error && (
        <div className={`absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center ${placeholderClassName}`}>
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        </div>
      )}

      {/* Error Fallback State */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500 text-xs space-y-1">
          {fallbackIcon || <ImageIcon className="w-6 h-6 text-slate-600" />}
          <span className="text-[10px]">ছবি লোড করা যায়নি</span>
        </div>
      ) : (
        <picture>
          {computedWebpSrc && <source srcSet={computedWebpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setError(true);
              setLoaded(true);
            }}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 blur-sm'
            }`}
          />
        </picture>
      )}
    </div>
  );
}
