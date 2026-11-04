<template>
  <div class="p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ appStore.t('draws.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ appStore.t('draws.subtitle') }}
        </p>
      </div>

      <button
        @click="openAddDrawModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>{{ appStore.t('draws.addDraw') }}</span>
      </button>
    </div>

    <!-- Draws List Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="draw in drawsStore.draws"
        :key="draw.id"
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 text-xs font-black rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-mono">
              {{ draw.draw_number }}তম ড্র
            </span>
            <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ draw.draw_date }}
            </span>
          </div>

          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ draw.description || 'বাংলাদেশ ব্যাংক অফিশিয়াল প্রাইজবন্ড ড্র' }}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              প্রযোজ্য সিরিজ: <span class="font-semibold text-slate-600 dark:text-slate-300 uppercase">{{ draw.series_type === 'all' ? 'সকল সিরিজ' : draw.series_type }}</span>
            </p>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
            <span class="text-slate-500">মোট বিজয়ী নম্বর:</span>
            <span class="font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {{ appStore.formatNumber(draw.winner_count || 0) }} টি
            </span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            @click="viewDrawDetails(draw.id)"
            class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{{ appStore.t('draws.viewDetails') }}</span>
            <ChevronRight class="w-4 h-4" />
          </button>

          <button
            @click="confirmDeleteDraw(draw.id)"
            class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="ড্র ফলাফল মুছুন"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!drawsStore.loading && drawsStore.draws.length === 0" class="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
        <CalendarCheck class="w-6 h-6" />
      </div>
      <h4 class="text-base font-bold text-slate-800 dark:text-slate-200">
        {{ appStore.t('draws.noDraws') }}
      </h4>
      <p class="text-xs text-slate-400 max-w-sm mx-auto">
        অফিশিয়াল ড্র ফলাফল সংরক্ষণ করতে 'নতুন ড্র যোগ করুন' বাটনে ক্লিক করুন।
      </p>
    </div>

    <!-- View Draw Details Modal -->
    <div v-if="activeDraw" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ activeDraw.draw_number }}তম ড্র ফলাফল ({{ activeDraw.draw_date }})
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ activeDraw.description }}
            </p>
          </div>
          <button @click="activeDraw = null" class="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Winners Grid by Prize Categories -->
        <div class="flex-1 overflow-y-auto space-y-4 pr-1">
          <div
            v-for="(group, cat) in groupedWinners"
            :key="cat"
            class="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Trophy class="w-4 h-4 text-amber-500" />
                {{ group.titleBn }} ({{ appStore.formatAmount(group.amount) }})
              </span>
              <span class="text-xs text-slate-400 font-mono">
                {{ group.items.length }} টি বিজয়ী
              </span>
            </div>

            <!-- Numbers pills -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="w in group.items"
                :key="w.id"
                class="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-2xs"
              >
                {{ w.bond_number }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            @click="activeDraw = null"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>

    <!-- Add Draw Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ appStore.t('draws.addDraw') }}
        </h3>

        <form @submit.prevent="handleSaveDraw" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                ড্র নম্বর <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newDrawForm.draw_number"
                type="text"
                required
                placeholder="e.g. 119"
                class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                অনুষ্ঠানের তারিখ <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newDrawForm.draw_date"
                type="date"
                required
                class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              বিবরণ
            </label>
            <input
              v-model="newDrawForm.description"
              type="text"
              placeholder="e.g. ১১৯তম বাংলাদেশ প্রাইজবন্ড ড্র"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <!-- 1st Prize -->
          <div>
            <label class="block text-xs font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
              ১ম পুরস্কার (৳৬,০০,০০০) - ১টি নম্বর
            </label>
            <input
              v-model="newDrawForm.firstPrize"
              type="text"
              placeholder="e.g. 0123456"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <!-- 2nd Prize -->
          <div>
            <label class="block text-xs font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
              ২য় পুরস্কার (৳৩,২৫,০০০) - ১টি নম্বর
            </label>
            <input
              v-model="newDrawForm.secondPrize"
              type="text"
              placeholder="e.g. 0654321"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <!-- 3rd Prizes -->
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              ৩য় পুরস্কার (৳১,০০,০০০) - ২টি নম্বর (কমা বা স্পেস দিয়ে)
            </label>
            <input
              v-model="newDrawForm.thirdPrizes"
              type="text"
              placeholder="e.g. 0111111, 0222222"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <!-- 4th Prizes -->
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              ৪র্থ পুরস্কার (৳৫০,০০০) - ২টি নম্বর
            </label>
            <input
              v-model="newDrawForm.fourthPrizes"
              type="text"
              placeholder="e.g. 0333333, 0444444"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <!-- 5th Prizes Bulk -->
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              ৫ম পুরস্কার (৳১০,০০০) - ৪০টি বিজয়ী নম্বর (বাল্ক পেস্ট)
            </label>
            <textarea
              v-model="newDrawForm.fifthPrizes"
              rows="4"
              placeholder="নম্বরগুলো কমা, স্পেস বা নতুন লাইনে পেস্ট করুন..."
              class="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              ড্র সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useDrawsStore } from '../stores/draws';
import {
  CalendarCheck,
  Calendar,
  Plus,
  Trash2,
  ChevronRight,
  Trophy,
  X
} from 'lucide-vue-next';

const appStore = useAppStore();
const drawsStore = useDrawsStore();

const activeDraw = ref(null);
const isAddModalOpen = ref(false);

const newDrawForm = ref({
  draw_number: '',
  draw_date: '',
  description: '',
  firstPrize: '',
  secondPrize: '',
  thirdPrizes: '',
  fourthPrizes: '',
  fifthPrizes: ''
});

const groupedWinners = computed(() => {
  if (!activeDraw.value?.winners) return {};
  const map = {
    first: { titleBn: '১ম পুরস্কার', amount: 600000, items: [] },
    second: { titleBn: '২য় পুরস্কার', amount: 325000, items: [] },
    third: { titleBn: '৩য় পুরস্কার', amount: 100000, items: [] },
    fourth: { titleBn: '৪র্থ পুরস্কার', amount: 50000, items: [] },
    fifth: { titleBn: '৫ম পুরস্কার', amount: 10000, items: [] }
  };

  for (const w of activeDraw.value.winners) {
    if (map[w.prize_category]) {
      map[w.prize_category].items.push(w);
    }
  }

  return map;
});

async function viewDrawDetails(id) {
  const draw = await drawsStore.fetchDrawById(id);
  activeDraw.value = draw;
}

function openAddDrawModal() {
  newDrawForm.value = {
    draw_number: '',
    draw_date: new Date().toISOString().split('T')[0],
    description: '',
    firstPrize: '',
    secondPrize: '',
    thirdPrizes: '',
    fourthPrizes: '',
    fifthPrizes: ''
  };
  isAddModalOpen.value = true;
}

async function handleSaveDraw() {
  const winners = [];
  const parseNumbers = (str) =>
    (str || '')
      .split(/[\r\n,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  if (newDrawForm.value.firstPrize) {
    winners.push({
      bond_number: newDrawForm.value.firstPrize.trim(),
      prize_category: 'first',
      prize_title_bn: '১ম পুরস্কার',
      prize_title_en: '1st Prize',
      prize_amount: 600000
    });
  }

  if (newDrawForm.value.secondPrize) {
    winners.push({
      bond_number: newDrawForm.value.secondPrize.trim(),
      prize_category: 'second',
      prize_title_bn: '২য় পুরস্কার',
      prize_title_en: '2nd Prize',
      prize_amount: 325000
    });
  }

  for (const num of parseNumbers(newDrawForm.value.thirdPrizes)) {
    winners.push({
      bond_number: num,
      prize_category: 'third',
      prize_title_bn: '৩য় পুরস্কার',
      prize_title_en: '3rd Prize',
      prize_amount: 100000
    });
  }

  for (const num of parseNumbers(newDrawForm.value.fourthPrizes)) {
    winners.push({
      bond_number: num,
      prize_category: 'fourth',
      prize_title_bn: '৪র্থ পুরস্কার',
      prize_title_en: '4th Prize',
      prize_amount: 50000
    });
  }

  for (const num of parseNumbers(newDrawForm.value.fifthPrizes)) {
    winners.push({
      bond_number: num,
      prize_category: 'fifth',
      prize_title_bn: '৫ম পুরস্কার',
      prize_title_en: '5th Prize',
      prize_amount: 10000
    });
  }

  try {
    await drawsStore.addDraw({
      draw_number: newDrawForm.value.draw_number,
      draw_date: newDrawForm.value.draw_date,
      series_type: 'all',
      description: newDrawForm.value.description || `${newDrawForm.value.draw_number}তম ড্র`,
      winners
    });

    appStore.showToast(appStore.t('common.success'), 'success');
    isAddModalOpen.value = false;
  } catch (err) {
    appStore.showToast(err.message, 'error');
  }
}

async function confirmDeleteDraw(id) {
  if (confirm(appStore.t('draws.confirmDelete'))) {
    await drawsStore.deleteDraw(id);
    appStore.showToast(appStore.t('common.success'), 'success');
  }
}

onMounted(() => {
  drawsStore.fetchDraws();
});
</script>
