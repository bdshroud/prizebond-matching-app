<template>
  <div class="p-8 space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
        <Settings class="w-7 h-7 text-slate-700 dark:text-slate-300" />
        {{ appStore.t('settings.title') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {{ appStore.t('settings.subtitle') }}
      </p>
    </div>

    <!-- Appearance Settings -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Palette class="w-5 h-5 text-blue-500" />
        {{ appStore.t('settings.theme') }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          @click="appStore.setTheme('light')"
          class="p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer"
          :class="appStore.theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'"
        >
          <Sun class="w-5 h-5 text-amber-500" />
          <span>{{ appStore.t('settings.light') }}</span>
        </button>

        <button
          @click="appStore.setTheme('dark')"
          class="p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer"
          :class="appStore.theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'"
        >
          <Moon class="w-5 h-5 text-indigo-400" />
          <span>{{ appStore.t('settings.dark') }}</span>
        </button>

        <button
          @click="appStore.setTheme('system')"
          class="p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer"
          :class="appStore.theme === 'system' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'"
        >
          <Laptop class="w-5 h-5 text-slate-500" />
          <span>{{ appStore.t('settings.system') }}</span>
        </button>
      </div>
    </div>

    <!-- Language Settings -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Languages class="w-5 h-5 text-blue-500" />
        {{ appStore.t('settings.language') }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          @click="appStore.setLanguage('bn')"
          class="p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer"
          :class="appStore.lang === 'bn' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">🇧🇩</span>
            <span>বাংলা (ডিফল্ট)</span>
          </div>
          <Check v-if="appStore.lang === 'bn'" class="w-4 h-4 text-blue-600" />
        </button>

        <button
          @click="appStore.setLanguage('en')"
          class="p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer"
          :class="appStore.lang === 'en' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">🌐</span>
            <span>English</span>
          </div>
          <Check v-if="appStore.lang === 'en'" class="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>

    <!-- Storage & Environment Info -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <HardDrive class="w-5 h-5 text-emerald-500" />
        {{ appStore.t('settings.storageLocation') }}
      </h3>

      <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 break-all select-all">
        {{ appStore.userDataPath || 'Electron app.getPath(\'userData\')/prizebond.db' }}
      </div>

      <div class="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <ShieldCheck class="w-4 h-4" />
        <span>{{ appStore.t('settings.privacyNote') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app';
import {
  Settings,
  Palette,
  Sun,
  Moon,
  Laptop,
  Languages,
  Check,
  HardDrive,
  ShieldCheck
} from 'lucide-vue-next';

const appStore = useAppStore();
</script>
