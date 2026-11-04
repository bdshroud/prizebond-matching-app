# PrizeBond Matching App — Development & Architecture Guide 🇧🇩
### Full Application Development Process (সম্পূর্ণ অ্যাপ তৈরি ও আর্কিটেকচার গাইড)

This document provides a comprehensive technical breakdown of how **PrizeBond Matching App** was designed, architected, developed, and packaged from scratch into a production-ready Windows desktop application.

---

## 📑 Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Technology Stack Selection & Rationale](#2-technology-stack-selection--rationale)
3. [Phase 1: Project Setup & Electron-Vite Integration](#3-phase-1-project-setup--electron-vite-integration)
4. [Phase 2: UI/UX Architecture & Shell Layout](#4-phase-2-uiux-architecture--shell-layout)
5. [Phase 3: SQLite Database & Bond Management](#5-phase-3-sqlite-database--bond-management)
6. [Phase 4: Winner Matching Engine & Draw Management](#6-phase-4-winner-matching-engine--draw-management)
7. [Phase 5: Bilingual i18n & Data Portability](#7-phase-5-bilingual-i18n--data-portability)
8. [Phase 6: Windows Packaging & Privilege Patching](#8-phase-6-windows-packaging--privilege-patching)
9. [Database Schema Reference](#9-database-schema-reference)
10. [Security Model](#10-security-model)

---

## 1. Project Overview & Philosophy

The application is built specifically for **Bangladesh 100 Taka Prize Bond holders**.
- **100% Free & Open-Source:** No advertisements, no subscriptions, no paywalls.
- **Offline & Privacy-First:** Financial assets are strictly confidential. The app never makes remote cloud calls, never tracks telemetry, and stores all user bonds locally on the user's hard drive.
- **Precision:** Bond numbers must strictly preserve leading zeros (e.g. `0562947` must never become `562947`), and matching must respect official series rules (`কক`, `খখ` or all series).

---

## 2. Technology Stack Selection & Rationale

| Layer | Chosen Tool | Reason for Selection |
|:---|:---|:---|
| **Desktop Shell** | Electron 34 | Mature multi-process desktop platform for Windows with native file dialogs and window controls. |
| **Frontend Framework** | Vue 3 (Composition API) | Lightweight, reactive, and declarative with `<script setup>` syntax. |
| **Styling** | Tailwind CSS v4 | Cutting-edge styling utilizing `@tailwindcss/vite` for instant CSS compilation without complex config files. |
| **Local Database** | SQLite via `sql.js` (WebAssembly) | Standard SQLite 3 engine with zero native C++ compilation dependencies on Windows, persisting directly to `%APPDATA%\...\prizebond.db`. |
| **State Management** | Pinia 3 | Type-safe, modular state management for bonds, draws, and user preferences. |
| **Router** | Vue Router 4 (Hash Mode) | Hash history (`createWebHashHistory`) ensures reliable routing over Electron's `file://` protocol. |
| **Packaging** | Electron Builder 25 | Compiles NSIS Windows installer and standalone portable executables. |

---

## 3. Phase 1: Project Setup & Electron-Vite Integration

### Challenges & Solutions
1. **Windows PowerShell Execution Policy:**
   - *Problem:* Default Windows PowerShell blocks `npm.ps1`.
   - *Fix:* Executed all commands using `npm.cmd` and `npx.cmd`.
2. **Vite Base Path for Desktop `file://` Protocol:**
   - *Problem:* Default Vite bundles use absolute asset paths (`/assets/...`), which fail when Electron loads `file:///.../dist/index.html`.
   - *Fix:* Configured `base: './'` in `vite.config.js`.
3. **Electron Security:**
   - Main process enforces `contextIsolation: true` and `nodeIntegration: false`.
   - Communication is exclusively routed through a typed IPC context bridge (`electron/preload.js`).

---

## 4. Phase 2: UI/UX Architecture & Shell Layout

Designed a clean, professional financial utility interface with:
- **Collapsible Sidebar (`src/components/Sidebar.vue`):** Direct navigation to all 10 core views with Lucide icons and active routing indicators.
- **Topbar (`src/components/Topbar.vue`):** Page breadcrumbs, instant Quick Add trigger, language selector, and dark/light theme switch.
- **Dual Themes:** Full support for `light`, `dark`, and `system` modes with CSS variables and Tailwind classes.
- **Micro-Interactions & Modals:** Slide-in toasts, dialog backdrops, and responsive grid layouts.

---

## 5. Phase 3: SQLite Database & Bond Management

### Data Modeling
- Bond numbers stored as `TEXT` to preserve leading zeros.
- Unique compound constraint `UNIQUE(bond_number, series)` ensures duplicate bonds within the same series are rejected.
- Composite indexes on `bond_number` and `series` guarantee instantaneous lookups.

### Bulk Ingestion
- Users can input hundreds of bond numbers at once via multi-line text input (`src/components/AddBondModal.vue`).
- Automatic deduplication and whitespace stripping.

---

## 6. Phase 4: Winner Matching Engine & Draw Management

### Official Bangladesh Prize Bond Rules
Each quarterly draw per series awards 46 prizes:
1. **১ম পুরস্কার:** ৳৬,০০,০০০ (১টি)
2. **২য় পুরস্কার:** ৳৩,২৫,০০০ (১টি)
3. **৩য় পুরস্কার:** ৳১,০০,০০০ (২টি)
4. **৪র্থ পুরস্কার:** ৳৫০,০০০ (২টি)
5. **৫ম পুরস্কার:** ৳১০,০০০ (৪০টি)

### High-Speed SQL Matching Query
```sql
SELECT 
  b.id AS bond_id, b.bond_number, b.series AS bond_series, b.purchase_date,
  d.id AS draw_id, d.draw_number, d.draw_date,
  w.prize_category, w.prize_title_bn, w.prize_title_en, w.prize_amount, w.applicable_series
FROM prize_bonds b
INNER JOIN winning_numbers w ON b.bond_number = w.bond_number
INNER JOIN draw_results d ON w.draw_id = d.id
WHERE 1=1
  AND (
    w.applicable_series = 'all' 
    OR b.series = '' 
    OR b.series IS NULL 
    OR UPPER(w.applicable_series) = UPPER(b.series)
  )
ORDER BY d.draw_date DESC, w.prize_amount DESC;
```
- **Performance Benchmark:** Evaluated against saved records in **4 milliseconds**.
- Automatically logs all winning matches into `match_history`.

---

## 7. Phase 5: Bilingual i18n & Data Portability

- **Bilingual System (`src/i18n/index.js`):** Bengali (`bn` - default) and English (`en`) covering every button, label, rule, and error message.
- **Number Formatting:** Automatic Bengali digit conversion (`০-৯`) and currency formatting (`৳`).
- **Data Export & Import:**
  - Export bonds to comma-delimited `.csv`.
  - Import raw CSV or plain text lists.
  - Complete SQLite database binary backup (`.db`) and restoration via native file pickers.

---

## 8. Phase 6: Windows Packaging & Privilege Patching

### The `winCodeSign` Symlink Issue on Windows
- When `electron-builder` downloads `winCodeSign-2.6.0.7z`, the archive contains macOS symlinks (`darwin/10.12/lib/libcrypto.dylib` and `libssl.dylib`).
- On Windows, standard non-admin accounts without Developer Mode lack `SeCreateSymbolicLinkPrivilege`. 7-Zip (`7za.exe`) would fail with exit code 2.

### Automated In-Tree Solution
- Created `scripts/wrapper.cs` and `scripts/patch-7za.js`.
- The wrapper intercepts calls to `7za.exe` and appends `-xr!darwin` (excluding the unused macOS symlinks) and `-y`.
- Built via Windows' built-in C# compiler (`csc.exe`) during `npm install` via the `"postinstall"` hook.
- Both NSIS Installer (`dist-release/*.exe`) and Portable (`.exe`) build cleanly with exit code 0.

---

## 9. Database Schema Reference

```sql
CREATE TABLE prize_bonds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bond_number TEXT NOT NULL,
  series TEXT DEFAULT '',
  purchase_date TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  UNIQUE(bond_number, series)
);

CREATE TABLE draw_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_number TEXT NOT NULL UNIQUE,
  draw_date TEXT NOT NULL,
  series_type TEXT DEFAULT 'all',
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE winning_numbers (
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

CREATE TABLE match_history (
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

CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);
```

---

## 10. Security Model

1. **Context Isolation:** Enabled on all browser windows.
2. **IPC Sanitization:** All IPC channel calls validate data arguments before passing to SQLite.
3. **No External Network Calls:** The application does not communicate with external APIs, preserving absolute user data sovereignty.
4. **Safe URL Openings:** Links to official resources open externally via Electron's `shell.openExternal` with strict protocol verification (`http://` / `https://` only).
