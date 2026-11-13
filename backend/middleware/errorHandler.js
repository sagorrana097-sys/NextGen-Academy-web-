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

  let statusCode = err.statusCode || err.status;
  let errorCode = err.code;

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      errorCode = 'PAYLOAD_TOO_LARGE';
      err.message = 'ফাইলের আকার ২৫ মেগাবাইটের (25MB) চেয়ে বেশি হতে পারবে না / File exceeds 25MB limit';
    } else {
      statusCode = 400;
      errorCode = err.code || 'BAD_REQUEST';
    }
  } else if (!statusCode) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      errorCode = 'PAYLOAD_TOO_LARGE';
    } else if (err.code === 'UNSUPPORTED_MEDIA_TYPE' || err.code === 'INVALID_FILE_TYPE') {
      statusCode = 415;
    } else {
      statusCode = 500;
    }
  }

  if (!errorCode) {
    errorCode = statusCode === 404 ? 'NOT_FOUND' : statusCode === 413 ? 'PAYLOAD_TOO_LARGE' : statusCode === 415 ? 'UNSUPPORTED_MEDIA_TYPE' : statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR';
  }

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
