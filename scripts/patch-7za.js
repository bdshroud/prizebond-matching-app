const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target7z = path.join(__dirname, '../node_modules/7zip-bin/win/x64/7za.exe');
const real7z = path.join(__dirname, '../node_modules/7zip-bin/win/x64/7za_real.exe');

if (process.platform === 'win32' && fs.existsSync(target7z) && !fs.existsSync(real7z)) {
  fs.copyFileSync(target7z, real7z);
  const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  if (fs.existsSync(cscPath)) {
    const csFile = path.join(__dirname, 'wrapper.cs');
    execSync(`"${cscPath}" /nologo /out:"${target7z}" "${csFile}"`);
    console.log('[PostInstall] Successfully patched 7za.exe to handle Windows symlink privileges.');
  }
}
