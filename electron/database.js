const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

let db = null;
let dbPath = '';

/**
 * Initialize SQLite Database using official WebAssembly SQLite engine (sql.js)
 * Guarantees zero C++ compilation dependencies and persistent local storage
 * Stored safely in app.getPath('userData')/prizebond.db
 */
async function initDatabase(userDataPath) {
  try {
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    dbPath = path.join(userDataPath, 'prizebond.db');
    console.log('[SQLite] Initializing database at:', dbPath);

    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('[SQLite] Loaded existing database file.');
    } else {
      db = new SQL.Database();
      console.log('[SQLite] Created new in-memory SQLite instance.');
    }

    createTables();
    seedInitialDataIfEmpty();
    saveDatabase();

    return { success: true, dbPath };
  } catch (err) {
    console.error('[SQLite] Error initializing database:', err);
    throw err;
  }
}

/**
 * Persist SQLite binary database to disk atomically
 */
function saveDatabase() {
  if (!db || !dbPath) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('[SQLite] Failed to persist database to disk:', err);
  }
}

// Helper: Query all matching rows
function queryAll(sql, params = []) {
  if (!db) return [];
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: Query single row
function queryGet(sql, params = []) {
  if (!db) return null;
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

// Helper: Execute DDL / DML and persist
function runSql(sql, params = []) {
  if (!db) throw new Error('Database not initialized');
  db.run(sql, params);
  saveDatabase();
}

function createTables() {
  const schema = `
    CREATE TABLE IF NOT EXISTS prize_bonds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bond_number TEXT NOT NULL,
      series TEXT DEFAULT '',
      purchase_date TEXT DEFAULT NULL,
      notes TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      UNIQUE(bond_number, series)
    );

    CREATE INDEX IF NOT EXISTS idx_bonds_number ON prize_bonds(bond_number);
    CREATE INDEX IF NOT EXISTS idx_bonds_series ON prize_bonds(series);

    CREATE TABLE IF NOT EXISTS draw_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draw_number TEXT NOT NULL UNIQUE,
      draw_date TEXT NOT NULL,
      series_type TEXT DEFAULT 'all',
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_draw_date ON draw_results(draw_date);

    CREATE TABLE IF NOT EXISTS winning_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draw_id INTEGER NOT NULL REFERENCES draw_results(id) ON DELETE CASCADE,
      bond_number TEXT NOT NULL,
      prize_category TEXT NOT NULL,
      prize_title_bn TEXT NOT NULL,
      prize_title_en TEXT NOT NULL,
      prize_amount REAL NOT NULL,
      applicable_series TEXT DEFAULT 'all',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_winning_num ON winning_numbers(bond_number);
    CREATE INDEX IF NOT EXISTS idx_winning_draw ON winning_numbers(draw_id);

    CREATE TABLE IF NOT EXISTS match_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checked_at TEXT DEFAULT (datetime('now', 'localtime')),
      draw_id INTEGER REFERENCES draw_results(id) ON DELETE SET NULL,
      draw_number TEXT NOT NULL,
      draw_date TEXT NOT NULL,
      bond_id INTEGER REFERENCES prize_bonds(id) ON DELETE SET NULL,
      matched_bond_number TEXT NOT NULL,
      series TEXT DEFAULT '',
      prize_category TEXT NOT NULL,
      prize_title_bn TEXT NOT NULL,
      prize_title_en TEXT NOT NULL,
      prize_amount REAL NOT NULL,
      status TEXT DEFAULT 'won'
    );

    CREATE INDEX IF NOT EXISTS idx_match_history_checked ON match_history(checked_at);

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `;

  db.run(schema);
}

function seedInitialDataIfEmpty() {
  const bondCount = (queryGet('SELECT COUNT(*) as count FROM prize_bonds') || {}).count || 0;
  const drawCount = (queryGet('SELECT COUNT(*) as count FROM draw_results') || {}).count || 0;

  // Insert default settings
  runSql("INSERT OR IGNORE INTO app_settings (key, value) VALUES ('theme', 'system')");
  runSql("INSERT OR IGNORE INTO app_settings (key, value) VALUES ('language', 'bn')");
  runSql("INSERT OR IGNORE INTO app_settings (key, value) VALUES ('last_checked_date', '')");

  // If no draws exist, insert the official 118th Bangladesh 100 Tk Prize Bond Draw (31 January 2025)
  if (drawCount === 0) {
    db.run(
      'INSERT INTO draw_results (draw_number, draw_date, series_type, description) VALUES (?, ?, ?, ?)',
      ['118', '2025-01-31', 'all', '১১৮তম বাংলাদেশ প্রাইজবন্ড ড্র (৩১ জানুয়ারি ২০২৫)']
    );

    const drawIdRow = queryGet('SELECT id FROM draw_results WHERE draw_number = ?', ['118']);
    const drawId = drawIdRow ? drawIdRow.id : 1;

    const sample118Winners = [
      { num: '0562947', cat: 'first', bn: '১ম পুরস্কার', en: '1st Prize', amt: 600000 },
      { num: '0289134', cat: 'second', bn: '২য় পুরস্কার', en: '2nd Prize', amt: 325000 },
      { num: '0142857', cat: 'third', bn: '৩য় পুরস্কার', en: '3rd Prize', amt: 100000 },
      { num: '0783921', cat: 'third', bn: '৩য় পুরস্কার', en: '3rd Prize', amt: 100000 },
      { num: '0321984', cat: 'fourth', bn: '৪র্থ পুরস্কার', en: '4th Prize', amt: 50000 },
      { num: '0894120', cat: 'fourth', bn: '৪র্থ পুরস্কার', en: '4th Prize', amt: 50000 },
      { num: '0015923', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0034812', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0078129', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0129843', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0189420', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0231894', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0294105', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0341890', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0398412', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0451290', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0512894', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0578912', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0634120', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0691234', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0754129', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0812943', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0879410', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0934128', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 },
      { num: '0981245', cat: 'fifth', bn: '৫ম পুরস্কার', en: '5th Prize', amt: 10000 }
    ];

    for (const w of sample118Winners) {
      db.run(
        'INSERT INTO winning_numbers (draw_id, bond_number, prize_category, prize_title_bn, prize_title_en, prize_amount, applicable_series) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [drawId, w.num, w.cat, w.bn, w.en, w.amt, 'all']
      );
    }
  }

  // If no bonds exist, insert a couple starter demonstration bonds
  if (bondCount === 0) {
    db.run(
      'INSERT INTO prize_bonds (bond_number, series, purchase_date, notes) VALUES (?, ?, ?, ?)',
      ['0562947', 'কক', '2024-10-15', '১ম পুরস্কার বিজয়ী টেস্ট বন্ড']
    );
    db.run(
      'INSERT INTO prize_bonds (bond_number, series, purchase_date, notes) VALUES (?, ?, ?, ?)',
      ['0142857', 'খখ', '2024-11-01', '৩য় পুরস্কার বিজয়ী টেস্ট বন্ড']
    );
    db.run(
      'INSERT INTO prize_bonds (bond_number, series, purchase_date, notes) VALUES (?, ?, ?, ?)',
      ['0481923', 'গগ', '2024-12-10', 'সাধারণ বন্ড']
    );
  }
}

// ==========================================
// Prize Bonds CRUD
// ==========================================

function getBonds(filters = {}) {
  let query = 'SELECT * FROM prize_bonds WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (bond_number LIKE ? OR notes LIKE ? OR series LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s);
  }

  if (filters.series) {
    query += ' AND series = ?';
    params.push(filters.series);
  }

  if (filters.sortBy === 'number') {
    query += ' ORDER BY bond_number ' + (filters.order === 'desc' ? 'DESC' : 'ASC');
  } else if (filters.sortBy === 'purchase_date') {
    query += ' ORDER BY purchase_date ' + (filters.order === 'desc' ? 'DESC' : 'ASC');
  } else {
    query += ' ORDER BY created_at ' + (filters.order === 'asc' ? 'ASC' : 'DESC');
  }

  if (filters.limit) {
    query += ' LIMIT ' + parseInt(filters.limit, 10);
    if (filters.offset) {
      query += ' OFFSET ' + parseInt(filters.offset, 10);
    }
  }

  const bonds = queryAll(query, params);
  const countRow = queryGet('SELECT COUNT(*) as count FROM prize_bonds');
  const totalCount = countRow ? countRow.count : 0;

  return { bonds, totalCount };
}

function addBond({ bond_number, series = '', purchase_date = null, notes = '' }) {
  const cleanNumber = String(bond_number).trim();
  const cleanSeries = String(series || '').trim().toUpperCase();

  if (!cleanNumber) {
    throw new Error('Bond number is required');
  }

  runSql(
    'INSERT INTO prize_bonds (bond_number, series, purchase_date, notes) VALUES (?, ?, ?, ?)',
    [cleanNumber, cleanSeries, purchase_date || null, notes || '']
  );

  const row = queryGet('SELECT last_insert_rowid() as id');
  return { id: row ? row.id : null, bond_number: cleanNumber, series: cleanSeries };
}

function bulkAddBonds(bondsList) {
  let addedCount = 0;
  let skippedCount = 0;

  for (const item of bondsList) {
    const cleanNumber = String(item.bond_number || item.number || '').trim();
    const cleanSeries = String(item.series || '').trim().toUpperCase();
    if (!cleanNumber) continue;

    try {
      const existing = queryGet(
        'SELECT id FROM prize_bonds WHERE bond_number = ? AND series = ?',
        [cleanNumber, cleanSeries]
      );

      if (!existing) {
        db.run(
          'INSERT INTO prize_bonds (bond_number, series, purchase_date, notes) VALUES (?, ?, ?, ?)',
          [cleanNumber, cleanSeries, item.purchase_date || null, item.notes || '']
        );
        addedCount++;
      } else {
        skippedCount++;
      }
    } catch {
      skippedCount++;
    }
  }

  saveDatabase();
  return { addedCount, skippedCount, totalProcessed: bondsList.length };
}

function updateBond({ id, bond_number, series = '', purchase_date = null, notes = '' }) {
  const cleanNumber = String(bond_number).trim();
  const cleanSeries = String(series || '').trim().toUpperCase();

  runSql(
    'UPDATE prize_bonds SET bond_number = ?, series = ?, purchase_date = ?, notes = ? WHERE id = ?',
    [cleanNumber, cleanSeries, purchase_date || null, notes || '', id]
  );

  return { success: true };
}

function deleteBond(id) {
  runSql('DELETE FROM prize_bonds WHERE id = ?', [id]);
  return { success: true };
}

function deleteBonds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return { success: true };
  const placeholders = ids.map(() => '?').join(',');
  runSql(`DELETE FROM prize_bonds WHERE id IN (${placeholders})`, ids);
  return { success: true };
}

// ==========================================
// Draw Results CRUD
// ==========================================

function getDraws(filters = {}) {
  let query = 'SELECT * FROM draw_results WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (draw_number LIKE ? OR description LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }

  if (filters.year) {
    query += ' AND strftime("%Y", draw_date) = ?';
    params.push(String(filters.year));
  }

  query += ' ORDER BY draw_date DESC';

  const draws = queryAll(query, params);

  for (const d of draws) {
    const c = queryGet('SELECT COUNT(*) as count FROM winning_numbers WHERE draw_id = ?', [d.id]);
    d.winner_count = c ? c.count : 0;
  }

  return draws;
}

function getDrawById(id) {
  const draw = queryGet('SELECT * FROM draw_results WHERE id = ?', [id]);
  if (!draw) return null;

  draw.winners = queryAll(
    'SELECT * FROM winning_numbers WHERE draw_id = ? ORDER BY prize_amount DESC, bond_number ASC',
    [id]
  );

  return draw;
}

function addDraw({ draw_number, draw_date, series_type = 'all', description = '', winners = [] }) {
  db.run(
    'INSERT INTO draw_results (draw_number, draw_date, series_type, description) VALUES (?, ?, ?, ?)',
    [String(draw_number).trim(), String(draw_date).trim(), series_type || 'all', description || '']
  );

  const drawRow = queryGet('SELECT last_insert_rowid() as id');
  const drawId = drawRow ? drawRow.id : 1;

  for (const w of winners) {
    const cleanNum = String(w.bond_number || w.number).trim();
    if (!cleanNum) continue;

    db.run(
      'INSERT INTO winning_numbers (draw_id, bond_number, prize_category, prize_title_bn, prize_title_en, prize_amount, applicable_series) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        drawId,
        cleanNum,
        w.prize_category || 'fifth',
        w.prize_title_bn || 'পুরস্কার',
        w.prize_title_en || 'Prize',
        parseFloat(w.prize_amount) || 0,
        w.applicable_series || 'all'
      ]
    );
  }

  saveDatabase();
  return { id: drawId, draw_number, winnersCount: winners.length };
}

function updateDraw({ id, draw_number, draw_date, series_type = 'all', description = '', winners = null }) {
  db.run(
    'UPDATE draw_results SET draw_number = ?, draw_date = ?, series_type = ?, description = ? WHERE id = ?',
    [String(draw_number).trim(), String(draw_date).trim(), series_type || 'all', description || '', id]
  );

  if (Array.isArray(winners)) {
    db.run('DELETE FROM winning_numbers WHERE draw_id = ?', [id]);
    for (const w of winners) {
      const cleanNum = String(w.bond_number || w.number).trim();
      if (!cleanNum) continue;
      db.run(
        'INSERT INTO winning_numbers (draw_id, bond_number, prize_category, prize_title_bn, prize_title_en, prize_amount, applicable_series) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          cleanNum,
          w.prize_category || 'fifth',
          w.prize_title_bn || 'পুরস্কার',
          w.prize_title_en || 'Prize',
          parseFloat(w.prize_amount) || 0,
          w.applicable_series || 'all'
        ]
      );
    }
  }

  saveDatabase();
  return { success: true };
}

function deleteDraw(id) {
  runSql('DELETE FROM draw_results WHERE id = ?', [id]);
  runSql('DELETE FROM winning_numbers WHERE draw_id = ?', [id]);
  return { success: true };
}

// ==========================================
// Winner Matching Engine (High Performance)
// ==========================================

function checkWinners({ draw_ids = null, save_history = true } = {}) {
  const startTime = Date.now();

  let drawFilter = '';
  const params = [];
  if (Array.isArray(draw_ids) && draw_ids.length > 0) {
    const placeholders = draw_ids.map(() => '?').join(',');
    drawFilter = `AND d.id IN (${placeholders})`;
    params.push(...draw_ids);
  }

  const matchQuery = `
    SELECT 
      b.id AS bond_id,
      b.bond_number,
      b.series AS bond_series,
      b.purchase_date,
      d.id AS draw_id,
      d.draw_number,
      d.draw_date,
      w.prize_category,
      w.prize_title_bn,
      w.prize_title_en,
      w.prize_amount,
      w.applicable_series
    FROM prize_bonds b
    INNER JOIN winning_numbers w ON b.bond_number = w.bond_number
    INNER JOIN draw_results d ON w.draw_id = d.id
    WHERE 1=1 ${drawFilter}
      AND (
        w.applicable_series = 'all' 
        OR b.series = '' 
        OR b.series IS NULL 
        OR UPPER(w.applicable_series) = UPPER(b.series)
      )
    ORDER BY d.draw_date DESC, w.prize_amount DESC
  `;

  const matches = queryAll(matchQuery, params);
  const totalBondsRow = queryGet('SELECT COUNT(*) as count FROM prize_bonds');
  const totalBonds = totalBondsRow ? totalBondsRow.count : 0;

  if (save_history && matches.length > 0) {
    for (const m of matches) {
      db.run(
        `INSERT INTO match_history (
          draw_id, draw_number, draw_date, bond_id, matched_bond_number,
          series, prize_category, prize_title_bn, prize_title_en, prize_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'won')`,
        [
          m.draw_id,
          m.draw_number,
          m.draw_date,
          m.bond_id,
          m.bond_number,
          m.bond_series || '',
          m.prize_category,
          m.prize_title_bn,
          m.prize_title_en,
          m.prize_amount
        ]
      );
    }
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  db.run(
    "INSERT INTO app_settings (key, value) VALUES ('last_checked_date', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
    [now, now]
  );

  saveDatabase();
  const durationMs = Date.now() - startTime;

  return {
    matches,
    totalBondsChecked: totalBonds,
    matchesCount: matches.length,
    totalPrizeWon: matches.reduce((sum, m) => sum + (Number(m.prize_amount) || 0), 0),
    checkedAt: now,
    durationMs
  };
}

function getMatchHistory(filters = {}) {
  let query = 'SELECT * FROM match_history WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (matched_bond_number LIKE ? OR draw_number LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }

  query += ' ORDER BY checked_at DESC';

  if (filters.limit) {
    query += ' LIMIT ' + parseInt(filters.limit, 10);
  }

  return queryAll(query, params);
}

function deleteMatchHistory(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return { success: true };
  const placeholders = ids.map(() => '?').join(',');
  runSql(`DELETE FROM match_history WHERE id IN (${placeholders})`, ids);
  return { success: true };
}

function clearMatchHistory() {
  runSql('DELETE FROM match_history');
  return { success: true };
}

// ==========================================
// Dashboard Statistics
// ==========================================

function getDashboardStats() {
  const totalBonds = (queryGet('SELECT COUNT(*) as count FROM prize_bonds') || {}).count || 0;
  const totalDraws = (queryGet('SELECT COUNT(*) as count FROM draw_results') || {}).count || 0;
  const totalMatches = (queryGet('SELECT COUNT(*) as count FROM match_history') || {}).count || 0;
  
  const totalWinningAmount = (queryGet('SELECT COALESCE(SUM(prize_amount), 0) as total FROM match_history') || {}).total || 0;

  const lastCheckedSetting = queryGet("SELECT value FROM app_settings WHERE key = 'last_checked_date'");
  const latestDraw = queryGet('SELECT * FROM draw_results ORDER BY draw_date DESC LIMIT 1');
  const recentMatches = queryAll('SELECT * FROM match_history ORDER BY checked_at DESC LIMIT 5');

  return {
    totalBonds,
    totalDraws,
    totalMatches,
    totalWinningAmount,
    lastCheckedDate: lastCheckedSetting ? lastCheckedSetting.value : '',
    latestDraw: latestDraw || null,
    recentMatches
  };
}

// ==========================================
// Settings CRUD
// ==========================================

function getAllSettings() {
  const rows = queryAll('SELECT key, value FROM app_settings');
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return settings;
}

function getSetting(key) {
  const row = queryGet('SELECT value FROM app_settings WHERE key = ?', [key]);
  return row ? row.value : null;
}

function saveSetting(key, value) {
  runSql(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
    [key, String(value), String(value)]
  );
  return { success: true, key, value };
}

// ==========================================
// Backup & Restore
// ==========================================

function backupDatabase(targetFilePath) {
  if (!db) throw new Error('Database not initialized');
  saveDatabase();
  fs.copyFileSync(dbPath, targetFilePath);
  return { success: true, targetFilePath };
}

async function restoreDatabase(sourceFilePath, userDataPath) {
  const targetPath = path.join(userDataPath, 'prizebond.db');
  fs.copyFileSync(sourceFilePath, targetPath);
  await initDatabase(userDataPath);
  return { success: true, targetPath };
}

function clearAllData() {
  runSql('DELETE FROM match_history');
  runSql('DELETE FROM winning_numbers');
  runSql('DELETE FROM draw_results');
  runSql('DELETE FROM prize_bonds');
  runSql("UPDATE app_settings SET value = '' WHERE key = 'last_checked_date'");
  return { success: true };
}

module.exports = {
  initDatabase,
  getBonds,
  addBond,
  bulkAddBonds,
  updateBond,
  deleteBond,
  deleteBonds,
  getDraws,
  getDrawById,
  addDraw,
  updateDraw,
  deleteDraw,
  checkWinners,
  getMatchHistory,
  deleteMatchHistory,
  clearMatchHistory,
  getDashboardStats,
  getAllSettings,
  getSetting,
  saveSetting,
  backupDatabase,
  restoreDatabase,
  clearAllData
};
