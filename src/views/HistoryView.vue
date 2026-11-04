<template>
  <div class="p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Clock class="w-6 h-6 text-blue-500" />
          {{ appStore.t('history.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ appStore.t('history.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="matchingStore.history.length > 0"
          @click="confirmClearAll"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 cursor-pointer"
        >
          <Trash2 class="w-4 h-4" />
          <span>{{ appStore.t('history.clearHistory') }}</span>
        </button>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
            <tr>
              <th class="py-3.5 px-4">{{ appStore.t('history.checkedAt') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('history.draw') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('history.matchedNumber') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('history.series') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('history.prize') }}</th>
              <th class="py-3.5 px-4 text-right">{{ appStore.t('history.amount') }}</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr
              v-for="item in matchingStore.history"
              :key="item.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono">
                {{ item.checked_at }}
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                {{ item.draw_number }}তম ড্র ({{ item.draw_date }})
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-sm text-slate-900 dark:text-white">
                {{ item.matched_bond_number }}
              </td>
              <td class="py-3.5 px-4">
                <span v-if="item.series" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {{ item.series }}
                </span>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="py-3.5 px-4 font-medium text-blue-600 dark:text-blue-400">
                {{ item.prize_title_bn }}
              </td>
              <td class="py-3.5 px-4 text-right font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {{ appStore.formatAmount(item.prize_amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!matchingStore.historyLoading && matchingStore.history.length === 0" class="text-center py-16 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Clock class="w-6 h-6" />
        </div>
        <h4 class="text-base font-bold text-slate-800 dark:text-slate-200">
          {{ appStore.t('history.noHistory') }}
        </h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          'বিজয়ীদের যাচাই' পেজ থেকে বন্ড মেলানোর পর সকল বিজয়ী রেকর্ড এখানে স্থায়ীভাবে সংরক্ষিত থাকবে।
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useMatchingStore } from '../stores/matching';
import { Clock, Trash2 } from 'lucide-vue-next';

const appStore = useAppStore();
const matchingStore = useMatchingStore();

async function confirmClearAll() {
  if (confirm(appStore.t('history.confirmClear'))) {
    await matchingStore.clearAllHistory();
    appStore.showToast(appStore.t('common.success'), 'success');
  }
}

onMounted(() => {
  matchingStore.fetchHistory();
});
</script>
