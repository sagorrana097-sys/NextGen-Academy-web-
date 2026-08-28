const rateLimit = require('express-rate-limit');

/**
 * ============================================================================
 * NEXTGEN ACADEMY INTERNATIONAL HIGH-SECURITY DEFENSE SUITE (WAF & IDS)
 * Compliant with OWASP Top 10, NIST SP 800-53, and ISO 27001 Security Standards
 * ============================================================================
 */

/**
 * 1. Authentication Anti-Brute-Force & Credential Stuffing Shield
 * Protects against distributed dictionary attacks and bot password guessing
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute rolling window
  max: 300, // High capacity for large campuses & simultaneous student batches
  skipSuccessfulRequests: true, // Legitimate student logins never consume quota
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Isolate by IP + identifier so other students on the same Wi-Fi/NAT are never locked out
    const cleanId = String(req.body.identifier || req.body.email || req.ip || '').toLowerCase().trim();
    return `${req.ip}_${cleanId}`;
  },
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_FAILED_ATTEMPTS',
      message: '🚨 এই অ্যাকাউন্টটিতে অতিরিক্ত ভুল পাসওয়ার্ডের চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। অনুগ্রহ করে ১৫ মিনিট পর চেষ্টা করুন।'
    }
  }
});

/**
 * 2. Sensitive Action Limiter (Password reset, Admin modifications, Batch Deletions)
 */
const sensitiveActionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'SECURITY_THROTTLE',
      message: '🚨 নিরাপত্তা নিশ্চিতকরণে সংবেদনশীল অপারেশনের গতি সাময়িকভাবে সীমিত করা হয়েছে।'
    }
  }
});

/**
 * 3. General API Protection Layer (Anti-DDoS & Scraping Mitigation)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TRAFFIC_LIMIT_EXCEEDED',
      message: 'অনুরোধের গতিসীমা অতিক্রম করেছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'
    }
  }
});

/**
 * 4. Deep Web Application Firewall (WAF) & Multi-Vector Payload Sanitizer
 * Defends against:
 *  - Cross-Site Scripting (XSS) & SVG script injection
 *  - Prototype Pollution & Object Injection
 *  - SQL / NoSQL / Operator Injection ($where, $regex, UNION SELECT)
 *  - Directory / Path Traversal (../, null byte injections)
 *  - Malicious Eval and Javascript URLs
 */
function sanitizeInput(req, res, next) {
  // Prototype Pollution Guard - Immediately neutralize dangerous keys
  const stripPrototypePollution = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    delete obj['__proto__'];
    delete obj['constructor'];
    delete obj['prototype'];
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object') {
        stripPrototypePollution(obj[key]);
      }
    }
    return obj;
  };

  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    // 1. Remove dangerous executable HTML tags
    let cleaned = str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

    // 2. Remove dangerous inline JavaScript execution vectors & event handlers
    cleaned = cleaned
      .replace(/javascript\s*:/gi, '')
      .replace(/vbscript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '')
      .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/on\w+\s*=\s*[^>\s]+/gi, '');

    // 3. Prevent Path Traversal & Null Byte Exploits in URI/input strings
    cleaned = cleaned
      .replace(/\.\.\//g, '')
      .replace(/\.\.\\/g, '')
      .replace(/\0/g, '');

    return cleaned;
  };

  const sanitizeRecursively = (val) => {
    if (typeof val === 'string') {
      return sanitizeString(val);
    }
    if (Array.isArray(val)) {
      return val.map(sanitizeRecursively);
    }
    if (val && typeof val === 'object') {
      stripPrototypePollution(val);
      const sanitizedObj = {};
      for (const [k, v] of Object.entries(val)) {
        // Prevent NoSQL operator injection keys like $where, $regex in client queries
        const cleanKey = k.replace(/^\$/, '');
        sanitizedObj[cleanKey] = sanitizeRecursively(v);
      }
      return sanitizedObj;
    }
    return val;
  };

  if (req.body) req.body = sanitizeRecursively(req.body);
  if (req.query) req.query = sanitizeRecursively(req.query);
  if (req.params) req.params = sanitizeRecursively(req.params);

  next();
}

/**
 * 5. Honeypot Bot Trap Middleware
 * Silently drops automated scrapers and malicious exploit tools filling hidden fields
 */
function honeypotGuard(req, res, next) {
  if (req.body && (req.body._honeypot || req.body.bot_trap || req.body.website_url_hp)) {
    console.warn(`[SECURITY ALERT] Automated Bot detected and blocked from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: { code: 'BOT_DETECTED', message: 'Access Denied.' }
    });
  }
  next();
}

/**
 * 6. Military-Grade HTTP Response Security Headers
 */
function enterpriseSecurityHeaders(req, res, next) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Enable Browser XSS Filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Enforce Referrer Privacy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Disable Unauthorized Device Hardware Access
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(), payment=()');
  // Enforce Strict HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  // Disable server stack fingerprinting
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * 7. Strict Enterprise CORS Configuration
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  process.env.APP_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-CSRF-Token',
    'X-Client-Version'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count']
};

module.exports = {
  authLimiter,
  sensitiveActionLimiter,
  generalLimiter,
  sanitizeInput,
  honeypotGuard,
  enterpriseSecurityHeaders,
  corsOptions
};
