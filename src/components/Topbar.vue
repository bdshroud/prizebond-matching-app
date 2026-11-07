<template>
  <header class="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-10">
    <!-- Left: Hamburger toggle (mobile) + Current context -->
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <button
        @click="appStore.toggleMobileMenu()"
        class="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Toggle navigation"
      >
        <Menu class="w-5 h-5" />
      </button>

      <h2 class="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-tight truncate">
        {{ currentTitle }}
      </h2>
      <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
        🇧🇩 Bangladesh Bank
      </span>
    </div>

    <!-- Right: Quick actions, language & theme -->
    <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
      <!-- Quick Add Bond Button -->
      <button
        @click="$emit('open-add-bond')"
        class="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
      >
        <PlusCircle class="w-4 h-4 shrink-0" />
        <span class="hidden xs:inline sm:inline">{{ appStore.t('dashboard.quickAddBond') }}</span>
      </button>

      <!-- Language Switcher -->
      <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          @click="appStore.setLanguage('bn')"
          class="px-2 py-1 text-xs font-semibold rounded-lg transition-all"
          :class="appStore.lang === 'bn' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
        >
          বাং
        </button>
        <button
          @click="appStore.setLanguage('en')"
          class="px-2 py-1 text-xs font-semibold rounded-lg transition-all"
          :class="appStore.lang === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
        >
          EN
        </button>
      </div>

      <!-- Theme Switcher -->
      <button
        @click="toggleTheme"
        class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
        :title="appStore.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="appStore.theme === 'dark'" class="w-4 h-4 text-amber-400" />
        <Moon v-else class="w-4 h-4 text-slate-600" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../stores/app';
import { PlusCircle, Sun, Moon, Menu } from 'lucide-vue-next';

defineEmits(['open-add-bond']);

const appStore = useAppStore();
const route = useRoute();

const currentTitle = computed(() => {
  const map = {
    dashboard: 'nav.dashboard',
    bonds: 'nav.bonds',
    draws: 'nav.draws',
    checker: 'nav.checker',
    history: 'nav.history',
    rules: 'nav.rules',
    reports: 'nav.reports',
    'import-export': 'nav.importExport',
    settings: 'nav.settings',
    about: 'nav.about'
  };
  const key = map[route.name] || 'appName';
  return appStore.t(key);
});

function toggleTheme() {
  const next = appStore.theme === 'dark' ? 'light' : 'dark';
  appStore.setTheme(next);
}
</script>
