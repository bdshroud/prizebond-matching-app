'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { IDraw } from '../../types';
import { formatDate, formatBnDigits } from '../../lib/utils';
import { CalendarCheck, Search, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function DrawsPage() {
  const [draws, setDraws] = useState<IDraw[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');

  const fetchDraws = async () => {
    setLoading(true);
    try {
      const res = await api.draws.list({
        search,
        year: year ? parseInt(year, 10) : undefined
      });
      setDraws(res.draws);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, [search, year]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-emerald-600" />
          <span>অফিশিয়াল প্রাইজবন্ড ড্র ফলাফল গেজেট</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          বাংলাদেশ ব্যাংক ও অভ্যন্তরীণ সম্পদ বিভাগ কর্তৃক আয়োজিত ত্রৈমাসিক ড্র-এর সম্পূর্ণ তালিকা
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ড্র নম্বর বা বর্ণনা দিয়ে খুঁজুন (যেমন: 118)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-36"
        >
          <option value="">সকল বছর</option>
          <option value="2025">২০২৫</option>
          <option value="2024">২০২৪</option>
          <option value="2023">২০২৩</option>
        </select>
      </div>

      {/* Draws List Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <span className="text-xs font-semibold">ড্র ডেটা লোড হচ্ছে...</span>
        </div>
      ) : draws.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {draws.map((draw) => (
            <Link
              key={draw._id}
              href={`/draws/${draw._id}`}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-xs">
                    {draw.drawNumber}তম ড্র
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>যাচাইকৃত</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {draw.description || `${draw.drawNumber}তম বাংলাদেশ প্রাইজবন্ড ড্র`}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  তারিখ: {formatDate(draw.drawDate)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>প্রতি সিরিজে ৪৬টি পুরস্কার</span>
                <span className="inline-flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>ফলাফল দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          কোনো ড্র ফলাফল পাওয়া যায়নি
        </div>
      )}
    </div>
  );
}
