const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const dbManager = require('./database');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    backgroundColor: '#0f172a',
    title: 'PrizeBond Matching App 🇧🇩',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // needed for better-sqlite3 communication in preload
    }
  });

  // Remove default menu for clean, modern desktop app experience
  mainWindow.setMenuBarVisibility(false);

  const devUrl = 'http://localhost:5173';
  const distIndex = path.join(__dirname, '../dist/index.html');
  const isDevMode = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

  if (isDevMode) {
    console.log('[Electron] Running in dev mode, connecting to Vite dev server...');
    mainWindow.loadURL(devUrl).catch((err) => {
      console.log('[Electron] Vite dev server not yet ready, retrying...', err.message);
      setTimeout(() => mainWindow.loadURL(devUrl), 1000);
    });
  } else if (fs.existsSync(distIndex)) {
    console.log('[Electron] Loading production build from:', distIndex);
    mainWindow.loadFile(distIndex);
  } else {
    mainWindow.loadURL(devUrl);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDevMode) {
      // Optional: mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    const userDataPath = app.getPath('userData');
    console.log('[Electron] UserData path:', userDataPath);

    // Initialize local SQLite database
    await dbManager.initDatabase(userDataPath);

    registerIpcHandlers();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ==========================================
// Register IPC Handlers
// ==========================================

function registerIpcHandlers() {
  // App info
  ipcMain.handle('app:get-version', () => app.getVersion());
  ipcMain.handle('app:get-user-data-path', () => app.getPath('userData'));
  ipcMain.handle('app:open-external', async (event, url) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      await shell.openExternal(url);
    }
  });

  // Prize Bonds
  ipcMain.handle('bonds:get', (event, filters) => dbManager.getBonds(filters));
  ipcMain.handle('bonds:add', (event, data) => dbManager.addBond(data));
  ipcMain.handle('bonds:bulk-add', (event, list) => dbManager.bulkAddBonds(list));
  ipcMain.handle('bonds:update', (event, data) => dbManager.updateBond(data));
  ipcMain.handle('bonds:delete', (event, id) => dbManager.deleteBond(id));
  ipcMain.handle('bonds:delete-multiple', (event, ids) => dbManager.deleteBonds(ids));

  // Draws
  ipcMain.handle('draws:get', (event, filters) => dbManager.getDraws(filters));
  ipcMain.handle('draws:get-by-id', (event, id) => dbManager.getDrawById(id));
  ipcMain.handle('draws:add', (event, data) => dbManager.addDraw(data));
  ipcMain.handle('draws:update', (event, data) => dbManager.updateDraw(data));
  ipcMain.handle('draws:delete', (event, id) => dbManager.deleteDraw(id));

  // Winner Matching Engine
  ipcMain.handle('matching:check-winners', (event, params) => dbManager.checkWinners(params));
  ipcMain.handle('matching:get-history', (event, filters) => dbManager.getMatchHistory(filters));
  ipcMain.handle('matching:delete-history', (event, ids) => dbManager.deleteMatchHistory(ids));
  ipcMain.handle('matching:clear-history', () => dbManager.clearMatchHistory());

  // Dashboard Stats
  ipcMain.handle('stats:get-dashboard', () => dbManager.getDashboardStats());

  // Settings
  ipcMain.handle('settings:get-all', () => dbManager.getAllSettings());
  ipcMain.handle('settings:get', (event, key) => dbManager.getSetting(key));
  ipcMain.handle('settings:save', (event, key, val) => dbManager.saveSetting(key, val));

  // Dialogs
  ipcMain.handle('dialog:save', (event, options) => dialog.showSaveDialog(mainWindow, options));
  ipcMain.handle('dialog:open', (event, options) => dialog.showOpenDialog(mainWindow, options));
  ipcMain.handle('dialog:message', (event, options) => dialog.showMessageBox(mainWindow, options));

  // Import / Export Operations
  ipcMain.handle('io:export-bonds-csv', async () => {
    const { bonds } = dbManager.getBonds({ limit: 100000 });
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Prize Bonds as CSV',
      defaultPath: `prizebonds_export_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    let csvContent = 'Bond Number,Series,Purchase Date,Notes,Created Date\n';
    for (const b of bonds) {
      const row = [
        `"${b.bond_number}"`,
        `"${b.series || ''}"`,
        `"${b.purchase_date || ''}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`,
        `"${b.created_at || ''}"`
      ];
      csvContent += row.join(',') + '\n';
    }

    fs.writeFileSync(filePath, csvContent, 'utf8');
    return { success: true, count: bonds.length, filePath };
  });

  ipcMain.handle('io:import-bonds-csv', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Import Prize Bonds CSV',
      filters: [{ name: 'CSV Files', extensions: ['csv', 'txt'] }],
      properties: ['openFile']
    });

    if (canceled || !filePaths || filePaths.length === 0) return { success: false, canceled: true };

    const content = fs.readFileSync(filePaths[0], 'utf8');
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    if (lines.length === 0) throw new Error('File is empty');

    const bondsToAdd = [];
    const header = lines[0].toLowerCase();
    const startIndex = header.includes('bond') || header.includes('number') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Split by comma ignoring commas inside quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
      
      const num = parts[0];
      const series = parts[1] || '';
      const purchaseDate = parts[2] || null;
      const notes = parts[3] || '';

      if (num) {
        bondsToAdd.push({
          bond_number: num,
          series: series,
          purchase_date: purchaseDate,
          notes: notes
        });
      }
    }

    const result = dbManager.bulkAddBonds(bondsToAdd);
    return { success: true, ...result, filePath: filePaths[0] };
  });

  ipcMain.handle('io:backup-database', async () => {
    const defaultName = `prizebond_backup_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.db`;
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Backup PrizeBond Database',
      defaultPath: defaultName,
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    return dbManager.backupDatabase(filePath);
  });

  ipcMain.handle('io:restore-database', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Backup Database to Restore',
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite'] }],
      properties: ['openFile']
    });

    if (canceled || !filePaths || filePaths.length === 0) return { success: false, canceled: true };

    const userDataPath = app.getPath('userData');
    return dbManager.restoreDatabase(filePaths[0], userDataPath);
  });

  ipcMain.handle('io:clear-all-data', () => dbManager.clearAllData());
}
