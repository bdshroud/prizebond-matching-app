<template>
  <div class="p-8 space-y-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
        <BarChart3 class="w-7 h-7 text-indigo-500" />
        {{ appStore.t('reports.title') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {{ appStore.t('reports.subtitle') }}
      </p>
    </div>

    <!-- Stat Highlights Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {{ appStore.t('reports.portfolioValue') }}
        </p>
        <p class="text-3xl font-black text-slate-900 dark:text-white">
          {{ appStore.formatAmount(stats.totalBonds * 100) }}
        </p>
        <p class="text-xs text-blue-600 font-medium">
          মোট {{ appStore.formatNumber(stats.totalBonds) }}টি বন্ডের সমমূল্য
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {{ appStore.t('reports.totalWinsValue') }}
        </p>
        <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
          {{ appStore.formatAmount(stats.totalWinningAmount) }}
        </p>
        <p class="text-xs text-emerald-600/80 font-medium">
          মোট {{ appStore.formatNumber(stats.totalMatches) }}টি পুরস্কার জয়
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          নিট লাভ / ক্ষতি
        </p>
        <p
          class="text-3xl font-black"
          :class="netGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'"
        >
          {{ netGain >= 0 ? '+' : '' }}{{ appStore.formatAmount(netGain) }}
        </p>
        <p class="text-xs text-slate-400 font-medium">
          (প্রাইজবন্ডের মূলধন অক্ষুণ্ণ থাকে)
        </p>
      </div>
    </div>

    <!-- Performance Details -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Trophy class="w-5 h-5 text-amber-500" />
        {{ appStore.t('reports.prizeTiersWon') }}
      </h3>

      <div v-if="stats.recentMatches && stats.recentMatches.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <div
          v-for="m in stats.recentMatches"
          :key="m.id"
          class="py-3 flex items-center justify-between"
        >
          <div class="space-y-0.5">
            <span class="font-bold font-mono text-slate-800 dark:text-slate-100">{{ m.matched_bond_number }}</span>
            <span v-if="m.series" class="ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">{{ m.series }}</span>
            <p class="text-slate-400">{{ m.draw_number }}তম ড্র • {{ m.prize_title_bn }}</p>
          </div>
          <span class="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
            +{{ appStore.formatAmount(m.prize_amount) }}
          </span>
        </div>
      </div>

      <div v-else class="text-center py-8 text-slate-400 text-xs">
        এখনো কোনো বিজয়ী তথ্য পাওয়া যায়নি।
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { BarChart3, Trophy } from 'lucide-vue-next';

const appStore = useAppStore();
const stats = ref({
  totalBonds: 0,
  totalDraws: 0,
  totalMatches: 0,
  totalWinningAmount: 0,
  recentMatches: []
});

const netGain = computed(() => {
  return stats.value.totalWinningAmount;
});

onMounted(async () => {
  if (window.electronAPI) {
    stats.value = await window.electronAPI.getDashboardStats();
  }
});
</script>
