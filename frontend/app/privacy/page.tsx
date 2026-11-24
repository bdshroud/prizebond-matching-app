import React from 'react';
import { Shield, Lock, Eye, Database, Bell, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Bangladesh Prize Bond Platform',
  description: 'How we collect, protect, and handle your data and saved prize bond numbers.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">
          Last revised: November 2026 | Effective for all registered and guest users
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            1. Information We Collect
          </h2>
          <p>
            When you register on the Bangladesh Prize Bond Monitoring Platform, we collect basic account credentials including your full name, email address, password (securely hashed via bcrypt), and optional telephone number.
          </p>
          <p>
            When you manage your bond portfolio, you submit 7-digit bond serial numbers, optional series codes, and purchase dates for eligibility calculation. <strong>We do NOT ask for or store bank account login credentials, debit/credit cards, or sensitive financial pins.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            2. How Your Saved Bond Numbers Are Handled
          </h2>
          <p>
            Your saved prize bond records belong exclusively to your user profile. Each bond is tied strictly to your authenticated MongoDB user ID. Our database schema enforces tenant isolation: no other user or public API can view, search, or query your saved bonds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            3. Automated Draw Processing & Winner Matching
          </h2>
          <p>
            When official draw results are verified, our internal background engine performs indexed matching solely to detect if any of your saved bonds won prizes, calculate estimated 20% withholding tax, and generate in-app and email notifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            4. Email Notifications & Preferences
          </h2>
          <p>
            We only send transactional emails related to your account: email verification, password reset links, winning bond alerts, and quarterly draw release notices. You can update or toggle off draw notifications anytime inside your Profile settings. We do not sell or rent your email address to advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            5. Cookies and Local Storage
          </h2>
          <p>
            Our web application uses browser LocalStorage solely to maintain your active secure JWT authentication session and remember your theme preferences (light/dark mode).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">
            6. Contacting the Privacy Officer
          </h2>
          <p>
            If you have questions regarding data retention, account deletion, or privacy practices, please contact us at <a href="mailto:privacy@prizebond-bd.com" className="text-emerald-400 underline">privacy@prizebond-bd.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
