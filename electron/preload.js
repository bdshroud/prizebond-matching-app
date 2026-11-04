const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, isolated Electron API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  getUserDataPath: () => ipcRenderer.invoke('app:get-user-data-path'),
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),

  // Prize Bonds
  getBonds: (filters) => ipcRenderer.invoke('bonds:get', filters),
  addBond: (bondData) => ipcRenderer.invoke('bonds:add', bondData),
  bulkAddBonds: (bondsList) => ipcRenderer.invoke('bonds:bulk-add', bondsList),
  updateBond: (bondData) => ipcRenderer.invoke('bonds:update', bondData),
  deleteBond: (id) => ipcRenderer.invoke('bonds:delete', id),
  deleteBonds: (ids) => ipcRenderer.invoke('bonds:delete-multiple', ids),

  // Draws
  getDraws: (filters) => ipcRenderer.invoke('draws:get', filters),
  getDrawById: (id) => ipcRenderer.invoke('draws:get-by-id', id),
  addDraw: (drawData) => ipcRenderer.invoke('draws:add', drawData),
  updateDraw: (drawData) => ipcRenderer.invoke('draws:update', drawData),
  deleteDraw: (id) => ipcRenderer.invoke('draws:delete', id),

  // Winner Matching Engine
  checkWinners: (params) => ipcRenderer.invoke('matching:check-winners', params),
  getMatchHistory: (filters) => ipcRenderer.invoke('matching:get-history', filters),
  deleteMatchHistory: (ids) => ipcRenderer.invoke('matching:delete-history', ids),
  clearMatchHistory: () => ipcRenderer.invoke('matching:clear-history'),

  // Dashboard Stats
  getDashboardStats: () => ipcRenderer.invoke('stats:get-dashboard'),

  // Import / Export & Backup
  exportBondsCSV: () => ipcRenderer.invoke('io:export-bonds-csv'),
  importBondsCSV: () => ipcRenderer.invoke('io:import-bonds-csv'),
  exportDrawsJSON: () => ipcRenderer.invoke('io:export-draws-json'),
  importDrawsJSON: () => ipcRenderer.invoke('io:import-draws-json'),
  backupDatabase: () => ipcRenderer.invoke('io:backup-database'),
  restoreDatabase: () => ipcRenderer.invoke('io:restore-database'),
  clearAllData: () => ipcRenderer.invoke('io:clear-all-data'),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get-all'),
  getSetting: (key) => ipcRenderer.invoke('settings:get', key),
  saveSetting: (key, value) => ipcRenderer.invoke('settings:save', key, value),

  // Dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:save', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:open', options),
  showMessageBox: (options) => ipcRenderer.invoke('dialog:message', options)
});
