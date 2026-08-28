/**
 * Global Enterprise Standardized & Shielded Error Handling Middleware
 * Prevents system fingerprinting, path disclosure, and stack leakage
 */
const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');

  // In production, mask internal 500 database error details to prevent information disclosure
  let safeMessage = err.message || 'একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে / An unexpected error occurred';
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    safeMessage = 'সার্ভার একটি নিরাপদ অভ্যন্তরীণ ত্রুটির সম্মুখীন হয়েছে। সিস্টেম অ্যাডমিনকে অবহিত করা হয়েছে।';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: safeMessage,
      details: process.env.NODE_ENV === 'development' ? err.details || null : null
    }
  });
};

module.exports = errorHandler;
