<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
        <BookOpen class="w-7 h-7 text-blue-600" />
        {{ appStore.t('rules.title') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {{ appStore.t('rules.subtitle') }}
      </p>
    </div>

    <!-- Official Disclaimer Alert -->
    <div class="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3.5">
      <AlertTriangle class="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div class="space-y-1">
        <h4 class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
          গুরুত্বপূর্ণ আইনি সতর্কতা (Important Disclaimer)
        </h4>
        <p class="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          {{ appStore.t('rules.disclaimer') }}
        </p>
        <p class="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
          সূত্র: বাংলাদেশ ব্যাংক প্রাইজবন্ড ড্র নীতিমালা ও অভ্যন্তরীণ সম্পদ বিভাগ (Internal Resources Division, Ministry of Finance)।
        </p>
      </div>
    </div>

    <!-- Prize Table (100 Taka) -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Trophy class="w-5 h-5 text-amber-500" />
        {{ appStore.t('rules.prizeTable') }}
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
            <tr>
              <th class="py-3 px-4">পুরস্কারের ধাপ</th>
              <th class="py-3 px-4 text-right">পুরস্কারের পরিমাণ (টাকা)</th>
              <th class="py-3 px-4 text-center">বিজয়ী সংখ্যা (প্রতি সিরিজ)</th>
              <th class="py-3 px-4 text-right">মোট অর্থ (প্রতি সিরিজ)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">প্রথম পুরস্কার</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳৬,০০,০০০</td>
              <td class="py-3 px-4 text-center font-semibold">১টি</td>
              <td class="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">৳৬,০০,০০০</td>
            </tr>
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">দ্বিতীয় পুরস্কার</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳৩,২৫,০০০</td>
              <td class="py-3 px-4 text-center font-semibold">১টি</td>
              <td class="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">৳৩,২৫,০০০</td>
            </tr>
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">তৃতীয় পুরস্কার</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳১,০০,০০০</td>
              <td class="py-3 px-4 text-center font-semibold">২টি</td>
              <td class="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">৳২,০০,০০০</td>
            </tr>
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">চতুর্থ পুরস্কার</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳৫০,০০০</td>
              <td class="py-3 px-4 text-center font-semibold">২টি</td>
              <td class="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">৳১,০০,০০০</td>
            </tr>
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">পঞ্চম পুরস্কার</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳১০,০০০</td>
              <td class="py-3 px-4 text-center font-semibold">৪০টি</td>
              <td class="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">৳৪,০০,০০০</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
            <tr>
              <td class="py-3 px-4">সর্বমোট (প্রতি সিরিজ)</td>
              <td class="py-3 px-4 text-right text-emerald-600">—</td>
              <td class="py-3 px-4 text-center">৪৬টি বিজয়ী</td>
              <td class="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">৳১৬,২৫,০০০</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- General Rules & Eligibility -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 text-blue-600" />
        {{ appStore.t('rules.generalRules') }}
      </h3>

      <div class="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Calendar class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{{ appStore.t('rules.ruleA') }}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Clock class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{{ appStore.t('rules.ruleB') }}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Banknote class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{{ appStore.t('rules.ruleC') }}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <CalendarCheck class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{{ appStore.t('rules.ruleD') }}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <ShieldAlert class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{{ appStore.t('rules.ruleE') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app';
import {
  BookOpen,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Banknote,
  CalendarCheck,
  ShieldAlert
} from 'lucide-vue-next';

const appStore = useAppStore();
</script>
