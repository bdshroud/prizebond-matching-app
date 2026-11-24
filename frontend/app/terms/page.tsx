import React from 'react';
import { FileText, ShieldAlert, Award, Scale, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions - Bangladesh Prize Bond Platform',
  description: 'Terms of service and legal disclaimer for Bangladesh Prize Bond Monitoring & Winner Notification Platform.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-muted-foreground">
          Last revised: November 2026 | Please read carefully before using the service
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            1. Independent Informational Platform Disclaimer
          </h2>
          <p>
            The Bangladesh Prize Bond Monitoring & Winner Notification Platform is an independent digital tool built to assist citizens in monitoring, saving, and checking their 100 Taka Bangladesh Prize Bonds.
          </p>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            <strong>Disclaimer:</strong> This application is NOT an official agency or direct affiliate of Bangladesh Bank or the Internal Resources Division (IRD). While all draw results are strictly cross-verified with official Bangladesh Bank gazettes, the physical original prize bond must always be produced before Bangladesh Bank or authorized banks to claim any statutory prize.
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            2. Prize Encashment & Claims
          </h2>
          <p>
            This website does not distribute, disburse, or custody prize money. All prize bond encashments are governed by Bangladesh Bank regulations and must be claimed directly from Bangladesh Bank or commercial bank branches within 2 years (730 days) of the draw date with Form PB-1 and the intact physical bond.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            3. Tax Estimates vs Officially Assessed Tax
          </h2>
          <p>
            Calculations displaying a 20% source tax deduction and net prize receivables are estimates calculated strictly according to Section 55 of Bangladesh Income Tax law. Official tax assessment is conducted directly by the National Board of Revenue (NBR) at the time of claim settlement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            4. User Responsibility
          </h2>
          <p>
            Users are responsible for accurately entering their 7-digit bond numbers, series designations, and purchase dates. The platform is not liable for errors arising from incorrect user input or failure to lodge claims within the statutory 2-year deadline.
          </p>
        </section>
      </div>
    </div>
  );
}
