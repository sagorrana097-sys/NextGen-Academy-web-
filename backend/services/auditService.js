const { AuditLog, User } = require('../models');

class AuditService {
  /**
   * Record a structured enterprise audit log entry
   */
  static async log({
    req,
    userId,
    adminEmail,
    adminName,
    action,
    actionType,
    targetResource,
    entityType,
    entityId,
    oldValue = null,
    newValue = null,
    status = 'SUCCESS',
    details = null
  }) {
    try {
      let ipAddress = '127.0.0.1';
      let userAgent = 'NextGen Secure Client';
      let actorId = userId;
      let email = adminEmail;
      let name = adminName;

      if (req) {
        ipAddress =
          req.headers['x-forwarded-for'] ||
          req.ip ||
          req.connection?.remoteAddress ||
          req.socket?.remoteAddress ||
          '127.0.0.1';
        if (typeof ipAddress === 'string' && ipAddress.includes('::ffff:')) {
          ipAddress = ipAddress.replace('::ffff:', '');
        }
        userAgent = req.headers['user-agent'] || 'Unknown';
        if (!actorId && req.user) {
          actorId = req.user.id;
          email = email || req.user.email;
          name = name || req.user.name;
        }
      }

      if (actorId && (!email || !name)) {
        try {
          const userObj = await User.findByPk(actorId);
          if (userObj) {
            email = email || userObj.email;
            name = name || userObj.name;
          }
        } catch (e) {
          // ignore lookup error
        }
      }

      const finalAction = action || actionType || 'SYSTEM_ACTION';
      const finalResource = targetResource || entityType || 'GENERAL';

      const entry = await AuditLog.create({
        userId: actorId || null,
        adminEmail: email || 'system@nextgen.edu.bd',
        adminName: name || 'System Controller',
        action: finalAction,
        actionType: finalAction,
        targetResource: finalResource,
        entityType: finalResource,
        entityId: String(entityId || ''),
        status: status || 'SUCCESS',
        oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null,
        newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
        details: details || null,
        ipAddress,
        userAgent,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
      });

      return entry;
    } catch (err) {
      console.error('[AuditService Error]: Failed to create audit record:', err.message);
      return null;
    }
  }

  /**
   * Retrieve audit logs with filtering and pagination
   */
  static async getLogs({ entityType, action, actionType, userId, adminEmail, limit = 50, offset = 0 } = {}) {
    const where = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (actionType) where.actionType = actionType;
    if (userId) where.userId = userId;
    if (adminEmail) where.adminEmail = adminEmail;

    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const total = await AuditLog.count({ where });

    return { total, logs };
  }
}

module.exports = AuditService;
