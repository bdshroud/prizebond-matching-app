import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  BellRing,
  Coins,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  FileSpreadsheet,
  Lock
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-blue-950/20 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>বাংলাদেশ ১০০ টাকা প্রাইজবন্ড ট্র্যাকিং ও রেজাল্ট অ্যালার্ট</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            আপনার প্রাইজবন্ড কি পুরস্কার জিতেছে? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              স্বয়ংক্রিয় অ্যালার্টে জানুন নিমিষেই
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            কাগজের ড্র শিট মিলিয়ে ঘণ্টার পর ঘণ্টা খোঁজার দিন শেষ। আপনার সব প্রাইজবন্ড নম্বর একবার সংরক্ষণ করুন, ড্র অনুষ্ঠানের সাথে সাথে স্বয়ংক্রিয়ভাবে ফলাফল মিলিয়ে ইমেইল ও নোটিফিকেশন পান।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all"
            >
              <span>বিনা খরচে অ্যাকাউন্ট খুলুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/checker"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>লগইন ছাড়াই নম্বর যাচাই করুন</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>১০০% নির্ভুল বাংলাদেশ ব্যাংক রেজাল্ট</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>অসীম সংখ্যক বন্ড সংরক্ষণ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>তাৎক্ষণিক ইমেইল নোটিফিকেশন</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Structure Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            অফিশিয়াল পুরস্কারের কাঠামো (প্রতি ড্র ও প্রতি সিরিজ)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী প্রতিটি ত্রৈমাসিক ড্র-তে ৪৬টি আকর্ষণীয় নগদ পুরস্কার
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-300 dark:border-amber-800/60 text-center space-y-2">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">১ম পুরস্কার (১টি)</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">৳৬,০০,০০০</div>
            <p className="text-[11px] text-slate-500">ছয় লক্ষ টাকা</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-300 dark:border-blue-800/60 text-center space-y-2">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">২য় পুরস্কার (১টি)</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">৳৩,২৫,০০০</div>
            <p className="text-[11px] text-slate-500">তিন লক্ষ পঁচিশ হাজার</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-300 dark:border-indigo-800/60 text-center space-y-2">
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">৩য় পুরস্কার (২টি)</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">৳১,০০,০০০</div>
            <p className="text-[11px] text-slate-500">এক লক্ষ টাকা (প্রতিটি)</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-300 dark:border-emerald-800/60 text-center space-y-2">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">৪র্থ পুরস্কার (২টি)</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">৳৫০,০০০</div>
            <p className="text-[11px] text-slate-500">পঞ্চাশ হাজার (প্রতিটি)</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-600/5 border border-slate-300 dark:border-slate-800/60 text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">৫ম পুরস্কার (৪০টি)</span>
            <div className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono">৳১০,০০০</div>
            <p className="text-[11px] text-slate-500">দশ হাজার (প্রতিটি)</p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">সহজ ও আনলিমিটেড বন্ড ম্যানেজমেন্ট</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              একটি একটি করে অথবা শত শত বন্ডের তালিকা এক ক্লিকে টেক্সট পেস্ট বা CSV ফাইল আপলোডের মাধ্যমে সংরক্ষণ করুন। লিডিং জিরো (যেমন ০৫৬২৯৪৭) ১০০% অক্ষুণ্ণ থাকে।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">স্বয়ংক্রিয় ড্র ম্যাচিং ও ইমেইল অ্যালার্ট</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              নতুন ড্র ঘোষণা হওয়ার সাথে সাথে ব্যাকগ্রাউন্ড ইঞ্জিন স্বয়ংক্রিয়ভাবে আপনার বন্ড মিলিয়ে বিজয়ী হলে সরাসরি ইমেইল ও নোটিফিকেশন পাঠাবে।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">নিখুঁত উৎস কর ও নিট টাকার হিসাব</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              বাংলাদেশ জাতীয় রাজস্ব বোর্ডের নিয়ম অনুযায়ী প্রাইজবন্ডের অর্থের ওপর ২০% সরকারি উৎস কর এবং কর কর্তনের পর নিট প্রদেয় টাকার নির্ভুল হিসাব পান।
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-center text-white space-y-5 shadow-xl shadow-blue-500/20">
          <h2 className="text-2xl sm:text-3xl font-black">
            আপনার প্রাইজবন্ড সুরক্ষিত রাখুন এবং বিজয়ী সুযোগ হাতছাড়া করবেন না
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            ড্র অনুষ্ঠানের পর ২ বছর পর্যন্ত পুরস্কার দাবি করার সুযোগ থাকে। আপনার পুরনো প্রাইজবন্ডগুলো এখনই সংরক্ষণ করে চেক করে নিন।
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-sm hover:bg-blue-50 shadow-md transition-all cursor-pointer"
            >
              <span>আজই বিনামূল্যে শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
