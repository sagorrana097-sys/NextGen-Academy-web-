/**
 * Global Standardized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে / An unexpected error occurred',
      details: err.details || null
    }
  });
};

module.exports = errorHandler;
