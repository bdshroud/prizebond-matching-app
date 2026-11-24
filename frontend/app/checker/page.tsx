'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatBnDigits, formatDate } from '@/lib/utils';
import {
  Search,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function CheckerPage() {
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState<'single' | 'bulk'>('single');
  const [singleNumber, setSingleNumber] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('ALL');
  const [selectedDrawId, setSelectedDrawId] = useState('all');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState<{
    wins: Array<{
      bondNumber: string;
      series: string;
      prizeCategory: string;
      prizeAmount: number;
      estimatedTax: number;
      estimatedNet: number;
      drawId: string;
      drawNumber: string;
      drawDate: string;
      description: string;
    }>;
    checkedNumbers: string[];
    totalChecked: number;
    totalWins: number;
    totalGross: number;
    totalTax: number;
    totalNet: number;
  } | null>(null);

  // Fetch verified published draws for the dropdown
  const { data: drawsData } = useQuery({
    queryKey: ['draws-list-checker'],
    queryFn: () => api.draws.list({ limit: 50 })
  });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let rawNumbers: string[] = [];
    if (inputMode === 'single') {
      const cleaned = singleNumber.trim().replace(/\D/g, '');
      if (!cleaned) {
        setErrorMsg('Please enter a valid 7-digit bond number.');
        return;
      }
      rawNumbers = [cleaned];
    } else {
      rawNumbers = bulkText
        .split(/[\n,; ]+/)
        .map((s) => s.trim().replace(/\D/g, ''))
        .filter((s) => s.length > 0);

      if (rawNumbers.length === 0) {
        setErrorMsg('Please enter at least one bond number in the box.');
        return;
      }
    }

    try {
      setIsChecking(true);
      const res = await api.matching.checkInstant({
        numbers: rawNumbers,
        series: selectedSeries === 'ALL' ? undefined : selectedSeries,
        drawId: selectedDrawId === 'all' ? undefined : selectedDrawId
      });
      setResults(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to check prize bond numbers');
    } finally {
      setIsChecking(false);
    }
  };

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

  const winningNumberSet = new Set((results?.wins || []).map((w) => w.bondNumber));
  const nonWinningNumbers = (results?.checkedNumbers || []).filter((n) => !winningNumberSet.has(n));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Bangladesh Bank 100 Taka Bond Checker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Instant Prize Bond Checker
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Check any 7-digit bond number against official Bangladesh Bank draw results instantly. No registration required for quick checks.
        </p>
      </div>

      {/* Main Checker Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Input Mode Selector */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setInputMode('single')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              inputMode === 'single'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Single Bond Check
          </button>
          <button
            type="button"
            onClick={() => setInputMode('bulk')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              inputMode === 'bulk'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Bulk Check (Multiple Bonds)
          </button>
        </div>

        <form onSubmit={handleCheck} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Draw Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Select Draw
              </label>
              <select
                value={selectedDrawId}
                onChange={(e) => setSelectedDrawId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Available Verified Draws</option>
                {drawsData?.draws?.map((d) => (
                  <option key={d._id} value={d._id}>
                    Draw #{d.drawNumber} ({formatDate(d.drawDate)})
                  </option>
                ))}
              </select>
            </div>

            {/* Series Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Bond Series (Optional)
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Series (Default)</option>
                <option value="KA">ক / KA</option>
                <option value="KHA">খ / KHA</option>
                <option value="GA">গ / GA</option>
                <option value="GHA">ঘ / GHA</option>
                <option value="UMO">ঙ / UMO</option>
                <option value="CA">চ / CA</option>
                <option value="CHA">ছ / CHA</option>
                <option value="JA">জ / JA</option>
                <option value="JHA">ঝ / JHA</option>
                <option value="TA">ট / TA</option>
                <option value="THA">ঠ / THA</option>
                <option value="DA">ড / DA</option>
                <option value="DHA">ঢ / DHA</option>
              </select>
            </div>

            {/* Single Input Field if Single Mode */}
            {inputMode === 'single' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  7-Digit Bond Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={7}
                    placeholder="e.g. 0123456"
                    value={singleNumber}
                    onChange={(e) => setSingleNumber(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm font-mono tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* Bulk Textarea if Bulk Mode */}
          {inputMode === 'bulk' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Enter Bond Numbers (Separated by comma, space or new line)
              </label>
              <textarea
                rows={5}
                placeholder="0123456&#10;0892211&#10;0456789"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-4 text-sm font-mono tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can paste multiple 7-digit numbers directly from Excel, CSV or text files.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Under Section 55 of Bangladesh Income Tax Ordinance, 20% source tax is deducted from all prize winnings.
            </p>
            <button
              type="submit"
              disabled={isChecking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg shadow-emerald-900/20 transition-all text-sm"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Checking Draws...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Winnings Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Summary Banner */}
          <div
            className={`border rounded-2xl p-6 ${
              results.totalWins > 0
                ? 'bg-gradient-to-br from-emerald-950/40 via-card to-card border-emerald-500/30'
                : 'bg-card border-border'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {results.totalWins > 0 ? (
                    <Trophy className="w-6 h-6 text-amber-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-muted-foreground" />
                  )}
                  <h2 className="text-xl font-bold text-foreground">
                    {results.totalWins > 0
                      ? `Congratulations! ${results.totalWins} Winning Bond${results.totalWins > 1 ? 's' : ''} Found!`
                      : 'No Winning Bonds in Checked Draws'}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Checked {results.totalChecked} number{results.totalChecked > 1 ? 's' : ''} across official draw records.
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
                <div className="bg-background/80 border border-border/80 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">Gross Prize</div>
                  <div className="text-base sm:text-lg font-bold text-foreground">
                    {formatCurrency(results.totalGross)}
                  </div>
                </div>
                <div className="bg-background/80 border border-border/80 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">Est. 20% Tax</div>
                  <div className="text-base sm:text-lg font-bold text-rose-400">
                    - {formatCurrency(results.totalTax)}
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <div className="text-xs text-emerald-400 font-medium">Net Receivable</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400">
                    {formatCurrency(results.totalNet)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winning Cards */}
          {results.wins.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Winning Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.wins.map((win, idx) => (
                  <div
                    key={`${win.bondNumber}-${win.drawId}-${idx}`}
                    className="bg-card border border-emerald-500/20 rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Bond Number</div>
                        <div className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                          {win.bondNumber}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Series: <span className="text-foreground font-semibold">{win.series}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getPrizeBadgeClass(
                          win.prizeCategory
                        )}`}
                      >
                        {win.prizeCategory} Prize
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/60 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Gross</span>
                        <span className="font-semibold text-foreground">{formatCurrency(win.prizeAmount)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">20% Tax</span>
                        <span className="font-semibold text-rose-400">-{formatCurrency(win.estimatedTax)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Net Win</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(win.estimatedNet)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Draw #{win.drawNumber} ({formatDate(win.drawDate)})
                      </span>
                      <Link
                        href={`/draws/${win.drawId}`}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        View Draw <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-winning list */}
          {nonWinningNumbers.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-zinc-500" />
                <span>Non-winning Numbers in Checked Draws ({nonWinningNumbers.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-background/50 rounded-xl border border-border/50">
                {nonWinningNumbers.map((num) => (
                  <span
                    key={num}
                    className="px-2.5 py-1 bg-muted/60 text-muted-foreground rounded-lg font-mono text-xs"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                Prize bonds do not expire as long as the series remains in circulation. They will be eligible for future quarterly draws!
              </p>
            </div>
          )}

          {/* Action CTA */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-card to-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-lg font-bold text-foreground">
              Tired of checking manually after every draw?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Save all your prize bonds in your profile once. Our automated matching engine scans every new draw within minutes of release and notifies you automatically via email and dashboard!
            </p>
            <div className="pt-2">
              {user ? (
                <Link
                  href="/bonds"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  <span>Go to My Prize Bonds</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  <span>Create Free Account & Save Bonds</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rules & Eligibility Reminder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>60-Day Purchase Eligibility Rule</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            According to Bangladesh Bank regulations, a prize bond must be purchased at least 60 calendar days before the draw date to be eligible for prizes in that draw.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>2-Year Claim Deadline</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Prize bond winnings must be claimed from Bangladesh Bank or designated commercial bank branches within exactly 2 years (730 days) from the official draw date.
          </p>
        </div>
      </div>
    </div>
  );
}
