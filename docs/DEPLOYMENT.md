# Production Deployment Guide

This guide covers deploying the Bangladesh Prize Bond Monitoring Platform to production using:
- **Frontend**: Vercel (Next.js 15)
- **Backend**: Render, Railway, or VPS (Node.js / Express)
- **Database**: MongoDB Atlas
- **Transactional Emails**: Resend

---

## 1. MongoDB Atlas Setup
1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges.
3. In Network Access, whitelist your backend deployment IP (or `0.0.0.0/0` with secure user/password).
4. Copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/prizebond_production?retryWrites=true&w=majority`

---

## 2. Backend Deployment (Render / Railway)

### On Render:
1. Create a new **Web Service** connected to your repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables in Render:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<generated_32_char_secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   RESEND_API_KEY=re_your_api_key
   EMAIL_FROM="Bangladesh Prize Bond Monitor <notifications@yourdomain.com>"
   ENABLE_CRON=true
   CRON_SCHEDULE="0 * * * *"
   ADMIN_CRON_SECRET=<generated_cron_secret>
   INITIAL_ADMIN_EMAIL=admin@yourdomain.com
   INITIAL_ADMIN_PASSWORD=YourStrongPassword123!
   INITIAL_ADMIN_NAME="Platform Administrator"
   ```
4. Deploy the service. Note the assigned URL: `https://prizebond-backend.onrender.com`.

---

## 3. Frontend Deployment (Vercel)

### On Vercel:
1. Import the repository into [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
3. Add Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://prizebond-backend.onrender.com
   NEXT_PUBLIC_APP_NAME="Bangladesh Prize Bond Monitor"
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   ```
4. Click **Deploy**. Vercel will build and assign your production domain.

---

## 4. Verification & Post-Deployment Checklist
1. Visit `https://your-frontend-domain.vercel.app`.
2. Check `/checker`: test checking `0123456` against published draws.
3. Register a test citizen user.
4. Verify initial admin login with `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`.
5. In `/admin`: verify Draw #118 is present with 46 official winning numbers.
6. Verify email delivery with Resend.
