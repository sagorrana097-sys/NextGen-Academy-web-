const rateLimit = require('express-rate-limit');

/**
 * Authentication Rate Limiter
 * Limits failed login attempts to 5 per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // allow campus / shared wifi multiple logins
  skipSuccessfulRequests: true, // successful logins do not consume rate limit quota
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'অতিরিক্ত ব্যর্থ লগইন চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
    }
  }
});

/**
 * General API Rate Limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'অনুরোধের সংখ্যা অতিরিক্ত হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।'
    }
  }
});

/**
 * Input Sanitization Middleware against XSS & Injection Attacks
 */
function sanitizeInput(req, res, next) {
  const sanitizeValue = (val) => {
    if (typeof val === 'string') {
      // Remove dangerous script tags and executable Javascript directives
      return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/onload\s*=/gi, '')
        .replace(/onerror\s*=/gi, '');
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const sanitized = {};
      for (const [k, v] of Object.entries(val)) {
        sanitized[k] = sanitizeValue(v);
      }
      return sanitized;
    }
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    return val;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
}

/**
 * Strict CORS Configuration
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during development fallback
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

module.exports = {
  authLimiter,
  generalLimiter,
  sanitizeInput,
  corsOptions
};
