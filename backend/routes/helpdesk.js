const express = require('express');
const { HelpdeskTicket, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * POST /api/helpdesk/tickets
 * Create a new feedback/complaint ticket
 */
router.post('/tickets', authenticate, async (req, res, next) => {
  try {
    const { category, subject, message, priority, isAnonymous, contactPhone } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'বিভাগ, বিষয় ও বিস্তারিত বার্তা পূরণ করা আবশ্যক'
        }
      });
    }

    const ticketNumber = 'TKT-' + new Date().getFullYear().toString().slice(-2) + '-' + Math.floor(1000 + Math.random() * 9000);

    const ticket = await HelpdeskTicket.create({
      ticketNumber,
      userId: req.user.id,
      userRole: req.user.role,
      userName: req.user.name,
      userPhone: req.user.phone || contactPhone || null,
      userEmail: req.user.email,
      category: category.toUpperCase(),
      subject: subject.trim(),
      message: message.trim(),
      priority: (priority || 'NORMAL').toUpperCase(),
      isAnonymous: isAnonymous === true || isAnonymous === 'true',
      contactPhone: contactPhone || null,
      status: 'PENDING',
      adminResponse: null,
      resolvedAt: null,
      resolvedBy: null
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'HELPDESK_TICKET_CREATED',
      targetResource: 'HELPDESK',
      details: `Created Helpdesk ticket ${ticketNumber} (${category})`
    });

    res.status(201).json({
      success: true,
      message: 'আপনার মতামত/অভিযোগ সফলভাবে জমা হয়েছে। দ্রুত ব্যবস্থা নেওয়া হবে।',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/helpdesk/my-tickets
 * Retrieve tickets submitted by the authenticated user
 */
router.get('/my-tickets', authenticate, async (req, res, next) => {
  try {
    const tickets = await HelpdeskTicket.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/helpdesk/admin/tickets
 * Admin list all tickets with filters
 */
router.get('/admin/tickets', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;
    let tickets = await HelpdeskTicket.findAll({
      order: [['createdAt', 'DESC']]
    });

    if (status && status !== 'ALL') {
      tickets = tickets.filter(t => t.status === status.toUpperCase());
    }
    if (category && category !== 'ALL') {
      tickets = tickets.filter(t => t.category === category.toUpperCase());
    }
    if (priority && priority !== 'ALL') {
      tickets = tickets.filter(t => t.priority === priority.toUpperCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      tickets = tickets.filter(t =>
        (t.ticketNumber && t.ticketNumber.toLowerCase().includes(q)) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.message && t.message.toLowerCase().includes(q)) ||
        (!t.isAnonymous && t.userName && t.userName.toLowerCase().includes(q))
      );
    }

    // Process tickets for admin: if anonymous, mask user name/phone
    const formatted = tickets.map(t => {
      const tObj = t.toJSON ? t.toJSON() : { ...t };
      if (tObj.isAnonymous) {
        return {
          ...tObj,
          userName: 'গোপন রাখা হয়েছে (Anonymous)',
          userPhone: 'গোপন',
          userEmail: 'গোপন'
        };
      }
      return tObj;
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/helpdesk/admin/tickets/:id/status
 * Update ticket status and admin resolution note
 */
router.patch('/admin/tickets/:id/status', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const ticket = await HelpdeskTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'টিকিটটি পাওয়া যায়নি'
        }
      });
    }

    const updates = {};
    if (status) updates.status = status.toUpperCase();
    if (adminResponse !== undefined) updates.adminResponse = adminResponse;
    if (status === 'RESOLVED') {
      updates.resolvedAt = new Date().toISOString();
      updates.resolvedBy = req.user.name || 'Admin';
    }

    await HelpdeskTicket.update(updates, { where: { id: ticket.id } });
    const updated = await HelpdeskTicket.findByPk(id);

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'HELPDESK_TICKET_UPDATED',
      targetResource: 'HELPDESK',
      details: `Updated Helpdesk ticket ${ticket.ticketNumber} to ${status}`
    });

    res.json({
      success: true,
      message: 'টিকিটের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/helpdesk/admin/tickets/:id
 * Delete a ticket
 */
router.delete('/admin/tickets/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await HelpdeskTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TICKET_NOT_FOUND',
          message: 'টিকিটটি পাওয়া যায়নি'
        }
      });
    }

    await HelpdeskTicket.destroy({ where: { id: ticket.id } });

    res.json({
      success: true,
      message: 'টিকিট সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
