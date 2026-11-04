# PrizeBond Matching App v1.0.0 — Initial Official Release 🇧🇩
### স্মার্ট অফলাইন বাংলাদেশ প্রাইজবন্ড ভেরিফিকেশন সিস্টেম (Smart Offline Prize Bond Verification System)

We are thrilled to announce the official **v1.0.0** release of **PrizeBond Matching App** (PB Matcher) — a completely **100% FREE, OPEN-SOURCE, and OFFLINE** Windows desktop application designed specifically for holders of Bangladesh 100 Taka Prize Bonds (১০০ টাকা মূল্যমান বাংলাদেশ প্রাইজবন্ড).

---

## 🌟 Key Highlights (মূল সুবিধাসমূহ)

- 🔒 **100% Offline & Private:** All your prize bonds, draw results, and match history stay strictly on your local PC inside an embedded SQLite database (`prizebond.db`). Zero cloud uploads, zero telemetry, zero tracking.
- ⚡ **Ultra-Fast Matching Engine:** Matches 10,000+ saved bonds against official draw results in just **4 milliseconds** using indexed SQL queries.
- 🇧🇩 **Official Bangladesh Prize Structure:** Pre-configured for official Bangladesh 100 Tk Prize Bond prize tiers:
  - **১ম পুরস্কার:** ৳৬,০০,০০০ (১টি)
  - **২য় পুরস্কার:** ৳৩,২৫,০০০ (১টি)
  - **৩য় পুরস্কার:** ৳১,০০,০০০ (২টি)
  - **৪র্থ পুরস্কার:** ৳৫০,০০০ (২টি)
  - **৫ম পুরস্কার:** ৳১০,০০০ (৪০টি)
- 🔢 **Series & Leading Zeros Preservation:** Numbers are stored as text (e.g., `0562947`), ensuring leading zeros are never lost. Full support for series matching (`কক`, `খখ` or all series).
- 📋 **Bulk Addition:** Add hundreds of bond numbers at once using copy-paste with automatic duplicate filtering.
- 📁 **Data Portability:** Export your bonds to CSV, import existing CSV spreadsheets, and take full binary SQLite database backups (`.db`).
- 🎨 **Modern Dashboard & Dual Themes:** Clean financial utility interface supporting Light Mode, Dark Mode, and System Theme.
- 🌐 **Bilingual Support:** Complete interface in both **বাংলা (Default)** and **English**.
- 🎁 **Completely Free:** No ads, no subscriptions, no in-app purchases, no premium locks.

---

## 📥 Downloads (উইন্ডোজের জন্য ডাউনলোড)

| File Name | Format | Size | Description |
|:---|:---:|:---:|:---|
| **[PrizeBond Matching App Setup 1.0.0.exe](https://github.com/bdshroud/prizebond-matching-app/releases/download/v1.0.0/PrizeBond.Matching.App.Setup.1.0.0.exe)** | NSIS Installer | ~97 MB | Standard Windows installer (creates Desktop & Start Menu shortcuts). |
| **[PrizeBond Matching App 1.0.0.exe](https://github.com/bdshroud/prizebond-matching-app/releases/download/v1.0.0/PrizeBond.Matching.App.1.0.0.exe)** | Portable | ~97 MB | Standalone portable executable. Run immediately without installing. |

---

## 🔐 Checksums (SHA-256 Verification)

To verify the integrity and authenticity of the downloaded binaries:

```text
07EA308597B8BD8465D78604F3A4A20F5BD2A3313E39477DD3AD557DBFD0299D  PrizeBond Matching App Setup 1.0.0.exe
69901F3DB57149584B4AB12EE75B1BCFA268BC2ACC9E8D904E2B95C8E19155AA  PrizeBond Matching App 1.0.0.exe
```

---

## 💻 System Requirements

- **OS:** Windows 10 or Windows 11 (64-bit)
- **RAM:** 2 GB or more
- **Disk Space:** ~250 MB free disk space
- **Internet:** Not required (100% offline functional)

---

## ℹ️ Windows SmartScreen Note

Because this is a brand-new, free, open-source community release and not signed with a multi-thousand-dollar commercial Microsoft EV certificate:
1. Windows Defender SmartScreen may display: *"Windows protected your PC"*.
2. Click **"More info"** (আরও তথ্য).
3. Click **"Run anyway"** (তবুও চালান).

The entire application source code is 100% open and auditable under the [MIT License](https://github.com/bdshroud/prizebond-matching-app/blob/main/LICENSE).

---

## 📜 Disclaimer (আইনি সতর্কতা)

বাংলাদেশ ব্যাংক কর্তৃক প্রকাশিত ফলাফলই চূড়ান্ত বলে গণ্য হবে। এই অ্যাপের ফলাফল এবং সরকারি ফলাফলের মধ্যে কোনো অসামঞ্জস্য থাকলে সরকারি ফলাফল অনুসরণ করতে হবে।
*(Official notices published by Bangladesh Bank govern all draws and prize claims).*
