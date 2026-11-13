/**
 * NextGen Academy — Enterprise Unique Identifier Service
 * 
 * Classification:
 * - Category A: Security Secrets (high-entropy crypto values, 128-bit)
 * - Category B: Internal Unique Identifiers (UUIDv4, timestamped hash)
 * - Category C: Human-Readable Reference Codes (shorter, database-checked with collision retry loop)
 * - Category D: Ephemeral / Nonce Identifiers
 */

const crypto = require('crypto');

/**
 * Core collision retry loop
 * Executes generator until checker returns false (i.e. does not exist).
 */
async function generateWithRetry(generatorFn, checkExistsFn, maxRetries = 10, context = 'identifier') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const candidate = generatorFn();
    const exists = typeof checkExistsFn === 'function' 
      ? await checkExistsFn(candidate)
      : Array.isArray(checkExistsFn)
        ? checkExistsFn.includes(candidate)
        : false;

    if (!exists) {
      return candidate;
    }
  }
  throw new Error(`Failed to generate unique ${context} after ${maxRetries} collision retry attempts.`);
}

class UniqueIdService {
  /**
   * Category C: Admission Tracking ID (Human-Readable)
   * Format: ADM-2026-XXXXXX with collision retry
   */
  static async generateAdmissionTrackingId(checkExistsFn, year = 2026) {
    return generateWithRetry(
      () => `ADM-${year}-${crypto.randomInt(100000, 1000000)}`,
      checkExistsFn,
      10,
      'admission tracking ID'
    );
  }

  /**
   * Category C: Invoice Number (Human-Readable)
   * Format: INV-2026-XXXXXX with collision retry
   */
  static async generateInvoiceNumber(checkExistsFn, year = 2026) {
    return generateWithRetry(
      () => `INV-${year}-${crypto.randomInt(100000, 1000000)}`,
      checkExistsFn,
      10,
      'invoice number'
    );
  }

  /**
   * Category C: Receipt Number (Human-Readable)
   * Format: RCPT-2026-XXXXX with collision retry
   */
  static async generateReceiptNumber(checkExistsFn, year = 2026) {
    return generateWithRetry(
      () => `RCPT-${year}-${crypto.randomInt(10000, 100000)}`,
      checkExistsFn,
      10,
      'receipt number'
    );
  }

  /**
   * Category C: Helpdesk Ticket Reference (Human-Readable)
   * Format: TKT-26-XXXX with collision retry
   */
  static async generateTicketNumber(checkExistsFn) {
    const shortYear = new Date().getFullYear().toString().slice(-2);
    return generateWithRetry(
      () => `TKT-${shortYear}-${crypto.randomInt(1000, 10000)}`,
      checkExistsFn,
      10,
      'ticket number'
    );
  }

  /**
   * Category C: Referral Code (Human-Readable)
   * Format: NGA-STD1001-XXX with collision retry
   */
  static async generateReferralCode(studentIdNumber, checkExistsFn) {
    const cleanId = (studentIdNumber || 'STD').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return generateWithRetry(
      () => `NGA-${cleanId}-${crypto.randomInt(100, 1000)}`,
      checkExistsFn,
      10,
      'referral code'
    );
  }

  /**
   * Category C: Voucher Code
   * Format: REDEEM-XXXXXXXX with collision retry
   */
  static async generateVoucherCode(checkExistsFn) {
    return generateWithRetry(
      () => `REDEEM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      checkExistsFn,
      10,
      'voucher code'
    );
  }

  /**
   * Category B: Bank-Grade Payment Transaction ID
   * Format: {METHOD}-TXN-{TIMESTAMP}-{RANDOM_HEX}
   */
  static async generatePaymentTransactionId(method = 'BKASH', checkExistsFn) {
    const cleanMethod = (method || 'BKASH').toUpperCase();
    return generateWithRetry(
      () => `${cleanMethod}-TXN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      checkExistsFn,
      10,
      'transaction ID'
    );
  }

  /**
   * Category B: SMS Transaction & Message Log ID
   * Format: SMS-{DATE}-{RANDOM_HEX}
   */
  static async generateSmsTransactionId(prefix = 'SMS-BD', checkExistsFn) {
    return generateWithRetry(
      () => `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      checkExistsFn,
      10,
      'SMS transaction ID'
    );
  }

  /**
   * Category A: Security Seal & Cryptographic Verification Hash (128-bit entropy)
   * Format: NGA-SEC-{32_HEX_CHARS}
   */
  static generateSecurityVerificationHash() {
    return `NGA-SEC-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
  }

  /**
   * Category B: Quiz Session ID (UUIDv4)
   */
  static generateQuizSessionId() {
    return `quiz_${Date.now()}_${crypto.randomUUID()}`;
  }
}

module.exports = {
  UniqueIdService,
  generateWithRetry
};
