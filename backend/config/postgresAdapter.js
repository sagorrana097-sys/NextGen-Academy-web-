/**
 * NextGen Academy — Enterprise PostgreSQL Database Adapter
 * 
 * Supports full runtime CRUD, Sequelize-compatible query syntax,
 * parameterized SQL compilation (SQL injection immune), eager loading
 * relational joins, and ACID transactions.
 */

const { Pool } = require('pg');

class PostgresAdapter {
  constructor(config = {}) {
    this.config = {
      connectionString: config.connectionString || process.env.DATABASE_URL,
      host: config.host || process.env.PGHOST || 'localhost',
      port: Number(config.port || process.env.PGPORT || 5432),
      user: config.user || process.env.PGUSER || 'postgres',
      password: config.password || process.env.PGPASSWORD || '',
      database: config.database || process.env.PGDATABASE || 'nextgen_academy',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 3000,
      max: 10
    };
    this.pool = null;
  }

  getPool() {
    if (!this.pool) {
      if (this.config.connectionString) {
        this.pool = new Pool({
          connectionString: this.config.connectionString,
          ssl: this.config.ssl,
          connectionTimeoutMillis: this.config.connectionTimeoutMillis
        });
      } else {
        this.pool = new Pool({
          host: this.config.host,
          port: this.config.port,
          user: this.config.user,
          password: this.config.password,
          database: this.config.database,
          ssl: this.config.ssl,
          connectionTimeoutMillis: this.config.connectionTimeoutMillis
        });
      }

      this.pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
      });
    }
    return this.pool;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async testConnection() {
    try {
      const pool = this.getPool();
      const res = await pool.query('SELECT 1 as connected');
      return { ok: true, status: 'CONNECTED', result: res.rows[0] };
    } catch (err) {
      return { ok: false, status: 'BLOCKED', error: err.message, code: err.code };
    }
  }

  /**
   * Safe SQL identifier quoting (avoids SQL injection via column/table names)
   */
  quoteIdent(ident) {
    return `"${String(ident).replace(/"/g, '""')}"`;
  }

  /**
   * Build parameterized WHERE clause
   * Supports: Op.or, Op.and, $or, $and, $in, $like, $ne, $gte, $lte, and direct equality
   */
  buildWhere(where = {}, startIdx = 1) {
    if (!where) {
      return { clause: '', params: [], nextIdx: startIdx };
    }

    const keys = Reflect.ownKeys(where);
    if (keys.length === 0) {
      return { clause: '', params: [], nextIdx: startIdx };
    }

    const SYM_OR = Symbol.for('or');
    const SYM_AND = Symbol.for('and');
    const SYM_IN = Symbol.for('in');
    const SYM_LIKE = Symbol.for('like');
    const SYM_NE = Symbol.for('ne');
    const SYM_GTE = Symbol.for('gte');
    const SYM_LTE = Symbol.for('lte');

    const params = [];
    let currentIdx = startIdx;
    const fragments = [];

    // Helper for recursion
    const parseCondition = (key, val) => {
      // 1. Or conditions
      if (key === SYM_OR || key === '$or' || key === 'or') {
        if (Array.isArray(val) && val.length > 0) {
          const subFragments = [];
          for (const subCond of val) {
            const subKeys = Reflect.ownKeys(subCond);
            for (const sKey of subKeys) {
              const res = parseCondition(sKey, subCond[sKey]);
              if (res) subFragments.push(res);
            }
          }
          return subFragments.length > 0 ? `(${subFragments.join(' OR ')})` : '';
        }
        return '';
      }

      // 2. And conditions
      if (key === SYM_AND || key === '$and' || key === 'and') {
        if (Array.isArray(val) && val.length > 0) {
          const subFragments = [];
          for (const subCond of val) {
            const subKeys = Reflect.ownKeys(subCond);
            for (const sKey of subKeys) {
              const res = parseCondition(sKey, subCond[sKey]);
              if (res) subFragments.push(res);
            }
          }
          return subFragments.length > 0 ? `(${subFragments.join(' AND ')})` : '';
        }
        return '';
      }

      const col = this.quoteIdent(key);

      // Null handling
      if (val === null) {
        return `${col} IS NULL`;
      }

      // Object operators: $in, $like, $ne, $gte, $lte
      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        const subParts = [];
        const inVal = val['$in'] || val[SYM_IN] || val.in;
        const likeVal = val['$like'] || val[SYM_LIKE] || val.like;
        const neVal = val['$ne'] !== undefined ? val['$ne'] : (val[SYM_NE] !== undefined ? val[SYM_NE] : val.ne);
        const gteVal = val['$gte'] !== undefined ? val['$gte'] : (val[SYM_GTE] !== undefined ? val[SYM_GTE] : val.gte);
        const lteVal = val['$lte'] !== undefined ? val['$lte'] : (val[SYM_LTE] !== undefined ? val[SYM_LTE] : val.lte);

        if (inVal && Array.isArray(inVal)) {
          params.push(inVal);
          subParts.push(`${col} = ANY($${currentIdx++})`);
        }
        if (likeVal !== undefined) {
          params.push(likeVal);
          subParts.push(`${col} ILIKE $${currentIdx++}`);
        }
        if (neVal !== undefined) {
          if (neVal === null) {
            subParts.push(`${col} IS NOT NULL`);
          } else {
            params.push(neVal);
            subParts.push(`${col} != $${currentIdx++}`);
          }
        }
        if (gteVal !== undefined) {
          params.push(gteVal);
          subParts.push(`${col} >= $${currentIdx++}`);
        }
        if (lteVal !== undefined) {
          params.push(lteVal);
          subParts.push(`${col} <= $${currentIdx++}`);
        }
        return subParts.join(' AND ');
      }

      // Direct scalar equality
      params.push(val);
      return `${col} = $${currentIdx++}`;
    };

    for (const k of keys) {
      const v = where[k];
      if (v !== undefined) {
        const cond = parseCondition(k, v);
        if (cond) fragments.push(cond);
      }
    }

    if (fragments.length === 0) {
      return { clause: '', params: [], nextIdx: startIdx };
    }

    return {
      clause: `WHERE ${fragments.join(' AND ')}`,
      params,
      nextIdx: currentIdx
    };
  }

  /**
   * Build ORDER BY clause
   */
  buildOrder(order) {
    if (!order || !Array.isArray(order) || order.length === 0) {
      return '';
    }
    const parts = order.map(([col, dir]) => {
      const direction = String(dir || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      return `${this.quoteIdent(col)} ${direction}`;
    });
    return `ORDER BY ${parts.join(', ')}`;
  }

  /**
   * Clean/Format row from PostgreSQL (parse JSON columns if needed)
   */
  formatRow(row) {
    if (!row) return null;
    const formatted = { ...row };
    if (formatted.id !== undefined && !isNaN(Number(formatted.id))) {
      formatted.id = Number(formatted.id);
    }
    return formatted;
  }

  /**
   * Execute SELECT query
   */
  async findAll(tableName, options = {}, associations = [], txClient = null) {
    const runner = txClient || this.getPool();
    const { where, order, limit, offset, include } = options;

    const { clause: whereClause, params } = this.buildWhere(where, 1);
    const orderClause = this.buildOrder(order);

    let query = `SELECT * FROM ${this.quoteIdent(tableName)} ${whereClause} ${orderClause}`.trim();

    let paramIdx = params.length + 1;
    if (limit !== undefined) {
      query += ` LIMIT $${paramIdx++}`;
      params.push(Number(limit));
    }
    if (offset !== undefined) {
      query += ` OFFSET $${paramIdx++}`;
      params.push(Number(offset));
    }

    const res = await runner.query(query, params);
    let rows = res.rows.map(r => this.formatRow(r));

    // Handle relational includes
    if (include && Array.isArray(include) && include.length > 0 && rows.length > 0) {
      for (const inc of include) {
        const targetModel = inc.model || inc;
        const asName = inc.as || targetModel.tableName;
        const assoc = associations.find(a => a.targetModel === targetModel && (!inc.as || a.as === inc.as));

        if (!assoc) continue;

        if (assoc.type === 'BELONGS_TO') {
          const foreignIds = [...new Set(rows.map(r => r[assoc.foreignKey]).filter(Boolean))];
          if (foreignIds.length > 0) {
            const targets = await targetModel.findAll({
              where: { id: { $in: foreignIds } },
              include: inc.include
            });
            const targetMap = new Map(targets.map(t => [t.id, t]));
            rows.forEach(r => {
              r[asName] = targetMap.get(r[assoc.foreignKey]) || null;
            });
          } else {
            rows.forEach(r => { r[asName] = null; });
          }
        } else if (assoc.type === 'HAS_MANY') {
          const parentIds = rows.map(r => r.id).filter(Boolean);
          if (parentIds.length > 0) {
            const children = await targetModel.findAll({
              where: { [assoc.foreignKey]: { $in: parentIds } },
              include: inc.include
            });
            const childMap = new Map();
            children.forEach(c => {
              const pId = c[assoc.foreignKey];
              if (!childMap.has(pId)) childMap.set(pId, []);
              childMap.get(pId).push(c);
            });
            rows.forEach(r => {
              r[asName] = childMap.get(r.id) || [];
            });
          } else {
            rows.forEach(r => { r[asName] = []; });
          }
        } else if (assoc.type === 'HAS_ONE') {
          const parentIds = rows.map(r => r.id).filter(Boolean);
          if (parentIds.length > 0) {
            const children = await targetModel.findAll({
              where: { [assoc.foreignKey]: { $in: parentIds } },
              include: inc.include
            });
            const childMap = new Map(children.map(c => [c[assoc.foreignKey], c]));
            rows.forEach(r => {
              r[asName] = childMap.get(r.id) || null;
            });
          } else {
            rows.forEach(r => { r[asName] = null; });
          }
        }
      }
    }

    return rows;
  }

  async findOne(tableName, options = {}, associations = [], txClient = null) {
    const list = await this.findAll(tableName, { ...options, limit: 1 }, associations, txClient);
    return list.length > 0 ? list[0] : null;
  }

  async findByPk(tableName, id, options = {}, associations = [], txClient = null) {
    return this.findOne(tableName, { ...options, where: { id } }, associations, txClient);
  }

  /**
   * INSERT single record
   */
  async create(tableName, data, txClient = null) {
    const runner = txClient || this.getPool();
    const now = new Date().toISOString();

    const record = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };

    const keys = Object.keys(record).filter(k => record[k] !== undefined);
    const cols = keys.map(k => this.quoteIdent(k)).join(', ');
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    const values = keys.map(k => {
      const val = record[k];
      if (val !== null && typeof val === 'object' && !Buffer.isBuffer(val) && !(val instanceof Date)) {
        return JSON.stringify(val);
      }
      return val;
    });

    const query = `INSERT INTO ${this.quoteIdent(tableName)} (${cols}) VALUES (${placeholders}) RETURNING *`;
    const res = await runner.query(query, values);
    return this.formatRow(res.rows[0]);
  }

  /**
   * BULK INSERT records
   */
  async bulkCreate(tableName, records = [], txClient = null) {
    if (!Array.isArray(records) || records.length === 0) return [];
    const results = [];
    for (const rec of records) {
      const created = await this.create(tableName, rec, txClient);
      results.push(created);
    }
    return results;
  }

  /**
   * UPDATE records
   */
  async update(tableName, updateData, options = {}, txClient = null) {
    const runner = txClient || this.getPool();
    const { where } = options;
    if (!where || Object.keys(where).length === 0) {
      throw new Error('Update operation requires a non-empty where clause for safety.');
    }

    const now = new Date().toISOString();
    const dataToUpdate = {
      ...updateData,
      updatedAt: now
    };

    const keys = Object.keys(dataToUpdate).filter(k => dataToUpdate[k] !== undefined && k !== 'id');
    if (keys.length === 0) return [0];

    const setParts = [];
    const values = [];
    let currentIdx = 1;

    for (const key of keys) {
      setParts.push(`${this.quoteIdent(key)} = $${currentIdx++}`);
      const val = dataToUpdate[key];
      if (val !== null && typeof val === 'object' && !Buffer.isBuffer(val) && !(val instanceof Date)) {
        values.push(JSON.stringify(val));
      } else {
        values.push(val);
      }
    }

    const { clause: whereClause, params: whereParams } = this.buildWhere(where, currentIdx);
    const allParams = [...values, ...whereParams];

    const query = `UPDATE ${this.quoteIdent(tableName)} SET ${setParts.join(', ')} ${whereClause} RETURNING id`;
    const res = await runner.query(query, allParams);
    return [res.rowCount || res.rows.length];
  }

  /**
   * DELETE records
   */
  async destroy(tableName, options = {}, txClient = null) {
    const runner = txClient || this.getPool();
    const { where } = options;
    if (!where || Object.keys(where).length === 0) {
      throw new Error('Destroy operation requires a non-empty where clause for safety.');
    }

    const { clause: whereClause, params } = this.buildWhere(where, 1);
    const query = `DELETE FROM ${this.quoteIdent(tableName)} ${whereClause} RETURNING id`;
    const res = await runner.query(query, params);
    return res.rowCount || res.rows.length;
  }

  /**
   * COUNT records
   */
  async count(tableName, options = {}, txClient = null) {
    const runner = txClient || this.getPool();
    const { where } = options;
    const { clause: whereClause, params } = this.buildWhere(where, 1);
    const query = `SELECT COUNT(*) AS count FROM ${this.quoteIdent(tableName)} ${whereClause}`;
    const res = await runner.query(query, params);
    return parseInt(res.rows[0]?.count || 0, 10);
  }

  /**
   * ACID Transaction helper
   */
  async transaction(callback) {
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = PostgresAdapter;
