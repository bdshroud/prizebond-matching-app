'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Trophy,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [prizeCategory, setPrizeCategory] = useState('');
  const [showClaimGuide, setShowClaimGuide] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['match-history', page, search, prizeCategory],
    queryFn: () =>
      api.matching.getHistory({
        page,
        limit: 10,
        search: search.trim() || undefined,
        prizeCategory: prizeCategory || undefined
      }),
    enabled: !!user
  });

  const getPrizeBadgeClass = (category: string) => {
    switch (category) {
      case 'first':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'second':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'third':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'fourth':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const isExpired = (drawDateStr: string | Date) => {
    const drawDate = new Date(drawDateStr);
    const deadline = new Date(drawDate.getTime() + 730 * 24 * 60 * 60 * 1000);
    return new Date() > deadline;
  };

  const getRemainingDays = (drawDateStr: string | Date) => {
    const drawDate = new Date(drawDateStr);
    const deadline = new Date(drawDate.getTime() + 730 * 24 * 60 * 60 * 1000);
    const diff = deadline.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <Trophy className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Sign In to View Your Match History</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Track all your winning prize bonds, calculate net receivable prizes after tax, and manage claim deadlines.
        </p>
        <Link
          href="/login?redirect=/history"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const matches = data?.matches || [];
  const summary = data?.summary || { totalGross: 0, totalNet: 0 };
  const totalMatches = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>Winning Match History</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official record of your saved bonds that won prizes across Bangladesh Bank draws.
          </p>
        </div>

        <button
          onClick={() => setShowClaimGuide(!showClaimGuide)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted/50 border border-border text-foreground rounded-xl text-sm font-medium transition-colors"
        >
          <Info className="w-4 h-4 text-emerald-400" />
          <span>{showClaimGuide ? 'Hide Claim Guide' : 'How to Claim Prizes'}</span>
        </button>
      </div>

      {/* Claim Instructions Banner */}
      {showClaimGuide && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-card to-card border border-emerald-500/30 rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <FileCheck2 className="w-5 h-5" />
            <span>Official Bangladesh Bank Prize Bond Claim Procedure</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-muted-foreground leading-relaxed">
            <div className="bg-background/80 border border-border/60 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-foreground block text-sm">1. Time Limit</span>
              <p>Winnings must be claimed within 2 years (730 days) from the official draw date. After 2 years, unclaimed prizes lapse to the Government Treasury.</p>
            </div>
            <div className="bg-background/80 border border-border/60 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-foreground block text-sm">2. Where to Claim</span>
              <p>Prizes up to Tk 10,000 can be encashed at scheduled commercial bank branches. Higher prizes must be claimed directly through Bangladesh Bank offices.</p>
            </div>
            <div className="bg-background/80 border border-border/60 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-foreground block text-sm">3. Documents Required</span>
              <p>Original Prize Bond without any mutilation, claimant's NID copy, 2 passport photos, bank statement/cheque leaf, and e-TIN certificate.</p>
            </div>
            <div className="bg-background/80 border border-border/60 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-foreground block text-sm">4. 20% Source Tax</span>
              <p>Under Section 55 of the Bangladesh Income Tax Ordinance, 20% source tax is compulsorily deducted and deposited directly to the National Board of Revenue (NBR).</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Winning Matches
          </span>
          <div className="text-3xl font-extrabold text-foreground">{totalMatches}</div>
          <span className="text-xs text-muted-foreground">Lifetime successful matches</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Gross Prize Value
          </span>
          <div className="text-3xl font-extrabold text-foreground">
            {formatCurrency(summary.totalGross)}
          </div>
          <span className="text-xs text-muted-foreground">Before source tax deduction</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Withholding Tax (20%)
          </span>
          <div className="text-3xl font-extrabold text-rose-400">
            - {formatCurrency(summary.totalGross - summary.totalNet)}
          </div>
          <span className="text-xs text-muted-foreground">Section 55 Gov't tax deduction</span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Net Receivable Prize
          </span>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(summary.totalNet)}
          </div>
          <span className="text-xs text-emerald-500/80">Net cash payable to your bank</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by bond number, draw #, or prize category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={prizeCategory}
            onChange={(e) => {
              setPrizeCategory(e.target.value);
              setPage(1);
            }}
            className="bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Prize Categories</option>
            <option value="first">First Prize (Tk 600,000)</option>
            <option value="second">Second Prize (Tk 325,000)</option>
            <option value="third">Third Prize (Tk 100,000)</option>
            <option value="fourth">Fourth Prize (Tk 50,000)</option>
            <option value="fifth">Fifth Prize (Tk 10,000)</option>
          </select>
        </div>
      </div>

      {/* Matches Table / Cards */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Winning Matches Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {search || prizeCategory
              ? 'No winning records match your current search filters.'
              : "You don't have any winning prize bonds yet. Ensure your bonds are registered and eligible for upcoming quarterly draws."}
          </p>
          <div className="pt-2">
            <Link
              href="/bonds"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <span>Manage My Prize Bonds</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4">Bond Number</th>
                  <th className="py-3.5 px-4">Prize Category</th>
                  <th className="py-3.5 px-4">Draw Information</th>
                  <th className="py-3.5 px-4">Gross Prize</th>
                  <th className="py-3.5 px-4">Tax (20%)</th>
                  <th className="py-3.5 px-4">Net Payable</th>
                  <th className="py-3.5 px-4">Claim Deadline</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {matches.map((match) => {
                  const expired = isExpired(match.drawDate);
                  const daysLeft = getRemainingDays(match.drawDate);

                  return (
                    <tr key={match._id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-base text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">{match.bondNumber}</span>
                          <span className="text-xs font-normal text-muted-foreground font-sans">
                            ({match.series})
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getPrizeBadgeClass(
                            match.prizeCategory
                          )}`}
                        >
                          {match.prizeCategory}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-muted-foreground">
                        <div className="font-semibold text-foreground text-sm">
                          Draw #{match.drawNumber}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(match.drawDate)}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-foreground">
                        {formatCurrency(match.grossAmount)}
                      </td>

                      <td className="py-4 px-4 text-rose-400 font-medium">
                        - {formatCurrency(match.estimatedTax)}
                      </td>

                      <td className="py-4 px-4 font-bold text-emerald-400">
                        {formatCurrency(match.netAmount)}
                      </td>

                      <td className="py-4 px-4 text-xs">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            {daysLeft} days left
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/draws/${typeof match.draw === 'string' ? match.draw : match.draw._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          <span>Official Draw</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 text-sm text-muted-foreground">
              <div>
                Showing page {page} of {totalPages} ({totalMatches} total wins)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-border rounded-xl disabled:opacity-40 hover:bg-muted/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-border rounded-xl disabled:opacity-40 hover:bg-muted/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
