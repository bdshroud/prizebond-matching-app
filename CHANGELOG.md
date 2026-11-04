# Changelog

All notable changes to **PrizeBond Matching App** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-04

### Initial Release 🇧🇩

#### Core Engine & Database
- **High-Performance Winner Matching Engine:** Instant verification across 10,000+ prize bonds against official Bangladesh Bank draw results in single-digit milliseconds.
- **Series-Aware Matching:** Full support for Bangladesh series (`কক`, `খখ`, etc.) or all-series applicable rules.
- **Preserve Leading Zeros:** Bond numbers stored strictly as `TEXT` (e.g. `0562947`) to prevent precision truncation.
- **Local SQLite Storage (`prizebond.db`):** 100% offline persistence stored securely inside Electron's `app.getPath('userData')`.
- **Pre-seeded Official Benchmark:** Pre-loaded with official 118th Bangladesh 100 Tk Prize Bond draw (31 January 2025).

#### Features & Management
- **Dashboard:** Real database metrics (total bonds, saved draws, total winnings, net prize money, latest draw information, recent matches, and backup status).
- **My Prize Bonds:** Single addition, multi-line bulk paste, duplicate detection, search, filter, and batch deletion.
- **Draw Results Archive:** Manage unlimited historical draws, breakdown by prize tier (1st to 5th prize), add/edit/delete draws.
- **Match History:** Persistent audit log of all previous checks and winnings.
- **Rules & Information:** Dedicated Bangladesh Bank 100 Taka prize bond guide, quarterly draw schedules, 2-month maturity requirement, 2-year claim window, 20% source tax note, and official disclaimers.
- **Reports & Analytics:** Portfolio face value, total won prizes, tier distribution.
- **Import / Export & Backup:** CSV export, CSV import, full SQLite database binary backup (`.db`) and restore.
- **Themes & Languages:** Light, Dark, and System theme support; Bilingual UI with Bengali (বাংলা - Default) and English.

#### Desktop & Security
- **Secure Electron Architecture:** Context isolation enabled, secure preload IPC bridge, zero Node permissions in renderer.
- **Packaging:** Windows NSIS installer (`.exe`) and standalone portable executable.
- **Automated Symlink Patch:** Zero-dependency Windows build pipeline bypassing macOS dylib symlink privilege issues.
