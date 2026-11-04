<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ isBulk ? appStore.t('bonds.addBulk') : appStore.t('bonds.addSingle') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ isBulk ? appStore.t('bonds.bulkSeriesHint') : appStore.t('bonds.subtitle') }}
          </p>
        </div>
        
        <!-- Mode Tabs -->
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            @click="isBulk = false"
            class="px-2.5 py-1 rounded-lg transition-all"
            :class="!isBulk ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'"
          >
            {{ appStore.t('bonds.addSingle') }}
          </button>
          <button
            @click="isBulk = true"
            class="px-2.5 py-1 rounded-lg transition-all"
            :class="isBulk ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'"
          >
            {{ appStore.t('bonds.addBulk') }}
          </button>
        </div>
      </div>

      <!-- Single Bond Form -->
      <form v-if="!isBulk" @submit.prevent="handleSaveSingle" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ appStore.t('bonds.bondNumber') }} <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="singleForm.number"
            type="text"
            required
            maxlength="10"
            placeholder="e.g. 0562947"
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-wider"
          />
          <p class="text-[11px] text-slate-400 mt-1">বাংলাদেশ প্রাইজবন্ড সাধারণত ৭ ডিজিটের হয়ে থাকে (উদা: 0562947)। শুরুর শূন্য সংরক্ষিত থাকবে।</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ appStore.t('bonds.series') }}
            </label>
            <input
              v-model="singleForm.series"
              type="text"
              placeholder="e.g. কক, কখ, ALL"
              class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ appStore.t('bonds.purchaseDate') }}
            </label>
            <input
              v-model="singleForm.purchaseDate"
              type="date"
              class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ appStore.t('bonds.notes') }}
          </label>
          <input
            v-model="singleForm.notes"
            type="text"
            placeholder="e.g. সোনালী ব্যাংক থেকে ক্রয়কৃত"
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {{ appStore.t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {{ saving ? appStore.t('common.loading') : appStore.t('bonds.saveBond') }}
          </button>
        </div>
      </form>

      <!-- Bulk Paste Form -->
      <form v-else @submit.prevent="handleSaveBulk" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ appStore.t('bonds.bondNumber') }} (বাল্ক তালিকা) <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="bulkText"
            required
            rows="6"
            :placeholder="appStore.t('bonds.bulkPlaceholder')"
            class="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
          ></textarea>
          <p class="text-[11px] text-slate-400 mt-1">
            মোট শনাক্তকৃত নম্বর: <span class="font-bold text-blue-600 dark:text-blue-400">{{ parsedBulkNumbers.length }}</span> টি
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ appStore.t('bonds.series') }} (সাধারণ সিরিজ)
            </label>
            <input
              v-model="bulkSeries"
              type="text"
              placeholder="e.g. কক (যদি সব একই হয়)"
              class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ appStore.t('bonds.purchaseDate') }}
            </label>
            <input
              v-model="bulkPurchaseDate"
              type="date"
              class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {{ appStore.t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving || parsedBulkNumbers.length === 0"
            class="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {{ saving ? appStore.t('common.loading') : `সংরক্ষণ করুন (${parsedBulkNumbers.length})` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '../stores/app';
import { useBondsStore } from '../stores/bonds';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'saved']);

const appStore = useAppStore();
const bondsStore = useBondsStore();

const isBulk = ref(false);
const saving = ref(false);

const singleForm = ref({
  number: '',
  series: '',
  purchaseDate: '',
  notes: ''
});

const bulkText = ref('');
const bulkSeries = ref('');
const bulkPurchaseDate = ref('');

const parsedBulkNumbers = computed(() => {
  if (!bulkText.value) return [];
  // Split by newlines, commas, spaces, tabs
  return bulkText.value
    .split(/[\r\n,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
});

function close() {
  emit('close');
}

async function handleSaveSingle() {
  saving.value = true;
  try {
    await bondsStore.addBond({
      bond_number: singleForm.value.number,
      series: singleForm.value.series,
      purchase_date: singleForm.value.purchaseDate || null,
      notes: singleForm.value.notes
    });

    appStore.showToast(appStore.t('common.success'), 'success');
    singleForm.value = { number: '', series: '', purchaseDate: '', notes: '' };
    emit('saved');
    emit('close');
  } catch (err) {
    appStore.showToast(err.message || appStore.t('bonds.duplicateDetected'), 'error');
  } finally {
    saving.value = false;
  }
}

async function handleSaveBulk() {
  if (parsedBulkNumbers.value.length === 0) return;
  saving.value = true;

  try {
    const list = parsedBulkNumbers.value.map((num) => ({
      bond_number: num,
      series: bulkSeries.value,
      purchase_date: bulkPurchaseDate.value || null,
      notes: 'Bulk Imported'
    }));

    const result = await bondsStore.bulkAddBonds(list);
    appStore.showToast(
      `যোগ করা হয়েছে: ${result.addedCount}টি, স্কিপ হয়েছে (ডুপ্লিকেট): ${result.skippedCount}টি`,
      'success'
    );

    bulkText.value = '';
    bulkSeries.value = '';
    bulkPurchaseDate.value = '';
    emit('saved');
    emit('close');
  } catch (err) {
    appStore.showToast(err.message || 'বাল্ক আপলোডে ত্রুটি', 'error');
  } finally {
    saving.value = false;
  }
}
</script>
