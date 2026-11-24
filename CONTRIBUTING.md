# Contributing to Bangladesh Prize Bond Platform

Thank you for your interest in contributing to the Bangladesh Prize Bond Monitoring & Automated Winner Notification Web Platform!

---

## 🛠️ Monorepo Structure

- `frontend/`: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, TanStack Query.
- `backend/`: Node.js, Express.js, TypeScript, Mongoose (MongoDB).
- `docs/`: Technical architecture, API reference, and deployment documentation.

---

## 📋 Development Setup

1. **Prerequisites**: Node.js `v20+` or `v22+` and a running instance of MongoDB.
2. **Install all dependencies**:
   ```bash
   npm run install:backend
   npm run install:frontend
   ```
3. **Environment Setup**:
   ```bash
   cp .env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing & Code Quality

Before opening a pull request, ensure all tests pass and production builds succeed:

1. **Run Backend Tests**:
   ```bash
   npm run test:backend
   ```
2. **Build Backend**:
   ```bash
   npm run build:backend
   ```
3. **Build Frontend**:
   ```bash
   npm run build:frontend
   ```

---

## 🔒 Security Guidelines

- Never commit secrets, passwords, or MongoDB connection URIs.
- All user bond numbers must remain isolated strictly to their owner's MongoDB ID.
- Preserve 7-digit bond number representations as strings (`^[0-9]{7}$`) with leading zeros intact.
- Enforce the 60-day purchase holding eligibility rule and 20% source tax calculations on any matching engine changes.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
