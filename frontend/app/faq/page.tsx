'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileQuestion
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: 'general' | 'draws' | 'tax' | 'app';
}

const faqs: FAQItem[] = [
  {
    category: 'general',
    q: 'What is a Bangladesh Prize Bond?',
    a: 'A Bangladesh Prize Bond is a non-interest-bearing lottery bond issued by the Ministry of Finance, Government of Bangladesh, and managed by Bangladesh Bank. Priced at Tk 100 each, they are backed by the government and can be encashed for their full face value at any time.'
  },
  {
    category: 'general',
    q: 'Do prize bonds expire if they do not win in a draw?',
    a: 'No! Unlike traditional lottery tickets, Bangladesh 100 Taka Prize Bonds never expire as long as their series remains in active circulation. A single bond remains eligible for every quarterly draw year after year until you choose to redeem its Tk 100 face value.'
  },
  {
    category: 'draws',
    q: 'When are official prize bond draws conducted?',
    a: 'Draws take place four times a year on the scheduled dates: January 31, April 30, July 31, and October 31. If any draw date falls on a weekend or public holiday, the draw is held on the immediate next working day.'
  },
  {
    category: 'draws',
    q: 'What is the 60-day purchase holding rule?',
    a: 'According to Bangladesh Bank regulations, a prize bond must be purchased at least 60 calendar days before a draw date to be eligible for prizes in that draw. If you buy a bond within 60 days of an upcoming draw, it will not be eligible for that immediate draw, but will automatically qualify for the next quarterly draw.'
  },
  {
    category: 'draws',
    q: 'How many prizes are awarded in each draw?',
    a: 'Each draw awards 46 prizes per active series: First Prize: 1 winner of Tk 600,000; Second Prize: 1 winner of Tk 325,000; Third Prize: 2 winners of Tk 100,000; Fourth Prize: 2 winners of Tk 50,000; Fifth Prize: 40 winners of Tk 10,000.'
  },
  {
    category: 'draws',
    q: 'How does the "Series" system work?',
    a: 'Bangladesh Prize Bonds are issued across serial prefixes (e.g., KA, KHA, GA, GHA, etc.). Whenever a 7-digit winning number is declared by Bangladesh Bank, every single active series carrying that number wins the prize! For example, if there are 60 active series, a first prize number awards Tk 600,000 to 60 different holders.'
  },
  {
    category: 'tax',
    q: 'What is the tax rate on prize bond winnings?',
    a: 'Under Section 55 of the Bangladesh Income Tax Ordinance 1984 (and Income Tax Act 2023), a mandatory 20% source tax (AIT) is deducted from all prize bond winnings before disbursement. You will receive an official tax deduction certificate for tax filing purposes.'
  },
  {
    category: 'tax',
    q: 'What is the deadline to claim a winning prize bond?',
    a: 'You must claim your prize within exactly 2 years (730 days) from the official draw date. After 2 years, unclaimed prize money permanently reverts to the Government Treasury.'
  },
  {
    category: 'app',
    q: 'Can I save unlimited prize bond numbers in my account?',
    a: 'Yes! Our platform supports saving unlimited bond numbers in your profile. You can add them one by one, enter bulk lists, or import hundreds of bonds instantly via CSV.'
  },
  {
    category: 'app',
    q: 'How does the automatic winner notification work?',
    a: 'Whenever Bangladesh Bank releases an official draw, our automated matching engine compares all your saved bonds against the verified winning numbers. If any of your bonds win, you immediately receive an in-app notification and an email detailing your gross prize, 20% source tax, and net receivable amount.'
  },
  {
    category: 'app',
    q: 'Are my prize bond numbers private and secure?',
    a: 'Absolutely. Your saved prize bonds are indexed strictly to your private user account with MongoDB security and JWT authentication. No other user or third party can access or see your bond holdings.'
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & FAQs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Everything you need to know about Bangladesh 100 Taka Prize Bonds, draw schedules, 60-day eligibility, and automated monitoring.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search questions or keywords (e.g. tax, series, deadline, 60 days)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-2 text-sm">
        {[
          { key: 'all', label: 'All Questions' },
          { key: 'general', label: 'General & Basics' },
          { key: 'draws', label: 'Draws & Eligibility' },
          { key: 'tax', label: 'Tax & Claims' },
          { key: 'app', label: 'Platform & Alerts' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`pb-2 px-3.5 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeCategory === tab.key
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl space-y-2">
            <FileQuestion className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-foreground">No questions found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your search terms or view all categories.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground text-sm sm:text-base hover:bg-muted/20 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Contact Prompt */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3 shadow-sm">
        <h3 className="text-base font-bold text-foreground">Still have questions?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Need help with your account or have questions about Bangladesh Bank prize bond encashment? Our support team is here to assist.
        </p>
        <div className="pt-1">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
