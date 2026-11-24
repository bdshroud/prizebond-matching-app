import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Trophy,
  ShieldCheck,
  Percent,
  Clock,
  Building2,
  FileCheck2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const metadata = {
  title: 'Official Bangladesh Prize Bond Rules & Prize Structure',
  description: 'Complete guide to Bangladesh Bank 100 Taka Prize Bond draw schedules, prize amounts, 60-day eligibility rule, 20% source tax, and claim procedures.'
};

export default function RulesPage() {
  const prizeStructure = [
    { rank: 'First Prize', count: '1 per series', amount: 600000, tax: 120000, net: 480000, badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { rank: 'Second Prize', count: '1 per series', amount: 325000, tax: 65000, net: 260000, badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { rank: 'Third Prize', count: '2 per series', amount: 100000, tax: 20000, net: 80000, badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { rank: 'Fourth Prize', count: '2 per series', amount: 50000, tax: 10000, net: 40000, badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { rank: 'Fifth Prize', count: '40 per series', amount: 10000, tax: 2000, net: 8000, badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Government of the People's Republic of Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Bangladesh Bank 100 Taka Prize Bond Regulations
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Authorized guidelines, official prize table, draw dates, tax deductions, and encashment procedures under the Internal Resources Division (IRD) and National Savings Directorate.
        </p>
      </div>

      {/* Prize Table */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Official Prize Distribution (Per Series)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each quarterly draw awards 46 total prizes per active series in circulation.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-muted-foreground border border-border self-start sm:self-auto">
            Total 46 Prizes / Series
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                <th className="py-3 px-4">Prize Tier</th>
                <th className="py-3 px-4">Number of Winners</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">20% Source Tax</th>
                <th className="py-3 px-4 text-emerald-400">Net Receivable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {prizeStructure.map((prize, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mr-2 ${prize.badge}`}>
                      {prize.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono text-xs">{prize.count}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{formatCurrency(prize.amount)}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-medium">- {formatCurrency(prize.tax)}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-400">{formatCurrency(prize.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/40 rounded-xl text-xs text-muted-foreground space-y-1">
          <span className="font-semibold text-foreground block">Key Note on Series Multiplication:</span>
          <p>
            Bangladesh Prize Bonds are issued in series (e.g. KA, KHA, GA, etc.). When a 7-digit number is drawn, the holder of that number in <strong>EVERY single series</strong> in circulation wins the respective prize!
          </p>
        </div>
      </div>

      {/* 4 Critical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Draw Schedule */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Quarterly Draw Dates</h3>
              <p className="text-xs text-muted-foreground">Four scheduled draws each calendar year</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-background rounded-xl border border-border">
              <span className="font-bold text-emerald-400 block text-sm">31st January</span>
              <span className="text-muted-foreground">1st Quarter Draw</span>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border">
              <span className="font-bold text-emerald-400 block text-sm">30th April</span>
              <span className="text-muted-foreground">2nd Quarter Draw</span>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border">
              <span className="font-bold text-emerald-400 block text-sm">31st July</span>
              <span className="text-muted-foreground">3rd Quarter Draw</span>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border">
              <span className="font-bold text-emerald-400 block text-sm">31st October</span>
              <span className="text-muted-foreground">4th Quarter Draw</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If the scheduled draw date falls on a weekend (Friday/Saturday) or government public holiday, the draw is held on the very next working day at the Bangladesh Bank Dhaka Office.
          </p>
        </div>

        {/* 60-Day Eligibility Rule */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">60-Day Holding Rule</h3>
              <p className="text-xs text-muted-foreground">Mandatory minimum holding before draw</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To prevent speculative last-minute purchases, Bangladesh Bank requires a prize bond to be purchased at least <strong>60 calendar days</strong> prior to the draw date in order to be eligible for prizes in that draw.
          </p>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            <strong>Example:</strong> For the April 30th draw, bonds must have been purchased on or before March 1st. Bonds purchased on March 15th will become eligible from the July 31st draw onwards.
          </div>
        </div>

        {/* 20% Withholding Tax */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">20% Source Tax (Section 55)</h3>
              <p className="text-xs text-muted-foreground">Income Tax Ordinance 1984 / Act 2023</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            By statutory law under Section 55 of Bangladesh Income Tax, a mandatory <strong>20% withholding tax (AIT)</strong> is deducted from all winning prize bond amounts before disbursement.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bangladesh Bank issues an official Tax Deduction Certificate which can be submitted with your annual income tax return (NBR).
          </p>
        </div>

        {/* 2-Year Claim Expiration */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">2-Year Claim Period</h3>
              <p className="text-xs text-muted-foreground">730 calendar days from draw date</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Winners have exactly <strong>2 years (730 days)</strong> from the date of the draw to lodge their claim with Bangladesh Bank or designated commercial bank branches.
          </p>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Prizes unclaimed after 2 years are forfeited and revert to the Government of Bangladesh Treasury.</span>
          </div>
        </div>
      </div>

      {/* Claim Procedure Checklist */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-400" />
          <span>Step-by-Step Prize Encashment Process</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">1</span>
            <h4 className="font-bold text-foreground text-sm">Download Claim Form</h4>
            <p className="text-muted-foreground">
              Obtain the official Bangladesh Bank Prize Bond Claim Form (Form PB-1) from any Bangladesh Bank branch or authorized bank.
            </p>
          </div>

          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">2</span>
            <h4 className="font-bold text-foreground text-sm">Gather Supporting Documents</h4>
            <p className="text-muted-foreground">
              Attach the original winning bond, verified National ID (NID) photocopy, 2 passport-size photographs, bank account statement/cancelled cheque, and e-TIN.
            </p>
          </div>

          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">3</span>
            <h4 className="font-bold text-foreground text-sm">Disbursement of Prize</h4>
            <p className="text-muted-foreground">
              Following structural bond verification and serial clearance, net prize money is directly transferred to your nominated commercial bank account via BEFTN/RTGS.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-8 bg-gradient-to-r from-emerald-950/40 via-card to-card border border-emerald-500/20 rounded-2xl space-y-3">
        <h3 className="text-xl font-bold text-foreground">Have Prize Bonds in Hand?</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Save your bond numbers once and let our automated platform monitor every single draw on your behalf.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/checker"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-card hover:bg-muted/50 border border-border text-foreground rounded-xl text-sm font-semibold transition-colors"
          >
            Instant Checker
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
