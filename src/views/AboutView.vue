<template>
  <div class="p-8 space-y-8 max-w-4xl mx-auto">
    <!-- Hero Brand -->
    <div class="p-8 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 text-white shadow-xl shadow-blue-500/20 text-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-amber-300 shadow-inner">
        <Sparkles class="w-9 h-9" />
      </div>

      <div class="space-y-1">
        <h1 class="text-3xl font-black tracking-tight">
          {{ appStore.t('appName') }}
        </h1>
        <p class="text-blue-100 text-sm font-medium">
          {{ appStore.t('tagline') }}
        </p>
      </div>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
        <span>v{{ appStore.appVersion }} • Windows Desktop</span>
      </div>
    </div>

    <!-- Description & Mission -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Heart class="w-5 h-5 text-rose-500" />
        উন্মুক্ত ও ফ্রি প্রযুক্তি (100% Free & Open Source)
      </h3>
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {{ appStore.t('about.description') }} এই সফটওয়্যারটি কোনো বাণিজ্যিক উদ্দেশ্যে তৈরি নয়। এটি সম্পূর্ণ বিনামূল্যে ব্যবহার করা যাবে এবং কোনো প্রকার বিজ্ঞাপন, সাবস্ক্রিপশন ফি বা লুকানো খরচ নেই।
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{{ appStore.t('about.f1') }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{{ appStore.t('about.f2') }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{{ appStore.t('about.f3') }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{{ appStore.t('about.f4') }}</span>
        </div>
      </div>
    </div>

    <!-- License & Technology -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <span class="font-bold text-slate-800 dark:text-slate-200">লাইসেন্স (License)</span>
        <span class="font-mono font-semibold text-blue-600 dark:text-blue-400">MIT Open Source</span>
      </div>
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <span class="font-bold text-slate-800 dark:text-slate-200">প্রযুক্তি স্ট্যাক</span>
        <span>Electron.js, Vue 3, Vite, Tailwind CSS v4, SQLite, Pinia</span>
      </div>
      <p class="pt-2 text-[11px] leading-relaxed">
        {{ appStore.t('about.license') }} Made with ❤️ for Bangladesh Prize Bond community.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-vue-next';

const appStore = useAppStore();
</script>
