<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Header Greeting & Quick Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ appStore.t('dashboard.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ appStore.t('dashboard.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-white shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{{ appStore.t('dashboard.quickAddBond') }}</span>
        </button>

        <router-link
          to="/checker"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Trophy class="w-4 h-4 text-amber-300" />
          <span>{{ appStore.t('dashboard.checkWinners') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Bonds -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ appStore.t('dashboard.totalBonds') }}
          </p>
          <p class="text-3xl font-black text-slate-900 dark:text-white">
            {{ appStore.formatNumber(stats.totalBonds) }}
          </p>
          <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
            মূল্য: {{ appStore.formatAmount(stats.totalBonds * 100) }}
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Coins class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Draws -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ appStore.t('dashboard.totalDraws') }}
          </p>
          <p class="text-3xl font-black text-slate-900 dark:text-white">
            {{ appStore.formatNumber(stats.totalDraws) }}
          </p>
          <p class="text-xs text-slate-400 font-medium">
            অফিশিয়াল ড্র ডেটাবেজ
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <CalendarCheck class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Winning Matches -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ appStore.t('dashboard.totalWins') }}
          </p>
          <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {{ appStore.formatNumber(stats.totalMatches) }}
          </p>
          <p class="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            {{ appStore.formatAmount(stats.totalWinningAmount) }} অর্জিত
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Trophy class="w-6 h-6" />
        </div>
      </div>

      <!-- Last Checked Date -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ appStore.t('dashboard.lastChecked') }}
          </p>
          <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            {{ stats.lastCheckedDate ? stats.lastCheckedDate.substring(0, 16) : appStore.t('dashboard.neverChecked') }}
          </p>
          <p class="text-xs text-slate-400 font-medium">
            অফলাইন ইঞ্জিন প্রস্তুত
          </p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Clock class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Main 2-Column Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Latest Draw Information (Left 1 col) -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-blue-500" />
              {{ appStore.t('dashboard.latestDrawInfo') }}
            </h3>
            <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              ১০০ টাকা
            </span>
          </div>

          <div v-if="stats.latestDraw" class="mt-5 space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60 text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ appStore.t('dashboard.drawNo') }}</span>
              <span class="font-bold text-slate-900 dark:text-white font-mono text-base">{{ stats.latestDraw.draw_number }}তম ড্র</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60 text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ appStore.t('dashboard.drawDate') }}</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ stats.latestDraw.draw_date }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60 text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ appStore.t('dashboard.firstPrize') }}</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">৳৬,০০,০০০ (৬ লাখ)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
              {{ stats.latestDraw.description || 'বাংলাদেশ ব্যাংক অফিশিয়াল ড্র' }}
            </div>
          </div>

          <div v-else class="mt-8 text-center py-6 text-slate-400 text-sm">
            কোনো ড্র ফলাফল সংরক্ষিত নেই।
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <router-link
            to="/draws"
            class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
          >
            <span>{{ appStore.t('dashboard.viewAllDraws') }}</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Recent Matching History (Right 2 cols) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy class="w-5 h-5 text-amber-500" />
              {{ appStore.t('dashboard.recentMatches') }}
            </h3>
            <router-link
              to="/history"
              class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              সবগুলো দেখুন
            </router-link>
          </div>

          <!-- Matching List -->
          <div v-if="stats.recentMatches && stats.recentMatches.length > 0" class="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="item in stats.recentMatches"
              :key="item.id"
              class="py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Trophy class="w-4 h-4" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {{ item.matched_bond_number }}
                    </span>
                    <span v-if="item.series" class="px-1.5 py-0.5 text-[11px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {{ item.series }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400">
                    {{ item.draw_number }}তম ড্র ({{ item.draw_date }}) • {{ item.prize_title_bn }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  +{{ appStore.formatAmount(item.prize_amount) }}
                </p>
                <p class="text-[11px] text-slate-400">
                  {{ item.checked_at ? item.checked_at.substring(0, 10) : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 space-y-3">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Trophy class="w-6 h-6" />
            </div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ appStore.t('dashboard.noRecentMatches') }}
            </p>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">
              আপনার সংরক্ষিত বন্ডগুলো ড্র-এর সাথে যাচাই করতে 'বিজয়ীদের যাচাই করুন' বাটনে ক্লিক করুন।
            </p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span class="flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-emerald-500" />
            {{ appStore.t('dashboard.backupStatus') }}: <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ appStore.t('dashboard.backupHealthy') }}</span>
          </span>
          <router-link to="/bonds" class="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            {{ appStore.t('dashboard.viewAllBonds') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Add Bond Modal -->
    <AddBondModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @saved="refreshStats"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import AddBondModal from '../components/AddBondModal.vue';
import {
  Coins,
  CalendarCheck,
  Trophy,
  Clock,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-vue-next';

const appStore = useAppStore();
const isAddModalOpen = ref(false);

const stats = ref({
  totalBonds: 0,
  totalDraws: 0,
  totalMatches: 0,
  totalWinningAmount: 0,
  lastCheckedDate: '',
  latestDraw: null,
  recentMatches: []
});

async function refreshStats() {
  if (window.electronAPI) {
    try {
      const res = await window.electronAPI.getDashboardStats();
      if (res) {
        stats.value = res;
      }
    } catch (e) {
      console.error('Failed to get dashboard stats:', e);
    }
  }
}

function openAddModal() {
  isAddModalOpen.value = true;
}

onMounted(() => {
  refreshStats();
});
</script>
