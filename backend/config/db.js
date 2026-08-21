const fs = require('fs');
const path = require('path');

/**
 * Production-Ready Relational Storage & ORM Abstraction
 * Supports in-file ACID-like persistence with zero native binary compilation dependencies.
 * Designed with standard ORM interface (findAll, findOne, findByPk, create, update, destroy, count)
 * with relational joins (eager loading `include`), foreign key resolution, and query operators.
 */

class DatabaseEngine {
  constructor(dbPath) {
    this.dbPath = dbPath || path.join(__dirname, '../data/nextgen_academy_db.json');
    this.tables = {};
    this.ensureDirectory();
    this.load();
  }

  ensureDirectory() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  load() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.tables = JSON.parse(raw);
      } else {
        this.tables = {};
        this.save();
      }
    } catch (err) {
      console.error('Database load error, initializing fresh schema:', err.message);
      this.tables = {};
      this.save();
    }
  }

  save() {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.tables, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.error('Database save error:', err.message);
    }
  }

  registerTable(tableName) {
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
      this.save();
    }
  }

  getTable(tableName) {
    this.load();
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
    }
    return this.tables[tableName];
  }

  setTable(tableName, data) {
    this.tables[tableName] = data;
    this.save();
  }
}

const globalDB = new DatabaseEngine();

class Model {
  constructor(tableName, schema = {}) {
    this.tableName = tableName;
    this.schema = schema;
    this.associations = [];
    globalDB.registerTable(tableName);
  }

  belongsTo(targetModel, { foreignKey, as }) {
    this.associations.push({
      type: 'BELONGS_TO',
      targetModel,
      foreignKey,
      as: as || targetModel.tableName.slice(0, -1)
    });
  }

  hasMany(targetModel, { foreignKey, as }) {
    this.associations.push({
      type: 'HAS_MANY',
      targetModel,
      foreignKey,
      as: as || targetModel.tableName
    });
  }

  hasOne(targetModel, { foreignKey, as }) {
    this.associations.push({
      type: 'HAS_ONE',
      targetModel,
      foreignKey,
      as: as || targetModel.tableName.slice(0, -1)
    });
  }

  _matchWhere(item, where = {}) {
    for (const [key, value] of Object.entries(where)) {
      if (value === undefined) continue;
      if (typeof value === 'object' && value !== null) {
        if ('$in' in value && Array.isArray(value.$in)) {
          if (!value.$in.some(v => v === item[key] || String(v) === String(item[key]))) return false;
        } else if ('$like' in value) {
          const regex = new RegExp(value.$like.replace(/%/g, '.*'), 'i');
          if (!regex.test(String(item[key] || ''))) return false;
        } else if ('$ne' in value) {
          if (item[key] === value.$ne || String(item[key]) === String(value.$ne)) return false;
        } else if ('$gte' in value) {
          if (item[key] < value.$gte) return false;
        } else if ('$lte' in value) {
          if (item[key] > value.$lte) return false;
        }
      } else {
        if (item[key] !== value && String(item[key]) !== String(value)) return false;
      }
    }
    return true;
  }

  _applyIncludes(item, includes = []) {
    if (!item) return null;
    const cloned = { ...item };

    for (const inc of includes) {
      const targetModel = inc.model || inc;
      const asName = inc.as;
      const nestedIncludes = inc.include || [];
      const whereFilter = inc.where || null;

      // Find association
      const assoc = this.associations.find(
        a => a.targetModel === targetModel && (!asName || a.as === asName)
      );

      if (!assoc) continue;

      const targetData = globalDB.getTable(targetModel.tableName);

      if (assoc.type === 'BELONGS_TO') {
        const found = targetData.find(t => t.id === item[assoc.foreignKey]);
        if (found) {
          if (!whereFilter || targetModel._matchWhere(found, whereFilter)) {
            cloned[assoc.as] = targetModel._applyIncludes(found, nestedIncludes);
          } else {
            cloned[assoc.as] = null;
          }
        } else {
          cloned[assoc.as] = null;
        }
      } else if (assoc.type === 'HAS_ONE') {
        const found = targetData.find(t => t[assoc.foreignKey] === item.id);
        if (found) {
          if (!whereFilter || targetModel._matchWhere(found, whereFilter)) {
            cloned[assoc.as] = targetModel._applyIncludes(found, nestedIncludes);
          } else {
            cloned[assoc.as] = null;
          }
        } else {
          cloned[assoc.as] = null;
        }
      } else if (assoc.type === 'HAS_MANY') {
        let matches = targetData.filter(t => t[assoc.foreignKey] === item.id);
        if (whereFilter) {
          matches = matches.filter(m => targetModel._matchWhere(m, whereFilter));
        }
        cloned[assoc.as] = matches.map(m => targetModel._applyIncludes(m, nestedIncludes));
      }
    }
    return cloned;
  }

  async findAll(options = {}) {
    const { where, include, order, limit, offset } = options;
    let list = globalDB.getTable(this.tableName);

    if (where) {
      list = list.filter(item => this._matchWhere(item, where));
    }

    if (order && Array.isArray(order)) {
      list = [...list].sort((a, b) => {
        for (const [col, dir] of order) {
          const mult = dir && dir.toUpperCase() === 'DESC' ? -1 : 1;
          if (a[col] < b[col]) return -1 * mult;
          if (a[col] > b[col]) return 1 * mult;
        }
        return 0;
      });
    }

    if (offset !== undefined || limit !== undefined) {
      const start = offset || 0;
      const end = limit !== undefined ? start + limit : undefined;
      list = list.slice(start, end);
    }

    if (include && Array.isArray(include)) {
      return list.map(item => this._applyIncludes(item, include));
    }

    return list.map(item => ({ ...item }));
  }

  async findOne(options = {}) {
    const list = await this.findAll({ ...options, limit: 1 });
    return list.length > 0 ? list[0] : null;
  }

  async findByPk(id, options = {}) {
    return this.findOne({ ...options, where: { id } });
  }

  async create(data) {
    const list = globalDB.getTable(this.tableName);
    const maxId = list.reduce((max, item) => Math.max(max, typeof item.id === 'number' ? item.id : 0), 0);
    const now = new Date().toISOString();

    const record = {
      id: data.id !== undefined ? data.id : maxId + 1,
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };

    list.push(record);
    globalDB.setTable(this.tableName, list);
    return { ...record };
  }

  async bulkCreate(records = []) {
    const results = [];
    for (const r of records) {
      const created = await this.create(r);
      results.push(created);
    }
    return results;
  }

  async update(updateData, options = {}) {
    const { where } = options;
    if (!where) throw new Error('Update requires a where clause');

    const list = globalDB.getTable(this.tableName);
    let affectedCount = 0;
    const now = new Date().toISOString();

    const updatedList = list.map(item => {
      if (this._matchWhere(item, where)) {
        affectedCount++;
        return {
          ...item,
          ...updateData,
          id: item.id, // Preserve ID
          createdAt: item.createdAt,
          updatedAt: now
        };
      }
      return item;
    });

    globalDB.setTable(this.tableName, updatedList);
    return [affectedCount];
  }

  async destroy(options = {}) {
    const { where } = options;
    if (!where) throw new Error('Destroy requires a where clause');

    const list = globalDB.getTable(this.tableName);
    const initialLen = list.length;
    const filtered = list.filter(item => !this._matchWhere(item, where));
    const deletedCount = initialLen - filtered.length;

    globalDB.setTable(this.tableName, filtered);
    return deletedCount;
  }

  async count(options = {}) {
    const list = await this.findAll(options);
    return list.length;
  }
}

module.exports = {
  globalDB,
  Model
};
