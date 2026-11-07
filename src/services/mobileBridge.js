/**
 * Universal Mobile & Web Bridge for PrizeBond Matching App 🇧🇩
 * Enables 100% offline functionality on Android (Capacitor), PWA, and Mobile Browsers.
 */

const STORAGE_KEYS = {
  BONDS: 'pb_bonds',
  DRAWS: 'pb_draws',
  MATCH_HISTORY: 'pb_match_history',
  SETTINGS: 'pb_settings'
};

const DEFAULT_DRAW_118 = {
  id: 1,
  draw_number: '118',
  draw_date: '2025-01-31',
  series_type: 'all',
  description: '১১৮তম বাংলাদেশ প্রাইজবন্ড ড্র (৩১ জানুয়ারি ২০২৫)',
  created_at: '2025-01-31 12:00:00',
  winners: [
    { bond_number: '0562947', prize_category: 'first', prize_title_bn: '১ম পুরস্কার', prize_title_en: '1st Prize', prize_amount: 600000, applicable_series: 'all' },
    { bond_number: '0289134', prize_category: 'second', prize_title_bn: '২য় পুরস্কার', prize_title_en: '2nd Prize', prize_amount: 325000, applicable_series: 'all' },
    { bond_number: '0142857', prize_category: 'third', prize_title_bn: '৩য় পুরস্কার', prize_title_en: '3rd Prize', prize_amount: 100000, applicable_series: 'all' },
    { bond_number: '0783921', prize_category: 'third', prize_title_bn: '৩য় পুরস্কার', prize_title_en: '3rd Prize', prize_amount: 100000, applicable_series: 'all' },
    { bond_number: '0321984', prize_category: 'fourth', prize_title_bn: '৪র্থ পুরস্কার', prize_title_en: '4th Prize', prize_amount: 50000, applicable_series: 'all' },
    { bond_number: '0894120', prize_category: 'fourth', prize_title_bn: '৪র্থ পুরস্কার', prize_title_en: '4th Prize', prize_amount: 50000, applicable_series: 'all' },
    { bond_number: '0015923', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0034812', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0078129', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0129843', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0189420', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0231894', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0294105', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0341890', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0398412', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0451290', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0512894', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0578912', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0634120', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0691234', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0754129', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0812943', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0879410', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0934128', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' },
    { bond_number: '0981245', prize_category: 'fifth', prize_title_bn: '৫ম পুরস্কার', prize_title_en: '5th Prize', prize_amount: 10000, applicable_series: 'all' }
  ]
};

const DEFAULT_BONDS = [
  { id: 1, bond_number: '0562947', series: 'কক', purchase_date: '2024-10-15', notes: '১ম পুরস্কার বিজয়ী টেস্ট বন্ড', created_at: '2024-10-15 10:00:00' },
  { id: 2, bond_number: '0142857', series: 'খখ', purchase_date: '2024-11-01', notes: '৩য় পুরস্কার বিজয়ী টেস্ট বন্ড', created_at: '2024-11-01 10:00:00' },
  { id: 3, bond_number: '0481923', series: 'গগ', purchase_date: '2024-12-10', notes: 'সাধারণ বন্ড', created_at: '2024-12-10 10:00:00' }
];

function getStored(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage quota exceeded or error:', e);
  }
}

// Initialize seed data if empty
function ensureInitialized() {
  if (!localStorage.getItem(STORAGE_KEYS.DRAWS)) {
    setStored(STORAGE_KEYS.DRAWS, [DEFAULT_DRAW_118]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BONDS)) {
    setStored(STORAGE_KEYS.BONDS, DEFAULT_BONDS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MATCH_HISTORY)) {
    setStored(STORAGE_KEYS.MATCH_HISTORY, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      language: 'bn',
      last_checked_date: ''
    });
  }
}

export function createMobileBridge() {
  ensureInitialized();

  return {
    // App info
    getAppVersion: async () => '1.0.0',
    getUserDataPath: async () => 'LocalStorage (Android / Web)',
    openExternal: async (url) => {
      window.open(url, '_blank');
    },

    // Prize Bonds
    getBonds: async (filters = {}) => {
      const all = getStored(STORAGE_KEYS.BONDS, []);
      let filtered = [...all];

      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(b =>
          (b.bond_number && b.bond_number.toLowerCase().includes(s)) ||
          (b.series && b.series.toLowerCase().includes(s)) ||
          (b.notes && b.notes.toLowerCase().includes(s))
        );
      }

      if (filters.series) {
        filtered = filtered.filter(b => (b.series || '') === filters.series);
      }

      const sortBy = filters.sortBy || 'created_at';
      const order = filters.order || 'desc';
      filtered.sort((a, b) => {
        const valA = a[sortBy] || '';
        const valB = b[sortBy] || '';
        return order === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });

      return {
        bonds: filtered,
        totalCount: filtered.length
      };
    },

    addBond: async ({ bond_number, series = '', purchase_date = null, notes = '' }) => {
      const num = String(bond_number).trim();
      if (!num) throw new Error('Bond number cannot be empty');
      const bonds = getStored(STORAGE_KEYS.BONDS, []);

      // Check duplicates
      const exists = bonds.some(b => b.bond_number === num && (b.series || '') === (series || ''));
      if (exists) throw new Error('Duplicate bond number already exists in this series');

      const newId = bonds.length > 0 ? Math.max(...bonds.map(b => b.id || 0)) + 1 : 1;
      const created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newBond = {
        id: newId,
        bond_number: num,
        series: series || '',
        purchase_date: purchase_date || null,
        notes: notes || '',
        created_at
      };
      bonds.unshift(newBond);
      setStored(STORAGE_KEYS.BONDS, bonds);
      return { id: newId, bond_number: num };
    },

    bulkAddBonds: async (bondsList) => {
      if (!Array.isArray(bondsList) || bondsList.length === 0) {
        return { success: true, added: 0, duplicates: 0, errors: 0 };
      }
      const existing = getStored(STORAGE_KEYS.BONDS, []);
      let maxId = existing.length > 0 ? Math.max(...existing.map(b => b.id || 0)) : 0;
      let added = 0;
      let duplicates = 0;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

      for (const b of bondsList) {
        const num = String(b.bond_number || b.number || '').trim();
        const ser = String(b.series || '').trim();
        if (!num) continue;

        const isDup = existing.some(item => item.bond_number === num && (item.series || '') === ser);
        if (isDup) {
          duplicates++;
          continue;
        }

        maxId++;
        existing.unshift({
          id: maxId,
          bond_number: num,
          series: ser,
          purchase_date: b.purchase_date || null,
          notes: b.notes || '',
          created_at: now
        });
        added++;
      }

      setStored(STORAGE_KEYS.BONDS, existing);
      return { success: true, added, duplicates, errors: 0 };
    },

    updateBond: async ({ id, bond_number, series = '', purchase_date = null, notes = '' }) => {
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      const idx = bonds.findIndex(b => b.id === id);
      if (idx === -1) throw new Error('Bond not found');

      bonds[idx] = {
        ...bonds[idx],
        bond_number: String(bond_number).trim(),
        series: series || '',
        purchase_date: purchase_date || null,
        notes: notes || ''
      };
      setStored(STORAGE_KEYS.BONDS, bonds);
      return { success: true };
    },

    deleteBond: async (id) => {
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      const filtered = bonds.filter(b => b.id !== id);
      setStored(STORAGE_KEYS.BONDS, filtered);
      return { success: true };
    },

    deleteBonds: async (ids) => {
      if (!Array.isArray(ids) || ids.length === 0) return { success: true, count: 0 };
      const set = new Set(ids);
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      const filtered = bonds.filter(b => !set.has(b.id));
      setStored(STORAGE_KEYS.BONDS, filtered);
      return { success: true, count: ids.length };
    },

    // Draws
    getDraws: async (filters = {}) => {
      let draws = getStored(STORAGE_KEYS.DRAWS, []);

      if (filters.search) {
        const s = filters.search.toLowerCase();
        draws = draws.filter(d =>
          (d.draw_number && d.draw_number.toLowerCase().includes(s)) ||
          (d.description && d.description.toLowerCase().includes(s))
        );
      }

      if (filters.year) {
        draws = draws.filter(d => (d.draw_date || '').startsWith(String(filters.year)));
      }

      draws.sort((a, b) => ((a.draw_date || '') < (b.draw_date || '') ? 1 : -1));

      return draws.map(d => ({
        ...d,
        winner_count: Array.isArray(d.winners) ? d.winners.length : 0
      }));
    },

    getDrawById: async (id) => {
      const draws = getStored(STORAGE_KEYS.DRAWS, []);
      const draw = draws.find(d => d.id === id || String(d.id) === String(id));
      if (!draw) return null;
      return {
        ...draw,
        winners: draw.winners || []
      };
    },

    addDraw: async ({ draw_number, draw_date, series_type = 'all', description = '', winners = [] }) => {
      const draws = getStored(STORAGE_KEYS.DRAWS, []);
      const newId = draws.length > 0 ? Math.max(...draws.map(d => d.id || 0)) + 1 : 1;
      const newDraw = {
        id: newId,
        draw_number: String(draw_number).trim(),
        draw_date: String(draw_date).trim(),
        series_type: series_type || 'all',
        description: description || '',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        winners: winners || []
      };
      draws.unshift(newDraw);
      setStored(STORAGE_KEYS.DRAWS, draws);
      return { id: newId, draw_number, winnersCount: winners.length };
    },

    updateDraw: async ({ id, draw_number, draw_date, series_type = 'all', description = '', winners = null }) => {
      const draws = getStored(STORAGE_KEYS.DRAWS, []);
      const idx = draws.findIndex(d => d.id === id || String(d.id) === String(id));
      if (idx === -1) throw new Error('Draw not found');

      draws[idx] = {
        ...draws[idx],
        draw_number: String(draw_number).trim(),
        draw_date: String(draw_date).trim(),
        series_type: series_type || 'all',
        description: description || '',
        ...(Array.isArray(winners) ? { winners } : {})
      };
      setStored(STORAGE_KEYS.DRAWS, draws);
      return { success: true };
    },

    deleteDraw: async (id) => {
      const draws = getStored(STORAGE_KEYS.DRAWS, []);
      const filtered = draws.filter(d => d.id !== id && String(d.id) !== String(id));
      setStored(STORAGE_KEYS.DRAWS, filtered);
      return { success: true };
    },

    // Winner Matching Engine
    checkWinners: async ({ draw_ids = null, save_history = true } = {}) => {
      const startTime = Date.now();
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      let draws = getStored(STORAGE_KEYS.DRAWS, []);

      if (Array.isArray(draw_ids) && draw_ids.length > 0) {
        const idSet = new Set(draw_ids.map(String));
        draws = draws.filter(d => idSet.has(String(d.id)));
      }

      const matches = [];

      for (const d of draws) {
        const winners = d.winners || [];
        for (const w of winners) {
          const wNum = String(w.bond_number).trim();
          for (const b of bonds) {
            const bNum = String(b.bond_number).trim();
            if (wNum === bNum) {
              const applicable = (w.applicable_series || 'all').toLowerCase();
              const bondSeries = (b.series || '').toLowerCase();

              const seriesMatch =
                applicable === 'all' ||
                !bondSeries ||
                applicable === bondSeries;

              if (seriesMatch) {
                matches.push({
                  bond_id: b.id,
                  bond_number: b.bond_number,
                  bond_series: b.series || '',
                  purchase_date: b.purchase_date,
                  draw_id: d.id,
                  draw_number: d.draw_number,
                  draw_date: d.draw_date,
                  prize_category: w.prize_category,
                  prize_title_bn: w.prize_title_bn,
                  prize_title_en: w.prize_title_en,
                  prize_amount: w.prize_amount,
                  applicable_series: w.applicable_series
                });
              }
            }
          }
        }
      }

      if (save_history && matches.length > 0) {
        const history = getStored(STORAGE_KEYS.MATCH_HISTORY, []);
        let maxHistId = history.length > 0 ? Math.max(...history.map(h => h.id || 0)) : 0;
        const checkedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

        for (const m of matches) {
          maxHistId++;
          history.unshift({
            id: maxHistId,
            checked_at: checkedAt,
            draw_id: m.draw_id,
            draw_number: m.draw_number,
            draw_date: m.draw_date,
            bond_id: m.bond_id,
            matched_bond_number: m.bond_number,
            series: m.bond_series,
            prize_category: m.prize_category,
            prize_title_bn: m.prize_title_bn,
            prize_title_en: m.prize_title_en,
            prize_amount: m.prize_amount,
            status: 'won'
          });
        }
        setStored(STORAGE_KEYS.MATCH_HISTORY, history);
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const settings = getStored(STORAGE_KEYS.SETTINGS, {});
      settings.last_checked_date = now;
      setStored(STORAGE_KEYS.SETTINGS, settings);

      return {
        matches,
        totalBondsChecked: bonds.length,
        matchesCount: matches.length,
        totalPrizeWon: matches.reduce((sum, m) => sum + (Number(m.prize_amount) || 0), 0),
        checkedAt: now,
        durationMs: Date.now() - startTime
      };
    },

    getMatchHistory: async (filters = {}) => {
      let history = getStored(STORAGE_KEYS.MATCH_HISTORY, []);

      if (filters.search) {
        const s = filters.search.toLowerCase();
        history = history.filter(h =>
          (h.matched_bond_number && h.matched_bond_number.toLowerCase().includes(s)) ||
          (h.draw_number && h.draw_number.toLowerCase().includes(s))
        );
      }

      history.sort((a, b) => ((a.checked_at || '') < (b.checked_at || '') ? 1 : -1));

      if (filters.limit) {
        history = history.slice(0, parseInt(filters.limit, 10));
      }

      return history;
    },

    deleteMatchHistory: async (ids) => {
      if (!Array.isArray(ids) || ids.length === 0) return { success: true };
      const set = new Set(ids);
      const history = getStored(STORAGE_KEYS.MATCH_HISTORY, []);
      const filtered = history.filter(h => !set.has(h.id));
      setStored(STORAGE_KEYS.MATCH_HISTORY, filtered);
      return { success: true };
    },

    clearMatchHistory: async () => {
      setStored(STORAGE_KEYS.MATCH_HISTORY, []);
      return { success: true };
    },

    // Dashboard Stats
    getDashboardStats: async () => {
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      const draws = getStored(STORAGE_KEYS.DRAWS, []);
      const history = getStored(STORAGE_KEYS.MATCH_HISTORY, []);
      const settings = getStored(STORAGE_KEYS.SETTINGS, {});

      const totalWinningAmount = history.reduce((sum, h) => sum + (Number(h.prize_amount) || 0), 0);

      const latestDraw = draws.length > 0
        ? [...draws].sort((a, b) => (a.draw_date < b.draw_date ? 1 : -1))[0]
        : null;

      const recentMatches = history.slice(0, 5);

      return {
        totalBonds: bonds.length,
        totalDraws: draws.length,
        totalMatches: history.length,
        totalWinningAmount,
        lastCheckedDate: settings.last_checked_date || '',
        latestDraw,
        recentMatches
      };
    },

    // Settings
    getSettings: async () => getStored(STORAGE_KEYS.SETTINGS, {}),
    getSetting: async (key) => {
      const s = getStored(STORAGE_KEYS.SETTINGS, {});
      return s[key] !== undefined ? s[key] : null;
    },
    saveSetting: async (key, val) => {
      const s = getStored(STORAGE_KEYS.SETTINGS, {});
      s[key] = val;
      setStored(STORAGE_KEYS.SETTINGS, s);
      return { success: true, key, value: val };
    },

    // Import / Export
    exportBondsCSV: async () => {
      const bonds = getStored(STORAGE_KEYS.BONDS, []);
      let csv = 'Bond Number,Series,Purchase Date,Notes,Created Date\n';
      for (const b of bonds) {
        csv += `"${b.bond_number}","${b.series || ''}","${b.purchase_date || ''}","${(b.notes || '').replace(/"/g, '""')}","${b.created_at || ''}"\n`;
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `prizebonds_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, count: bonds.length };
    },

    importBondsCSV: async () => {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.txt';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return resolve({ success: false, canceled: true });
          const text = await file.text();
          const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          if (lines.length === 0) return resolve({ success: false, error: 'Empty file' });

          const startIndex = lines[0].toLowerCase().includes('bond') ? 1 : 0;
          const list = [];
          for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
            if (parts[0]) {
              list.push({
                bond_number: parts[0],
                series: parts[1] || '',
                purchase_date: parts[2] || null,
                notes: parts[3] || ''
              });
            }
          }
          const res = await window.electronAPI.bulkAddBonds(list);
          resolve({ success: true, ...res });
        };
        input.click();
      });
    },

    backupDatabase: async () => {
      const backupData = {
        bonds: getStored(STORAGE_KEYS.BONDS, []),
        draws: getStored(STORAGE_KEYS.DRAWS, []),
        match_history: getStored(STORAGE_KEYS.MATCH_HISTORY, []),
        settings: getStored(STORAGE_KEYS.SETTINGS, {})
      };
      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `prizebond_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    },

    restoreDatabase: async () => {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return resolve({ success: false, canceled: true });
          try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (data.bonds) setStored(STORAGE_KEYS.BONDS, data.bonds);
            if (data.draws) setStored(STORAGE_KEYS.DRAWS, data.draws);
            if (data.match_history) setStored(STORAGE_KEYS.MATCH_HISTORY, data.match_history);
            if (data.settings) setStored(STORAGE_KEYS.SETTINGS, data.settings);
            resolve({ success: true });
          } catch (err) {
            resolve({ success: false, error: err.message });
          }
        };
        input.click();
      });
    },

    clearAllData: async () => {
      setStored(STORAGE_KEYS.BONDS, []);
      setStored(STORAGE_KEYS.DRAWS, [DEFAULT_DRAW_118]);
      setStored(STORAGE_KEYS.MATCH_HISTORY, []);
      return { success: true };
    },

    showSaveDialog: async () => ({ canceled: true }),
    showOpenDialog: async () => ({ canceled: true }),
    showMessageBox: async (options) => {
      if (options && options.message) {
        alert(options.message);
      }
      return { response: 0 };
    }
  };
}
