'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { IDashboardStats } from '../../types';
import { formatCurrency, formatBnDigits, formatDate } from '../../lib/utils';
import {
  Trophy,
  Coins,
  CalendarCheck,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      api.dashboard
        .getStats()
        .then((data) => setStats(data))
        .catch((err) => setError(err.message || 'Failed to load dashboard data'))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold">ড্যাশবোর্ড ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'মোট সংরক্ষিত বন্ড',
      value: formatBnDigits(stats?.statistics.totalBonds || 0),
      subtext: `${formatBnDigits(stats?.statistics.activeBonds || 0)}টি সক্রিয়`,
      icon: Coins,
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/60 dark:border-blue-900/40'
    },
    {
      title: 'মোট ড্র যাচাইকৃত',
      value: formatBnDigits(stats?.statistics.totalCheckedDraws || 0),
      subtext: 'বাংলাদেশ ব্যাংক গেজেট',
      icon: CalendarCheck,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/60 dark:border-emerald-900/40'
    },
    {
      title: 'পুরস্কার বিজয়ী বন্ড',
      value: formatBnDigits(stats?.statistics.totalWinningBonds || 0),
      subtext: 'টি বিজয়ী ম্যাচ',
      icon: Trophy,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/60 dark:border-amber-900/40'
    },
    {
      title: 'মোট অর্জিত পুরস্কার',
      value: formatCurrency(stats?.statistics.totalEstimatedPrizeMoney || 0),
      subtext: `নিট প্রদেয়: ${formatCurrency(stats?.statistics.totalEstimatedNetMoney || 0)}`,
      icon: TrendingUp,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200/60 dark:border-indigo-900/40'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            স্বাগতম, {user?.name}! 🇧🇩
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            আপনার প্রাইজবন্ড পোর্টফোলিও ও সর্বশেষ বাংলাদেশ ব্যাংক ড্র স্ট্যাটাস পর্যবেক্ষণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/bonds"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>নতুন বন্ড যোগ করুন</span>
          </Link>
          <Link
            href="/checker"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>যাচাই ইঞ্জিন</span>
          </Link>
        </div>
      </div>

      {/* Next Scheduled Draw Announcement Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
              পরবর্তী বাংলাদেশ ব্যাংক ড্র
            </span>
            <div className="text-base sm:text-lg font-bold">
              তারিখ: {formatDate(stats?.nextScheduledDrawDate || '')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ড্র শেষে স্বয়ংক্রিয়ভাবে নোটিফিকেশন পৌঁছে যাবে</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} shadow-xs flex items-center justify-between`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{card.title}</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{card.value}</div>
                <p className="text-[11px] font-medium text-slate-400">{card.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.text} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Winning Matches & Recent Draws */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Recent Winning Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>সাম্প্রতিক বিজয়ী পুরস্কার ম্যাচসমূহ</span>
              </h2>
              <Link href="/history" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                <span>সব দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats?.recentWins && stats.recentWins.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentWins.map((win) => (
                  <div key={win._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        🏆
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            #{win.bondNumber}
                          </span>
                          {win.series && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold">
                              {win.series}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {win.prizeTitleBn} • {win.drawNumber}তম ড্র ({formatDate(win.drawDate)})
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(win.grossAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        নিট: {formatCurrency(win.netAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">এখনো কোনো পুরস্কার ম্যাচ পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  আপনার নতুন বন্ডগুলো যোগ করুন। ড্র ফলাফল প্রকাশিত হলে ইঞ্জিন স্বয়ংক্রিয়ভাবে মিলিয়ে আপনাকে জানাবে।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Notifications & Recent Draws */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>নোটিফিকেশনসমূহ</span>
              </h2>
              <Link href="/notifications" className="text-[11px] font-semibold text-blue-600 hover:underline">
                সকল নোটিফিকেশন
              </Link>
            </div>

            {stats?.recentNotifications && stats.recentNotifications.length > 0 ? (
              <div className="space-y-2.5">
                {stats.recentNotifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                      notif.isRead
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-900/60 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">কোনো নতুন নোটিফিকেশন নেই</p>
            )}
          </div>

          {/* Recent Official Draws Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>সাম্প্রতিক ড্র গেজেট</span>
              </h2>
              <Link href="/draws" className="text-[11px] font-semibold text-blue-600 hover:underline">
                সকল ড্র
              </Link>
            </div>

            <div className="space-y-2">
              {stats?.recentDraws && stats.recentDraws.length > 0 ? (
                stats.recentDraws.map((d) => (
                  <Link
                    key={d._id}
                    href={`/draws/${d._id}`}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between transition-colors block"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {d.drawNumber}তম বাংলাদেশ ড্র
                      </div>
                      <div className="text-[10px] text-slate-500">{formatDate(d.drawDate)}</div>
                    </div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      ৪৬টি পুরস্কার
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">কোনো ড্র রেকর্ড পাওয়া যায়নি</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
