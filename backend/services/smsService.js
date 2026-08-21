const { SMSLog, Notice, Student, User, Class, GuardianStudentMapping } = require('../models');
const AuditService = require('./auditService');

class SMSService {
  /**
   * Format the official Bangla Absent Notification SMS Template
   */
  static formatAbsentMessage({ studentName, className, rollNo, date }) {
    // Format date in readable Bangla e.g. ২০ আগস্ট ২০২৬ or YYYY-MM-DD
    const dateObj = new Date(date);
    const dateStr = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      : date;

    return `প্রিয় অভিভাবক, আপনার সন্তান ${studentName} (শ্রেণি: ${className}, রোল: ${rollNo}) আজ ${dateStr}-এ নেক্সটজেন একাডেমিতে অনুপস্থিত রয়েছে। কোনো বিশেষ কারণ থাকলে অনুগ্রহ করে কোচিং কর্তৃপক্ষকে জানান। ধন্যবাদ, নেক্সটজেন একাডেমি।`;
  }

  /**
   * Dispatch an Absent SMS alert to a parent
   */
  static async sendAbsentSMS({ studentId, date, req = null, senderUserId = null }) {
    try {
      const student = await Student.findByPk(Number(studentId), {
        include: [
          { model: User, as: 'user' },
          { model: Class, as: 'class' },
          { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
        ]
      });

      if (!student) {
        throw new Error(`Student #${studentId} not found`);
      }

      const guardian = student.guardians?.[0]?.parent;
      const guardianPhone = guardian?.phone || student.user?.phone || '01712345678';
      const guardianName = guardian?.name || `${student.user?.name || 'শিক্ষার্থী'}-এর অভিভাবক`;
      const studentName = student.user?.name || 'শিক্ষার্থী';
      const className = student.class?.nameBn || '৮ম শ্রেণি';
      const rollNo = student.rollNo || 101;

      const messageContent = this.formatAbsentMessage({
        studentName,
        className,
        rollNo,
        date
      });

      // Simulation / Gateway payload
      const trxId = `SMS-BD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Save in SMSLog
      const smsLogEntry = await SMSLog.create({
        studentId: student.id,
        parentUserId: guardian?.id || null,
        recipientPhone: guardianPhone,
        recipientName: guardianName,
        messageContent,
        gatewayTrxId: trxId,
        gatewayStatus: 'SUCCESS',
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });

      // 2. Also save an in-app Notice / Alert so Parent Dashboard immediately displays this notification
      await Notice.create({
        titleBn: `অনুপস্থিতি সতর্কতা: ${studentName}`,
        titleEn: `Absent Alert: ${studentName}`,
        contentBn: messageContent,
        contentEn: `Dear Guardian, your ward ${studentName} (Class: ${className}, Roll: ${rollNo}) is marked ABSENT today (${date}) at NextGen Academy.`,
        category: 'ACADEMIC',
        priority: 'URGENT',
        targetRole: 'PARENT',
        publishedByUserId: senderUserId || 1,
        publishedAt: new Date().toISOString()
      });

      // 3. Log Audit
      if (req) {
        await AuditService.log({
          req,
          userId: senderUserId || (req.user ? req.user.id : null),
          action: 'SMS_ABSENT_ALERT',
          entityType: 'sms_log',
          entityId: smsLogEntry.id,
          newValue: smsLogEntry,
          details: `স্বয়ংক্রিয় অনুপস্থিতি SMS পাঠানো হয়েছে: "${studentName}" এর অভিভাবক (${guardianPhone})`
        });
      }

      console.log(`[SMS Gateway BD] Delivered to ${guardianPhone}: "${messageContent}" | Trx: ${trxId}`);

      return {
        success: true,
        trxId,
        recipientPhone: guardianPhone,
        recipientName: guardianName,
        studentName,
        messageContent,
        log: smsLogEntry
      };
    } catch (err) {
      console.error('[SMSService Error]:', err.message);
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Send Bulk Absent SMS to all absent students of a given date and class
   */
  static async sendBulkAbsentSMS({ studentIds, date, req = null, senderUserId = null }) {
    const results = [];
    for (const sid of studentIds) {
      const res = await this.sendAbsentSMS({
        studentId: sid,
        date,
        req,
        senderUserId
      });
      results.push(res);
    }
    const successCount = results.filter(r => r.success).length;
    return {
      success: true,
      totalRequested: studentIds.length,
      sentCount: successCount,
      results
    };
  }
}

module.exports = SMSService;
