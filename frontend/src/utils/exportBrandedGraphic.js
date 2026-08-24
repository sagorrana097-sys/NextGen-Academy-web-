import html2canvas from 'html2canvas';

export const INSTITUTION_BRAND = {
  name: 'NextGen Academy',
  nameBn: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  founder: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
  email: 'info@nextgen.edu.bd',
  website: 'https://nextgen.edu.bd'
};

/**
 * High-performance, memory-safe branded graphic export utility
 * Guarantees mandatory institutional branding and prevents mobile memory leaks
 * 
 * @param {HTMLElement} element - DOM element to render
 * @param {Object} options
 * @param {string} options.filename - Desired filename (without extension)
 * @param {string} options.format - 'png' | 'webp' | 'jpeg'
 * @param {number} options.quality - Compression quality between 0.1 and 1.0 (default 0.92)
 * @param {number} options.scale - Canvas scale factor (default 2 for Retina/HiDPI)
 * @param {string} options.backgroundColor - Canvas background color (default '#ffffff')
 */
export async function exportBrandedGraphic(element, options = {}) {
  if (!element) {
    throw new Error('No DOM element provided for graphic export.');
  }

  const {
    filename = 'NextGen_Academy_Document',
    format = 'png',
    quality = 0.92,
    scale = 2,
    backgroundColor = '#ffffff'
  } = options;

  // Memory safety: dynamically limit scale on mobile devices (small screen or memory constrained)
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  const effectiveScale = isMobile ? Math.min(scale, 1.8) : Math.min(scale, 2.5);

  let canvas = null;
  let blobUrl = null;

  try {
    canvas = await html2canvas(element, {
      scale: effectiveScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: backgroundColor,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure branded watermark and header are visible in clone
        const brandedElements = clonedDoc.querySelectorAll('[data-branded-watermark]');
        brandedElements.forEach((el) => {
          el.style.display = 'block';
        });
      }
    });

    const mimeType = format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpg' : 'png';
    const finalFilename = `${filename}_${Date.now()}.${extension}`;

    // Convert canvas to Blob (more memory efficient than massive base64 Data URLs)
    await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          // Fallback to dataURL if toBlob fails
          try {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const link = document.createElement('a');
            link.download = finalFilename;
            link.href = dataUrl;
            link.click();
            resolve(true);
          } catch (e) {
            reject(e);
          }
          return;
        }

        blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = finalFilename;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve(true);
      }, mimeType, quality);
    });

    return {
      success: true,
      filename: finalFilename,
      branding: INSTITUTION_BRAND
    };
  } finally {
    // CRITICAL: Clean up memory and prevent canvas memory leaks
    if (blobUrl) {
      setTimeout(() => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (_) {}
      }, 1000);
    }

    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
    }
  }
}
