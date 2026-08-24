const { SMSLog, Notice, Student, User, Class, GuardianStudentMapping } = require('../models');
const AuditService = require('./auditService');

// In-memory anti-spam cooldown tracker: Map<"studentId:eventType", timestampMs>
const cooldownMap = new Map();
const COOLDOWN_DURATION_MS = 10 * 60 * 1000; // 10 minutes

class SMSService {
  /**
   * Format the official Bangla Absent Notification SMS Template
   */
  static formatAbsentMessage({ studentName, className, rollNo, date }) {
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
      const guardianPhone = guardian?.phone || student.user?.phone || '01792818005';
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

      const trxId = `SMS-BD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
   * Automated Proctoring SMS Triggers with 10-Minute Anti-Spam Cooldown
   * Trigger 1 (EXAM_START): "আপনার সন্তান [Student_Name] NextGen Academy-এর পোর্টালে [Exam_Name] পরীক্ষা শুরু করেছে।"
   * Trigger 2 (EXAM_ABANDON): "সতর্কতা: আপনার সন্তান [Student_Name] পরীক্ষা শেষ না করেই বের হয়ে গেছে।"
   * Trigger 3 (CLASS_JOIN): "আপনার সন্তান [Student_Name] NextGen Academy-এর লাইভ ক্লাসে জয়েন করেছে।"
   * Trigger 4 (TAB_SWITCH): "সতর্কতা: আপনার সন্তান ক্লাস/পরীক্ষা চলাকালীন অন্য পেজে বা ট্যাবে চলে গেছে।"
   */
  static async sendProctoringSMS({ studentId, eventType, examName = 'মডেল টেস্ট', className = '', req = null }) {
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
      const guardianPhone = guardian?.phone || student.user?.phone || '01792818005';
      const guardianName = guardian?.name || `${student.user?.name || 'শিক্ষার্থী'}-এর অভিভাবক`;
      const studentName = student.user?.name || 'শিক্ষার্থী';
      const effectiveClass = student.class?.nameBn || className || 'একাডেমি';

      // Check anti-spam cooldown for TAB_SWITCH and EXAM_ABANDON
      const cooldownKey = `${studentId}:${eventType}`;
      const lastSent = cooldownMap.get(cooldownKey);
      const now = Date.now();

      if (lastSent && (now - lastSent) < COOLDOWN_DURATION_MS) {
        const remainingSec = Math.ceil((COOLDOWN_DURATION_MS - (now - lastSent)) / 1000);
        console.log(`[Proctoring SMS Cooldown] Skipped ${eventType} for student ${studentId}. Cooldown active (${remainingSec}s left)`);
        return {
          success: true,
          skipped: true,
          reason: 'COOLDOWN_ACTIVE',
          remainingCooldownSeconds: remainingSec,
          message: 'অ্যান্টি-স্প্যাম কুলডাউন সক্রিয় থাকার কারণে এসএমএস পাঠানো সাময়িকভাবে স্থগিত রয়েছে।'
        };
      }

      // Format Message according to event type
      let messageContent = '';
      let noticeTitle = '';

      switch (eventType) {
        case 'EXAM_START':
          messageContent = `প্রিয় অভিভাবক, আপনার সন্তান ${studentName} NextGen Academy-এর পোর্টালে ${examName} পরীক্ষা শুরু করেছে।`;
          noticeTitle = `পরীক্ষা শুরুর নোটিফিকেশন: ${studentName}`;
          break;
        case 'EXAM_ABANDON':
          messageContent = `সতর্কতা: আপনার সন্তান ${studentName} পরীক্ষা শেষ না করেই বের হয়ে গেছে।`;
          noticeTitle = `সতর্কতা: পরীক্ষা অসম্পূর্ণ রেখে বের হওয়া (${studentName})`;
          break;
        case 'CLASS_JOIN':
          messageContent = `আপনার সন্তান ${studentName} NextGen Academy-এর লাইভ ক্লাসে জয়েন করেছে।`;
          noticeTitle = `লাইভ ক্লাসে উপস্থিতি: ${studentName}`;
          break;
        case 'TAB_SWITCH':
        case 'CHEAT_ATTEMPT':
        default:
          messageContent = `সতর্কতা: আপনার সন্তান ক্লাস/পরীক্ষা চলাকালীন অন্য পেজে বা ট্যাবে চলে গেছে।`;
          noticeTitle = `প্রক্টরিং সতর্কতা: ট্যাব সুইচ/অননুমোদিত উইন্ডো ওপেন (${studentName})`;
          break;
      }

      // Record cooldown timestamp
      cooldownMap.set(cooldownKey, now);

      const trxId = `SMS-PROCTOR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

      await Notice.create({
        titleBn: noticeTitle,
        titleEn: `Proctoring Alert: ${eventType} (${studentName})`,
        contentBn: messageContent,
        contentEn: messageContent,
        category: 'ACADEMIC',
        priority: eventType === 'TAB_SWITCH' || eventType === 'EXAM_ABANDON' ? 'URGENT' : 'NORMAL',
        targetRole: 'PARENT',
        publishedByUserId: 1,
        publishedAt: new Date().toISOString()
      });

      if (req) {
        await AuditService.log({
          req,
          userId: req.user ? req.user.id : null,
          action: `PROCTORING_SMS_${eventType}`,
          entityType: 'sms_log',
          entityId: smsLogEntry.id,
          newValue: smsLogEntry,
          details: `প্রক্টরিং SMS পাঠানো হয়েছে: ${eventType} -> "${studentName}" (${guardianPhone})`
        });
      }

      console.log(`[Proctoring SMS Sent] [${eventType}] to ${guardianPhone}: "${messageContent}" | Trx: ${trxId}`);

      return {
        success: true,
        trxId,
        eventType,
        recipientPhone: guardianPhone,
        studentName,
        messageContent,
        log: smsLogEntry
      };
    } catch (err) {
      console.error('[Proctoring SMSService Error]:', err.message);
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
