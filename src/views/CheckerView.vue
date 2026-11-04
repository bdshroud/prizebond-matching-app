<template>
  <div class="p-8 space-y-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Trophy class="w-7 h-7 text-amber-500" />
          {{ appStore.t('checker.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ appStore.t('checker.subtitle') }}
        </p>
      </div>

      <!-- Action Button -->
      <button
        @click="runMatching"
        :disabled="matchingStore.isChecking"
        class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        <Sparkles class="w-5 h-5 text-amber-300 animate-spin" v-if="matchingStore.isChecking" />
        <Trophy class="w-5 h-5 text-amber-300" v-else />
        <span>{{ matchingStore.isChecking ? appStore.t('checker.checking') : appStore.t('checker.startCheck') }}</span>
      </button>
    </div>

    <!-- Draw Selection Box -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <CalendarCheck class="w-4 h-4 text-blue-500" />
          {{ appStore.t('checker.selectDraws') }}
        </label>
        <span class="text-xs text-blue-600 dark:text-blue-400 font-semibold">
          {{ selectedDrawIds.length === 0 ? appStore.t('checker.allDraws') : `${selectedDrawIds.length} ${appStore.t('checker.selectedDrawsCount')}` }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          @click="selectedDrawIds = []"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          :class="selectedDrawIds.length === 0 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
        >
          {{ appStore.t('checker.allDraws') }}
        </button>

        <button
          v-for="d in drawsStore.draws"
          :key="d.id"
          type="button"
          @click="toggleDrawSelect(d.id)"
          class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          :class="selectedDrawIds.includes(d.id) ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
        >
          <span>{{ d.draw_number }}তম ড্র ({{ d.draw_date }})</span>
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="result">
      <!-- WINNING STATE -->
      <div v-if="result.matchesCount > 0" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <!-- Hero Celebration Banner -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-8 sm:p-10 shadow-xl shadow-emerald-600/20">
          <div class="relative z-10 space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
              <Sparkles class="w-4 h-4 text-amber-300" />
              <span>{{ appStore.t('checker.resultTitleWon') }}</span>
            </div>
            
            <h2 class="text-3xl sm:text-4xl font-black tracking-tight">
              {{ appStore.t('checker.resultSubWon') }}
            </h2>

            <p class="text-emerald-100 text-sm max-w-xl">
              {{ appStore.t('checker.checkedSummary', { bonds: result.totalBondsChecked, draws: drawsStore.draws.length, time: result.durationMs }) }}
            </p>

            <div class="pt-4 flex flex-wrap items-center gap-6">
              <div>
                <p class="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  {{ appStore.t('checker.totalWonAmount') }}
                </p>
                <p class="text-3xl font-extrabold text-amber-300 mt-0.5">
                  {{ appStore.formatAmount(result.totalPrizeWon) }}
                </p>
              </div>

              <div class="h-10 w-px bg-emerald-400/30"></div>

              <div>
                <p class="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  মোট বিজয়
                </p>
                <p class="text-3xl font-extrabold text-white mt-0.5">
                  {{ appStore.formatNumber(result.matchesCount) }} টি
                </p>
              </div>
            </div>
          </div>

          <!-- Decorative Glows -->
          <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        </div>

        <!-- Matched Bonds Details List -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy class="w-5 h-5 text-emerald-500" />
            {{ appStore.t('checker.matchedBonds') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="m in result.matches"
              :key="m.bond_id + '-' + m.draw_id"
              class="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/40 p-5 shadow-sm space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
                  {{ m.prize_title_bn }}
                </span>
                <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {{ appStore.formatAmount(m.prize_amount) }}
                </span>
              </div>

              <div class="flex items-baseline justify-between pt-1">
                <div>
                  <p class="text-[11px] text-slate-400 uppercase font-semibold">বিজয়ী বন্ড নম্বর</p>
                  <p class="text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white mt-0.5">
                    {{ m.bond_number }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] text-slate-400 uppercase font-semibold">সিরিজ</p>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {{ m.bond_series || 'সব সিরিজ প্রযোজ্য' }}
                  </p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>{{ m.draw_number }}তম ড্র</span>
                <span>অনুষ্ঠিত: {{ m.draw_date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NO MATCH STATE -->
      <div v-else class="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-300">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <HelpCircle class="w-8 h-8" />
        </div>

        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100">
            {{ appStore.t('checker.resultTitleLost') }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {{ appStore.t('checker.resultSubLost') }}
          </p>
        </div>

        <p class="text-xs text-slate-400">
          {{ appStore.t('checker.checkedSummary', { bonds: result.totalBondsChecked, draws: selectedDrawIds.length || drawsStore.draws.length, time: result.durationMs }) }}
        </p>

        <div class="pt-4">
          <router-link
            to="/bonds"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-xl hover:bg-blue-100"
          >
            <span>আমার বন্ড তালিকায় আরও বন্ড যোগ করুন</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useDrawsStore } from '../stores/draws';
import { useMatchingStore } from '../stores/matching';
import {
  Trophy,
  Sparkles,
  CalendarCheck,
  HelpCircle,
  ArrowRight
} from 'lucide-vue-next';

const appStore = useAppStore();
const drawsStore = useDrawsStore();
const matchingStore = useMatchingStore();

const selectedDrawIds = ref([]);
const result = ref(null);

function toggleDrawSelect(id) {
  if (selectedDrawIds.value.includes(id)) {
    selectedDrawIds.value = selectedDrawIds.value.filter((i) => i !== id);
  } else {
    selectedDrawIds.value.push(id);
  }
}

async function runMatching() {
  try {
    const res = await matchingStore.checkWinners(
      selectedDrawIds.value.length > 0 ? selectedDrawIds.value : null
    );
    result.value = res;
    if (res.matchesCount > 0) {
      appStore.showToast(`অভিনন্দন! ${res.matchesCount}টি পুরস্কার পাওয়া গেছে!`, 'success');
    } else {
      appStore.showToast('কোনো মেলানো নম্বর পাওয়া যায়নি', 'info');
    }
  } catch (err) {
    appStore.showToast(err.message, 'error');
  }
}

onMounted(() => {
  drawsStore.fetchDraws();
});
</script>
