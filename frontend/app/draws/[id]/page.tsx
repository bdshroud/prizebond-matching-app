'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../services/api';
import { IDraw, IWinningNumber } from '../../../types';
import { formatDate, formatCurrency } from '../../../lib/utils';
import {
  CalendarCheck,
  Trophy,
  ArrowLeft,
  ShieldCheck,
  Building2,
  FileText,
  Loader2
} from 'lucide-react';

export default function DrawDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [draw, setDraw] = useState<IDraw | null>(null);
  const [winningNumbers, setWinningNumbers] = useState<IWinningNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.draws
        .getById(id)
        .then((res) => {
          setDraw(res.draw);
          setWinningNumbers(res.winningNumbers);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
        <span className="text-xs font-semibold">ড্র ফলাফল লোড হচ্ছে...</span>
      </div>
    );
  }

  if (!draw) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-500">ড্র ফলাফল পাওয়া যায়নি</p>
        <Link href="/draws" className="text-xs font-bold text-blue-600 hover:underline">
          ← ড্র তালিকায় ফিরে যান
        </Link>
      </div>
    );
  }

  const grouped = {
    first: winningNumbers.filter((w) => w.prizeCategory === 'first'),
    second: winningNumbers.filter((w) => w.prizeCategory === 'second'),
    third: winningNumbers.filter((w) => w.prizeCategory === 'third'),
    fourth: winningNumbers.filter((w) => w.prizeCategory === 'fourth'),
    fifth: winningNumbers.filter((w) => w.prizeCategory === 'fifth')
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          href="/draws"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল ড্র তালিকায় ফিরে যান</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-600" />
              <span>{draw.drawNumber}তম বাংলাদেশ প্রাইজবন্ড ড্র ফলাফল</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ড্র অনুষ্ঠানের তারিখ: {formatDate(draw.drawDate)} • সূত্র: {draw.officialSource}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>বাংলাদেশ ব্যাংক গেজেট যাচাইকৃত</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1st Prize */}
      {grouped.first.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-amber-900 dark:text-amber-300">
                ১ম পুরস্কার — ৳৬,০০,০০০ (ছয় লক্ষ টাকা)
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">১টি বিজয়ী</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {grouped.first.map((w) => (
              <span
                key={w._id}
                className="px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xl font-mono font-black text-amber-600 dark:text-amber-400 shadow-sm"
              >
                {w.bondNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2nd Prize */}
      {grouped.second.length > 0 && (
        <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-blue-900 dark:text-blue-300">
              ২য় পুরস্কার — ৳৩,২৫,০০০ (তিন লক্ষ পঁচিশ হাজার টাকা)
            </h3>
            <span className="text-xs font-semibold text-slate-500">১টি বিজয়ী</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {grouped.second.map((w) => (
              <span
                key={w._id}
                className="px-5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-lg font-mono font-black text-blue-600 dark:text-blue-400 shadow-sm"
              >
                {w.bondNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3rd Prize */}
      {grouped.third.length > 0 && (
        <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-indigo-900 dark:text-indigo-300">
              ৩য় পুরস্কার — ৳১,০০,০০০ (এক লক্ষ টাকা প্রতিটি)
            </h3>
            <span className="text-xs font-semibold text-slate-500">২টি বিজয়ী</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {grouped.third.map((w) => (
              <span
                key={w._id}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 shadow-sm"
              >
                {w.bondNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4th Prize */}
      {grouped.fourth.length > 0 && (
        <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
              ৪র্থ পুরস্কার — ৳৫০,০০০ (পঞ্চাশ হাজার টাকা প্রতিটি)
            </h3>
            <span className="text-xs font-semibold text-slate-500">২টি বিজয়ী</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {grouped.fourth.map((w) => (
              <span
                key={w._id}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 shadow-sm"
              >
                {w.bondNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5th Prize */}
      {grouped.fifth.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              ৫ম পুরস্কার — ৳১০,০০০ (দশ হাজার টাকা প্রতিটি)
            </h3>
            <span className="text-xs font-semibold text-slate-500">৪০টি বিজয়ী</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
            {grouped.fifth.map((w) => (
              <div
                key={w._id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center font-mono font-bold text-xs text-slate-800 dark:text-slate-200"
              >
                {w.bondNumber}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
