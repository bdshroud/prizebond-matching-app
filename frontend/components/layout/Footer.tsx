import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>প্রাইজবন্ড বাংলাদেশ</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              বাংলাদেশ ১০০ টাকা মূল্যমানের প্রাইজবন্ড ট্র্যাকিং, সংরক্ষণ ও স্বয়ংক্রিয় ড্র ফলাফল যাচাইয়ের সর্বাধুনিক ও নিরাপদ প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>১০০% গোপনীয় ও ব্যক্তিগত সুরক্ষা</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">ইউজার ড্যাশবোর্ড</Link></li>
              <li><Link href="/bonds" className="hover:text-white transition-colors">আমার সংরক্ষিত বন্ড</Link></li>
              <li><Link href="/draws" className="hover:text-white transition-colors">সর্বশেষ ড্র ফলাফল</Link></li>
              <li><Link href="/checker" className="hover:text-white transition-colors">তাত্ক্ষণিক ড্র যাচাই</Link></li>
              <li><Link href="/history" className="hover:text-white transition-colors">পুরস্কার জয়ের ইতিহাস</Link></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">নীতিমালা ও সহায়তা</h4>
            <ul className="space-y-2">
              <li><Link href="/rules" className="hover:text-white transition-colors">বাংলাদেশ ব্যাংক প্রাইজবন্ড রুলস</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">ব্যবহারের শর্তাবলী (Terms)</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">যোগাযোগ ও ফিডব্যাক</Link></li>
            </ul>
          </div>

          {/* Official Disclaimer */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">আইনি তথ্য ও কর বার্তা</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              প্রাইজবন্ডের ড্র ফলাফল বাংলাদেশ ব্যাংকের প্রকাশিত অফিশিয়াল গেজেটের মাধ্যমে সংগৃহীত। আয়কর অধ্যাদেশ অনুসারে পুরস্কারের অর্থের ওপর ২০% হারে উৎসে কর (Source Tax) কর্তনযোগ্য। পুরস্কার দাবির মেয়াদ ড্র অনুষ্ঠানের তারিখ হতে ২ বছর পর্যন্ত।
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Bangladesh Prize Bond Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Bangladeshi Prize Bond Investors
          </p>
        </div>
      </div>
    </footer>
  );
}
