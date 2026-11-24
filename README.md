# Bangladesh Prize Bond Monitoring & Winner Notification Platform 🇧🇩

> Production-ready, responsive, full-stack web application for monitoring Bangladesh 100 Taka Prize Bonds, automated quarterly draw matching, withholding tax estimation, and real-time winner notifications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Key Features

### 👤 User & Authentication
- **Secure Authentication**: User registration, login, logout, password recovery, email verification, and JWT session handling with bcrypt password hashing.
- **Tenant Isolation**: Saved bonds are indexed strictly to the authenticated user's MongoDB ID. No user can view or query another user's bonds.
- **Profile & Notification Preferences**: Toggle instant email alerts on draw wins (`emailOnWin`) or new quarterly draw releases (`emailOnNewDraw`).

### 🎟️ Unlimited Prize Bond Management
- **String Precision (7-Digit Preservation)**: Stored as strings (`^[0-9]{7}$`), preserving leading zeros (e.g. `0012345`).
- **Flexible Series Support**: Save bonds with specific Bengali/English series (e.g. `ক` / `KA`) or `all` series.
- **Bulk Operations**: Bulk enter lists of bonds with duplicate detection and validation.
- **CSV Data Portability**: Instant CSV import and export with standard headers (`bondNumber,series,purchaseDate,notes`).

### 🎯 Automated Matching Engine
- **Official Draw Verification Gate**: Matches are strictly triggered only when official draw gazettes are verified and published by an administrator.
- **60-Day Holding Eligibility Rule**: Automatically validates that bonds were purchased at least 60 calendar days before the official draw date, adhering to Bangladesh Bank regulations.
- **Section 55 Withholding Tax (20%)**: Automatically computes statutory 20% source tax deductions, calculating gross prize money and estimated net receivable amounts.
- **2-Year Claim Deadline Tracker**: Calculates remaining days before the 730-day statutory claim deadline lapses.
- **Idempotency & Duplicate Prevention**: Database-level unique compound constraint (`{ draw: 1, user: 1, bond: 1, prizeCategory: 1 }`) prevents duplicate matches or spam emails across job retries.

### 🔍 Instant Public Prize Bond Checker
- **No Login Required for Quick Checks**: Visitors can check single or bulk lists of bond numbers against all verified historical draws in milliseconds.
- **Detailed Prize Breakdowns**: Displays winning category, gross prize, 20% tax, net win, draw number, and link to official draw gazette.

### 🛡️ Comprehensive Admin Dashboard
- **Draw Management**: Create, edit, add winning numbers, verify, and publish draws.
- **User Management**: Monitor user registrations, email verification status, and toggle user/admin roles.
- **Job Execution Logs**: Real-time audit trail of background matching runs with execution time, bonds checked, and matches detected.
- **Email Logs & Safe Retries**: Monitor transactional notification deliveries and trigger safe one-click retries on failed deliveries.
- **Audit Trail**: Detailed administrative audit log tracking critical platform actions.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, TanStack Query, React Hook Form, Zod |
| **Backend** | Node.js 22+, Express.js, TypeScript, Mongoose ODM, JWT, bcrypt, Zod validation |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Scheduled Jobs** | Node-Cron, Render Cron, dedicated background worker |
| **Emails** | Resend API / Transactional HTML templates with fail-safe logging |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) |

---

## 🏛️ Official Bangladesh 100 Tk Prize Bond Structure

Every quarterly draw distributes **46 prizes per series in circulation**:

| Prize Category | Winners Per Series | Gross Amount | 20% Source Tax | Net Receivable |
| :--- | :---: | :---: | :---: | :---: |
| **First Prize** | 1 | ৳ 600,000 | ৳ 120,000 | **৳ 480,000** |
| **Second Prize** | 1 | ৳ 325,000 | ৳ 65,000 | **৳ 260,000** |
| **Third Prize** | 2 | ৳ 100,000 | ৳ 20,000 | **৳ 80,000** |
| **Fourth Prize** | 2 | ৳ 50,000 | ৳ 10,000 | **৳ 40,000** |
| **Fifth Prize** | 40 | ৳ 10,000 | ৳ 2,000 | **৳ 8,000** |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js `v20+` or `v22+`
- MongoDB running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/prizebond-matching-app.git
cd prizebond-matching-app

# Install monorepo dependencies
npm run install:backend
npm run install:frontend
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env` and `frontend/.env.local`:
```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Start Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

Initial Admin credentials (auto-seeded on first run):
- **Email**: `admin@prizebond.gov.bd`
- **Password**: `AdminPass123!`

---

## 🧪 Running Automated Tests

Run backend unit and integration tests (testing 60-day purchase rule, 20% withholding tax calculation, compound index matching, and category detection):
```bash
npm run test:backend
```

Run production builds:
```bash
npm run build:backend
npm run build:frontend
```

---

## 📂 Project Structure

```
prizebond-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Constants, environment schemas, DB connection
│   │   ├── controllers/     # Express route handlers
│   │   ├── jobs/            # Node-cron background worker
│   │   ├── middleware/      # Auth (JWT), rate limiting, error handling, Zod
│   │   ├── models/          # Mongoose data models with compound indexes
│   │   ├── routes/          # Express API route modules
│   │   ├── services/        # Matching engine, email, notification services
│   │   ├── tests/           # Vitest unit & integration test suites
│   │   ├── utils/           # Tax calculator, logger, JWT, seed data
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                 # Next.js 15 App Router pages & layouts
│   │   ├── (auth)/          # Login, Register, Forgot Password, Reset Password
│   │   ├── admin/           # Comprehensive admin management center
│   │   ├── bonds/           # My Prize Bonds (Add, Edit, Bulk, CSV)
│   │   ├── checker/         # Instant public bond checker
│   │   ├── contact/         # Support desk & enquiry form
│   │   ├── dashboard/       # User dashboard, stats, countdown
│   │   ├── draws/           # Draws catalog & detailed prize lists
│   │   ├── faq/             # Interactive searchable FAQ
│   │   ├── history/         # Match history & prize claim guide
│   │   ├── notifications/   # In-app notification center
│   │   ├── privacy/         # Privacy policy
│   │   ├── profile/         # Account settings & notification preferences
│   │   ├── rules/           # Official Bangladesh Bank bond regulations
│   │   └── terms/           # Terms and conditions
│   ├── components/          # Reusable UI & layout components
│   ├── hooks/               # useAuth custom hook and context
│   ├── lib/                 # Utility helpers (currency formatting, date)
│   ├── services/            # Type-safe API client
│   ├── types/               # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── API.md               # Complete REST API reference
│   ├── ARCHITECTURE.md      # Technical architecture and matching engine design
│   └── DEPLOYMENT.md        # Production deployment instructions (Vercel/Render)
├── .env.example             # Monorepo environment variable template
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## 📜 Legal Disclaimer
This platform is an independent service built to assist citizens in tracking and checking their Bangladesh 100 Taka Prize Bonds. It is not directly affiliated with Bangladesh Bank or the Internal Resources Division. All official prize claims require physical presentation of the intact prize bond before Bangladesh Bank or authorized commercial banks within 2 years of the draw date.

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
