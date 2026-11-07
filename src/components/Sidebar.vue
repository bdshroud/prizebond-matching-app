<template>
  <div>
    <!-- Mobile Drawer Backdrop -->
    <div
      v-if="appStore.isMobileMenuOpen"
      @click="appStore.closeMobileMenu()"
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
    ></div>

    <!-- Sidebar Aside -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-64 shrink-0"
      :class="[
        appStore.isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- App Brand -->
      <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles class="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 class="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              {{ appStore.t('appName') }}
              <span class="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold">100৳</span>
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {{ appStore.t('appShortName') }} • v{{ appStore.appVersion }}
            </p>
          </div>
        </div>

        <!-- Mobile Close Button -->
        <button
          @click="appStore.closeMobileMenu()"
          class="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="appStore.closeMobileMenu()"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group"
          :class="[
            $route.path === item.path
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
          ]"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 transition-transform group-hover:scale-110"
            :class="$route.path === item.path ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'"
          />
          <span>{{ appStore.t(item.label) }}</span>
          
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-0.5 text-xs rounded-full font-semibold"
            :class="item.badgeClass"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Bottom System Status -->
      <div class="p-3 border-t border-slate-200 dark:border-slate-800">
        <div class="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div class="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{{ appStore.t('dashboard.backupHealthy') }}</span>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            {{ appStore.t('settings.privacyNote') }}
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../stores/app';
import {
  LayoutDashboard,
  Coins,
  CalendarCheck,
  Trophy,
  Clock,
  BookOpen,
  BarChart3,
  ArrowUpDown,
  Settings,
  Info,
  Sparkles,
  X
} from 'lucide-vue-next';

const appStore = useAppStore();
const route = useRoute();

const navItems = [
  { path: '/', label: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/bonds', label: 'nav.bonds', icon: Coins },
  { path: '/draws', label: 'nav.draws', icon: CalendarCheck },
  { path: '/checker', label: 'nav.checker', icon: Trophy, badge: 'Smart', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  { path: '/history', label: 'nav.history', icon: Clock },
  { path: '/rules', label: 'nav.rules', icon: BookOpen },
  { path: '/reports', label: 'nav.reports', icon: BarChart3 },
  { path: '/import-export', label: 'nav.importExport', icon: ArrowUpDown },
  { path: '/settings', label: 'nav.settings', icon: Settings },
  { path: '/about', label: 'nav.about', icon: Info }
];
</script>
