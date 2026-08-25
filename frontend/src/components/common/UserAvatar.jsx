import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, GraduationCap, User as UserIcon } from 'lucide-react';

/**
 * Universal High-Performance UserAvatar Component
 * Handles direct URLs, Base64 data URIs, Google Drive thumbnails, and dynamic role fallbacks.
 * Guaranteed to never render broken images or blank white circles.
 */
export default function UserAvatar({
  src,
  photo,
  avatar,
  profilePhoto,
  name = '',
  role = 'USER',
  size = 'md',
  className = '',
  shape = 'rounded-xl',
  showRoleBadge = false,
  ringColor = ''
}) {
  const rawImage = src || photo || avatar || profilePhoto || '';
  const [hasError, setHasError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  let cleanSrc = '';
  if (rawImage && typeof rawImage === 'string' && rawImage.trim().length > 0) {
    const trimmed = rawImage.trim();
    if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      cleanSrc = trimmed;
    } else if (trimmed.length > 50 && /^[A-Za-z0-9+/=]+$/.test(trimmed.slice(0, 50))) {
      cleanSrc = 'data:image/jpeg;base64,' + trimmed;
    } else {
      cleanSrc = trimmed;
    }
  }

  useEffect(() => {
    setHasError(false);
    setImgLoaded(false);
  }, [cleanSrc]);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
    '2xl': 'w-16 h-16 text-xl',
    '3xl': 'w-20 h-20 text-2xl'
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  const roleThemes = {
    SUPER_ADMIN: {
      bg: 'bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 text-white',
      ring: 'ring-rose-500/40',
      icon: Shield
    },
    ADMIN: {
      bg: 'bg-gradient-to-tr from-amber-600 via-rose-600 to-pink-600 text-white',
      ring: 'ring-amber-500/40',
      icon: Shield
    },
    TEACHER: {
      bg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white',
      ring: 'ring-blue-500/40',
      icon: BookOpen
    },
    STUDENT: {
      bg: 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white',
      ring: 'ring-emerald-500/40',
      icon: GraduationCap
    },
    PARENT: {
      bg: 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white',
      ring: 'ring-purple-500/40',
      icon: UserIcon
    }
  };

  const currentTheme = roleThemes[role] || roleThemes.ADMIN || roleThemes.STUDENT;
  const initialLetter = name && name.trim() ? name.trim().charAt(0).toUpperCase() : (role ? role.charAt(0) : 'A');
  const FallbackIcon = currentTheme.icon || Shield;
  const effectiveRing = ringColor || currentTheme.ring || 'ring-emerald-500/30';

  const showImage = cleanSrc && !hasError;

  return (
    <div className={'relative inline-flex items-center justify-center flex-shrink-0 select-none ' + currentSizeClass + ' ' + shape + ' ' + className}>
      {showImage ? (
        <div className={'w-full h-full ' + shape + ' overflow-hidden ring-2 ' + effectiveRing + ' bg-slate-800 shadow-sm'}>
          <img
            src={cleanSrc}
            alt={name || 'User Avatar'}
            className={'w-full h-full object-cover transition-opacity duration-200 ' + (imgLoaded ? 'opacity-100' : 'opacity-0')}
            onLoad={() => setImgLoaded(true)}
            onError={() => setHasError(true)}
            loading='lazy'
          />
          {!imgLoaded && (
            <div className={'w-full h-full ' + currentTheme.bg + ' flex items-center justify-center font-black animate-pulse'}>
              {initialLetter}
            </div>
          )}
        </div>
      ) : (
        <div className={'w-full h-full ' + shape + ' ' + currentTheme.bg + ' ring-2 ' + effectiveRing + ' flex items-center justify-center font-black shadow-sm font-sans'}>
          {name ? (
            <span>{initialLetter}</span>
          ) : (
            <FallbackIcon className='w-1/2 h-1/2' />
          )}
        </div>
      )}

      {showRoleBadge && (
        <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 shadow-sm' />
      )}
    </div>
  );
}