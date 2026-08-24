const express = require('express');
const { ReferralProfile, PromoSetting, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

const DEFAULT_PROMO_SETTINGS = {
  id: 1,
  discountPercent: 10, // 10% discount for buyers
  rewardPointsPerReferral: 200, // 200 pts for referrer
  pointToBdtRatio: 0.5, // 1 pt = 0.5 BDT (200 pts = 100 BDT)
  minSpendBDT: 500,
  isActive: true,
  customPromoCodes: [
    {
      code: 'ALOMGIR005',
      discountPercent: 15,
      description: 'অধ্যক্ষ ও পরিচালকের স্পেশাল স্কলারশিপ ডিসকাউন্ট',
      maxUses: 1000,
      usedCount: 42,
      isActive: true,
      expiryDate: '2026-12-31'
    },
    {
      code: 'NEXTGEN2026',
      discountPercent: 10,
      description: 'নতুন সেশন ২০২৬ সাধারণ ভর্তি ছাড়',
      maxUses: 500,
      usedCount: 18,
      isActive: true,
      expiryDate: '2026-12-31'
    }
  ]
};

// Helper to get or init promo settings
async function getPromoSettings() {
  const existing = await PromoSetting.findAll();
  if (existing && existing.length > 0) {
    return existing[0];
  }
  return await PromoSetting.create(DEFAULT_PROMO_SETTINGS);
}

// Tier calculation helper
function calculateTier(totalReferrals) {
  if (totalReferrals >= 20) return { name: 'ডায়মন্ড অ্যাম্বাসেডর (Diamond)', level: 4, badge: '💎', bonusMultiplier: 1.5 };
  if (totalReferrals >= 10) return { name: 'গোল্ড স্কলার (Gold)', level: 3, badge: '🥇', bonusMultiplier: 1.25 };
  if (totalReferrals >= 5) return { name: 'সিলভার রিওয়ার্ডার (Silver)', level: 2, badge: '🥈', bonusMultiplier: 1.1 };
  return { name: 'ব্রোঞ্জ লার্নার (Bronze)', level: 1, badge: '🥉', bonusMultiplier: 1.0 };
}

/**
 * GET /api/referral/my-referral
 * Student retrieves their unique referral code, wallet balance, and referral history
 */
router.get('/my-referral', authenticate, async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    const studentId = student ? student.id : req.user.id;
    const studentIdNumber = student?.studentIdNumber || `STD${studentId}`;

    let profile = await ReferralProfile.findOne({ where: { studentId } });
    if (!profile) {
      // Generate clean unique promo code: e.g. NGA-ALOM-889 or NGA-STD12-78
      const rawCode = `NGA-${studentIdNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      profile = await ReferralProfile.create({
        studentId,
        referralCode: rawCode,
        rewardPoints: 100, // Welcome signup bonus
        totalReferrals: 0,
        totalEarningsBDT: 50,
        redeemedPoints: 0,
        referralHistory: [
          {
            id: 'init-1',
            type: 'WELCOME_BONUS',
            description: 'রেফারেল প্রোগ্রামে যুক্ত হওয়ার ওয়েলকাম বোনাস',
            points: 100,
            date: new Date().toISOString()
          }
        ]
      });
    }

    const settings = await getPromoSettings();
    const tier = calculateTier(profile.totalReferrals || 0);
    const balanceBDT = Math.floor((profile.rewardPoints || 0) * (settings.pointToBdtRatio || 0.5));

    res.json({
      success: true,
      data: {
        profile,
        tier,
        balanceBDT,
        settings: {
          discountPercent: settings.discountPercent,
          rewardPointsPerReferral: settings.rewardPointsPerReferral,
          pointToBdtRatio: settings.pointToBdtRatio
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/referral/validate-promo
 * Real-time validation during payment checkout or course admission
 * Body: { promoCode, studentId, amount }
 */
router.post('/validate-promo', async (req, res, next) => {
  try {
    const { promoCode, studentId, amount } = req.body;
    if (!promoCode || !promoCode.trim()) {
      return res.status(400).json({ success: false, error: { message: 'অনুগ্রহ করে প্রমো কোড প্রবেশ করান।' } });
    }

    const cleanCode = promoCode.trim().toUpperCase();
    const currentAmount = Number(amount) || 1000;
    const settings = await getPromoSettings();

    // 1. Check custom admin promo codes
    if (Array.isArray(settings.customPromoCodes)) {
      const matchedCustom = settings.customPromoCodes.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
      if (matchedCustom) {
        const discountPercent = Number(matchedCustom.discountPercent) || 10;
        const discountAmount = Math.round((currentAmount * discountPercent) / 100);
        const finalAmount = Math.max(0, currentAmount - discountAmount);

        return res.json({
          success: true,
          data: {
            valid: true,
            promoType: 'ADMIN_PROMO',
            code: matchedCustom.code,
            discountPercent,
            discountAmount,
            finalAmount,
            message: `অভিনন্দন! ${discountPercent}% বিশেষ একাডেমি ছাড় প্রয়োগ হয়েছে (-৳${discountAmount})।`,
            description: matchedCustom.description
          }
        });
      }
    }

    // 2. Check Student Referral Code
    const allProfiles = await ReferralProfile.findAll();
    const matchedProfile = allProfiles.find(p => p.referralCode && p.referralCode.toUpperCase() === cleanCode);

    if (matchedProfile) {
      // Prevent self-referral
      if (studentId && String(matchedProfile.studentId) === String(studentId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'আপনি নিজের রেফারেল প্রমো কোড নিজে ব্যবহার করতে পারবেন না।' }
        });
      }

      const discountPercent = Number(settings.discountPercent) || 10;
      const discountAmount = Math.round((currentAmount * discountPercent) / 100);
      const finalAmount = Math.max(0, currentAmount - discountAmount);

      return res.json({
        success: true,
        data: {
          valid: true,
          promoType: 'STUDENT_REFERRAL',
          code: matchedProfile.referralCode,
          referrerStudentId: matchedProfile.studentId,
          discountPercent,
          discountAmount,
          finalAmount,
          message: `শিক্ষার্থী রেফারেল সফল! আপনি পাচ্ছেন ${discountPercent}% ডিসকাউন্ট (-৳${discountAmount})।`
        }
      });
    }

    return res.status(404).json({
      success: false,
      error: { message: 'প্রমো কোডটি সঠিক নয় অথবা মেয়াদ উত্তীর্ণ হয়ে গেছে।' }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/referral/apply-reward
 * Credit reward points to referrer on completed transaction
 * Body: { promoCode, buyerStudentId, transactionId, amountPaid }
 */
router.post('/apply-reward', async (req, res, next) => {
  try {
    const { promoCode, buyerStudentId, transactionId, amountPaid } = req.body;
    if (!promoCode) {
      return res.status(400).json({ success: false, error: { message: 'প্রমো কোড আবশ্যক।' } });
    }

    const cleanCode = promoCode.trim().toUpperCase();
    const settings = await getPromoSettings();

    const allProfiles = await ReferralProfile.findAll();
    const matchedProfile = allProfiles.find(p => p.referralCode && p.referralCode.toUpperCase() === cleanCode);

    if (matchedProfile) {
      const rewardPoints = Number(settings.rewardPointsPerReferral) || 200;
      const earningsBDT = Math.floor(rewardPoints * (settings.pointToBdtRatio || 0.5));
      const currentHistory = Array.isArray(matchedProfile.referralHistory) ? matchedProfile.referralHistory : [];

      const newEntry = {
        id: 'ref-' + Date.now(),
        type: 'SUCCESSFUL_REFERRAL',
        description: `নতুন শিক্ষার্থী ভর্তি/ফি পেমেন্ট (Trx: ${transactionId || 'N/A'})`,
        buyerStudentId: buyerStudentId || 'New Student',
        points: rewardPoints,
        earnedBDT: earningsBDT,
        date: new Date().toISOString()
      };

      await matchedProfile.update({
        rewardPoints: (matchedProfile.rewardPoints || 0) + rewardPoints,
        totalReferrals: (matchedProfile.totalReferrals || 0) + 1,
        totalEarningsBDT: (matchedProfile.totalEarningsBDT || 0) + earningsBDT,
        referralHistory: [newEntry, ...currentHistory]
      });

      return res.json({
        success: true,
        message: `রেফারারকে সফলভাবে ${rewardPoints} রিওয়ার্ড পয়েন্ট ক্রেডিট করা হয়েছে!`,
        creditedPoints: rewardPoints
      });
    }

    res.json({ success: true, message: 'অ্যাডমিন প্রমো কোড সফলভাবে প্রসেস হয়েছে।' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/referral/redeem-points
 * Student redeems wallet points for tuition waiver / discount voucher
 */
router.post('/redeem-points', authenticate, async (req, res, next) => {
  try {
    const { pointsToRedeem } = req.body;
    const points = Number(pointsToRedeem);
    if (!points || points <= 0) {
      return res.status(400).json({ success: false, error: { message: 'সঠিক পয়েন্ট পরিমাণ উল্লেখ করুন।' } });
    }

    const student = await Student.findOne({ where: { userId: req.user.id } });
    const studentId = student ? student.id : req.user.id;
    const profile = await ReferralProfile.findOne({ where: { studentId } });

    if (!profile || (profile.rewardPoints || 0) < points) {
      return res.status(400).json({ success: false, error: { message: 'আপনার ওয়ালেটে পর্যাপ্ত পয়েন্ট নেই।' } });
    }

    const settings = await getPromoSettings();
    const discountBDT = Math.floor(points * (settings.pointToBdtRatio || 0.5));
    const voucherCode = `REDEEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const currentHistory = Array.isArray(profile.referralHistory) ? profile.referralHistory : [];
    const redeemEntry = {
      id: 'rdm-' + Date.now(),
      type: 'REDEEMED',
      description: `মাসিক ফি ওয়েভার ভাউচার তৈরি (${voucherCode})`,
      points: -points,
      discountBDT,
      voucherCode,
      date: new Date().toISOString()
    };

    await profile.update({
      rewardPoints: (profile.rewardPoints || 0) - points,
      redeemedPoints: (profile.redeemedPoints || 0) + points,
      referralHistory: [redeemEntry, ...currentHistory]
    });

    res.json({
      success: true,
      data: {
        voucherCode,
        discountBDT,
        remainingPoints: profile.rewardPoints,
        message: `অভিনন্দন! ৳${discountBDT} টাকার ডিসকাউন্ট ভাউচার কোড: ${voucherCode}`
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/referral/admin/settings
 * Admin gets full promo rules, global leaderboard, and stats
 */
router.get('/admin/settings', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const settings = await getPromoSettings();
    const allProfiles = await ReferralProfile.findAll();
    
    // Calculate global stats
    const totalReferralCount = allProfiles.reduce((sum, p) => sum + (p.totalReferrals || 0), 0);
    const totalPointsDistributed = allProfiles.reduce((sum, p) => sum + (p.rewardPoints || 0) + (p.redeemedPoints || 0), 0);
    const totalDiscountsRedeemedBDT = allProfiles.reduce((sum, p) => sum + (p.redeemedPoints || 0) * (settings.pointToBdtRatio || 0.5), 0);

    // Top Ambassadors Leaderboard
    const leaderboard = allProfiles
      .sort((a, b) => (b.totalReferrals || 0) - (a.totalReferrals || 0))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        settings,
        stats: {
          totalReferralCount,
          totalPointsDistributed,
          totalDiscountsRedeemedBDT,
          activeAmbassadors: allProfiles.length
        },
        leaderboard
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/referral/admin/settings
 * Admin updates promo rules and custom promo codes
 */
router.put('/admin/settings', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const settings = await getPromoSettings();
    const { discountPercent, rewardPointsPerReferral, pointToBdtRatio, minSpendBDT, isActive, customPromoCodes } = req.body;

    const updateData = {};
    if (discountPercent !== undefined) updateData.discountPercent = Number(discountPercent);
    if (rewardPointsPerReferral !== undefined) updateData.rewardPointsPerReferral = Number(rewardPointsPerReferral);
    if (pointToBdtRatio !== undefined) updateData.pointToBdtRatio = Number(pointToBdtRatio);
    if (minSpendBDT !== undefined) updateData.minSpendBDT = Number(minSpendBDT);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (Array.isArray(customPromoCodes)) updateData.customPromoCodes = customPromoCodes;

    await settings.update(updateData);

    await AuditService.log({
      userId: req.user.id,
      action: 'PROMO_SETTINGS_UPDATE',
      resourceType: 'PromoSetting',
      resourceId: settings.id,
      ipAddress: req.ip,
      metadata: updateData
    });

    res.json({
      success: true,
      data: settings,
      message: 'প্রমো ও রেফারেল পলিসি সফলভাবে আপডেট করা হয়েছে!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
