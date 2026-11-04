# PrizeBond Matching App 🇧🇩
### Smart Offline Prize Bond Verification System

> A 100% free, open-source offline Windows desktop application for managing and verifying Bangladesh 100 Taka Prize Bond numbers against official Bangladesh Bank draw results.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows)](https://github.com/bdshroud/prizebond-matching-app/releases)
[![Electron](https://img.shields.io/badge/Electron-34.x-47848F?logo=electron)](https://www.electronjs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?logo=sqlite)](https://www.sqlite.org/)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen)](CONTRIBUTING.md)

---

## ✨ Overview

**PrizeBond Matching App** (PB Matcher) is designed specifically for Bangladesh Prize Bond users (১০০ টাকা মূল্যমান প্রাইজবন্ড). It allows users to safely store unlimited prize bond numbers locally on their desktop and verify them against official draw results within milliseconds.

The application operates **100% offline**, ensuring complete user privacy — your personal financial bond numbers are never sent to external servers or uploaded to third-party databases.

---

## 🚀 Key Features

### Current Features (v1.0.0)

* ⚡ **High-Performance Winner Matching Engine:** Instant verification across 10,000+ prize bonds against official draws in ~4 ms.
* 🇧🇩 **Official Bangladesh Prize Structure:** Pre-configured for official 100 Taka Prize Bond prizes:
  * **১ম পুরস্কার:** ৳৬,০০,০০০ (১টি)
  * **২য় পুরস্কার:** ৳৩,২৫,০০০ (১টি)
  * **৩য় পুরস্কার:** ৳১,০০,০০০ (২টি)
  * **৪র্থ পুরস্কার:** ৳৫০,০০০ (২টি)
  * **৫ম পুরস্কার:** ৳১০,০০০ (৪০টি)
* 🔢 **Leading Zero Preservation:** Numbers are stored as text (e.g., `0562947`), ensuring zero precision truncation.
* 🏷️ **Series-Aware Matching:** Matches across specific series (`কক`, `খখ`) or all applicable series according to official draw rules.
* 📋 **Bulk Paste Addition:** Paste multi-line bond numbers with automatic duplicate filtering.
* 💾 **100% Offline SQLite Database:** Data is persistently stored in `app.getPath('userData')/prizebond.db`.
* 📁 **Data Portability:** Export your bonds to CSV, import CSV sheets, and create full binary SQLite `.db` backups and restores.
* 📊 **Live Dashboard:** Real database metrics (portfolio value, total winnings, latest draw info, recent winning logs).
* 📜 **Match History:** Permanent historical audit log of all winning checks and prize amounts.
* 📖 **Rules & Information Page:** Official Bangladesh Bank draw schedules, 2-month maturity rules, 2-year claim period, and 20% source tax details.
* 🎨 **Dual Themes & Bilingual UI:** Dark Mode, Light Mode, and System Theme; full interface in **বাংলা (Default)** and **English**.

### Planned Roadmap

* [x] Complete Desktop Dashboard
* [x] Prize Bond CRUD & Bulk Management
* [x] Official Draw Results Management & Breakdown
* [x] Fast Indexed Matching Engine
* [x] Match History Logging
* [x] CSV Import / Export
* [x] SQLite Database Backup & Restore
* [x] Bilingual Support (Bangla & English)
* [x] Dark / Light Themes
* [x] Standalone Windows Installer (`.exe`) & Portable Version
* [ ] Automatic Bangladesh Bank official PDF result parsing
* [ ] Android Companion App
* [ ] Desktop Toast Reminder Notifications for Upcoming Draws

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Runtime Container** | [Electron.js](https://www.electronjs.org/) | `v34.x` | Secure Windows desktop application with `contextIsolation` |
| **Frontend Framework** | [Vue 3](https://vuejs.org/) | `v3.5.x` | Modern reactive UI (Composition API with `<script setup>`) |
| **Build & Dev Tool** | [Vite](https://vitejs.dev/) | `v6.x` | High-speed frontend bundling and HMR |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | `v4.x` | Modern styling via `@tailwindcss/vite` |
| **Database** | SQLite via [sql.js](https://sql.js.org/) | `v1.12.x` | Official WebAssembly SQLite engine with local file persistence |
| **State Management** | [Pinia](https://pinia.vuejs.org/) | `v3.x` | Centralized reactive stores for bonds, draws, and settings |
| **Navigation** | [Vue Router](https://router.vuejs.org/) | `v4.x` | Desktop client routing with Hash History |
| **Icons** | [Lucide Vue Next](https://lucide.dev/) | `v0.475.x` | Clean, modern feather icon set |

---

## 📁 Project Structure

```text
prizebond-matching-app/
│
├── electron/
│   ├── main.js             # Electron main process (lifecycle, IPC, window management)
│   ├── preload.js          # Secure context bridge (window.electronAPI)
│   └── database.js         # SQLite database manager (schema, indexes, matching engine)
│
├── src/
│   ├── components/         # Reusable UI components (Sidebar, Topbar, Modals)
│   ├── views/              # View pages (Dashboard, Bonds, Draws, Checker, History, etc.)
│   ├── stores/             # Pinia stores (app, bonds, draws, matching)
│   ├── router/             # Vue Router route definitions
│   ├── i18n/               # Bengali and English translation dictionaries
│   ├── App.vue             # Root layout with sidebar and notification toast
│   ├── main.js             # Vue 3 entry point
│   └── style.css           # Tailwind CSS v4 entry (@import "tailwindcss";)
│
├── scripts/
│   ├── patch-7za.js        # Automated Windows symlink privilege patch
│   └── wrapper.cs          # Native helper wrapper for electron-builder
│
├── .github/
│   ├── workflows/build.yml # GitHub Actions automated Windows build CI
│   └── ISSUE_TEMPLATE/     # Bug report & feature request templates
│
├── package.json            # Scripts, dependencies, and electron-builder config
├── vite.config.js          # Vite config with Vue & Tailwind plugins
├── CHANGELOG.md            # Version release history
├── RELEASE_NOTES.md        # Official v1.0.0 release notes
└── README.md
```

---

## ⚙️ Development & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Windows 10 / 11

### 1. Clone the Repository

```bash
git clone https://github.com/bdshroud/prizebond-matching-app.git
cd prizebond-matching-app
```

### 2. Install Dependencies

On Windows PowerShell:
```powershell
npm.cmd install
```

### 3. Run Development Server (with Hot-Reload)

```powershell
npm.cmd run dev
```

### 4. Build and Run Production Desktop App

```powershell
npm.cmd run build
npm.cmd start
```

### 5. Package Standalone Windows Executables

```powershell
npm.cmd run package
```
*Output binaries are generated in `dist-release/`:*
- `PrizeBond Matching App Setup 1.0.0.exe` (NSIS Installer)
- `PrizeBond Matching App 1.0.0.exe` (Portable version)

---

## 🔒 Privacy & Local Storage

Your privacy is the core founding principle of PrizeBond Matching App:
- **No Remote Telemetry:** No user tracking or analytics.
- **Local SQLite File:** All bond numbers and match logs are stored strictly on your device inside:
  `%APPDATA%\PrizeBond Matching App\prizebond.db`
- **Context Isolation:** Electron context isolation is enabled with zero direct Node.js permissions granted to the renderer window.

---

## ⚠️ Official Disclaimer (আইনি সতর্কতা)

বাংলাদেশ ব্যাংক কর্তৃক প্রকাশিত ফলাফলই চূড়ান্ত বলে গণ্য হবে। এই অ্যাপের ফলাফল এবং সরকারি ফলাফলের মধ্যে কোনো অসামঞ্জস্য থাকলে সরকারি ফলাফল অনুসরণ করতে হবে।

*This project is an independent open-source utility and is not affiliated with or endorsed by Bangladesh Bank. Official notices published by Bangladesh Bank govern all draws and prize claims.*

---

## 🏗️ Architecture & Development Guide

For an in-depth breakdown of the entire application making process, architectural decisions, database schema, and build pipeline, see:
👉 **[DEVELOPMENT.md](DEVELOPMENT.md)**

---

## 🤝 Contributing

Contributions from developers, designers, and testers are warmly welcomed! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## ❤️ Sponsor & Support

PrizeBond Matching App is completely free and open-source for the Bangladesh community. If you find this software helpful:
* ⭐ **Star this repository on GitHub**
* 🍴 **Fork the project** and contribute enhancements
* 💬 **Share it with fellow Prize Bond holders**

---

**Made with ❤️ for the Bangladesh Prize Bond community.**
