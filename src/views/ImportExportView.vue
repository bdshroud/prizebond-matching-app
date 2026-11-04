<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
        <ArrowUpDown class="w-7 h-7 text-blue-600" />
        {{ appStore.t('io.title') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {{ appStore.t('io.subtitle') }}
      </p>
    </div>

    <!-- Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Export CSV Card -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Download class="w-5 h-5" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ appStore.t('io.exportCSV') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            আপনার সকল সংরক্ষিত প্রাইজবন্ড নম্বর, প্রযোজ্য সিরিজ, ক্রয় তারিখ ও মন্তব্য একটি স্ট্যান্ডার্ড CSV ফাইলে এক্সপোর্ট করুন।
          </p>
        </div>

        <button
          @click="handleExportCSV"
          :disabled="loading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FileSpreadsheet class="w-4 h-4" />
          <span>CSV ফাইল ডাউনলোড করুন</span>
        </button>
      </div>

      <!-- Import CSV Card -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Upload class="w-5 h-5" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ appStore.t('io.importCSV') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            কম্পিউটারে থাকা পূর্বে সংরক্ষিত CSV বা টেক্সট ফাইল থেকে এক ক্লিকেই হাজার হাজার প্রাইজবন্ড নম্বর অ্যাপে নিয়ে আসুন।
          </p>
        </div>

        <button
          @click="handleImportCSV"
          :disabled="loading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FileUp class="w-4 h-4" />
          <span>CSV ফাইল নির্বাচন করুন</span>
        </button>
      </div>

      <!-- Backup Database (.db) -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <HardDriveDownload class="w-5 h-5" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ appStore.t('io.backupDB') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            আপনার সম্পূর্ণ SQLite ডাটাবেজের একটি অবিকল ব্যাকআপ ফাইল তৈরি করে সুরক্ষিত রাখুন।
          </p>
        </div>

        <button
          @click="handleBackupDB"
          :disabled="loading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Database class="w-4 h-4" />
          <span>সম্পূর্ণ ডাটাবেজ ব্যাকআপ নিন</span>
        </button>
      </div>

      <!-- Restore Database -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <HardDriveUpload class="w-5 h-5" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ appStore.t('io.restoreDB') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            পূর্বে সংরক্ষিত ব্যাকআপ (.db) ফাইল থেকে সকল ডাটা ফিরিয়ে আনুন। (বিদ্যমান ডাটা প্রতিস্থাপিত হবে)
          </p>
        </div>

        <button
          @click="handleRestoreDB"
          :disabled="loading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
        </button>
      </div>
    </div>

    <!-- Danger Zone: Wipe Data -->
    <div class="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-rose-900 dark:text-rose-200">
            {{ appStore.t('io.clearData') }}
          </h4>
          <p class="text-xs text-rose-800/80 dark:text-rose-300/80">
            {{ appStore.t('io.clearWarning') }}
          </p>
        </div>
      </div>

      <button
        @click="handleClearData"
        class="py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2"
      >
        <Trash2 class="w-4 h-4" />
        <span>সকল ডাটা স্থায়ীভাবে মুছে ফেলুন</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/app';
import {
  ArrowUpDown,
  Download,
  Upload,
  HardDriveDownload,
  HardDriveUpload,
  Database,
  FileSpreadsheet,
  FileUp,
  RefreshCw,
  AlertTriangle,
  Trash2
} from 'lucide-vue-next';

const appStore = useAppStore();
const loading = ref(false);

async function handleExportCSV() {
  if (!window.electronAPI) return;
  loading.value = true;
  try {
    const res = await window.electronAPI.exportBondsCSV();
    if (res.success) {
      appStore.showToast(`মোট ${res.count}টি বন্ড সফলভাবে এক্সপোর্ট করা হয়েছে!`, 'success');
    }
  } catch (err) {
    appStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function handleImportCSV() {
  if (!window.electronAPI) return;
  loading.value = true;
  try {
    const res = await window.electronAPI.importBondsCSV();
    if (res.success) {
      appStore.showToast(
        `ইমপোর্ট সফল! যোগ করা হয়েছে: ${res.addedCount}টি, ডুপ্লিকেট বাদ: ${res.skippedCount}টি`,
        'success'
      );
    }
  } catch (err) {
    appStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function handleBackupDB() {
  if (!window.electronAPI) return;
  loading.value = true;
  try {
    const res = await window.electronAPI.backupDatabase();
    if (res.success) {
      appStore.showToast('ডাটাবেজ ব্যাকআপ সফলভাবে সম্পন্ন হয়েছে!', 'success');
    }
  } catch (err) {
    appStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function handleRestoreDB() {
  if (!window.electronAPI) return;
  if (!confirm('সতর্কতা: ব্যাকআপ রিস্টোর করলে বর্তমান ডাটাবেজ প্রতিস্থাপিত হবে। আপনি কি এগিয়ে যেতে চান?')) {
    return;
  }

  loading.value = true;
  try {
    const res = await window.electronAPI.restoreDatabase();
    if (res.success) {
      appStore.showToast('ডাটাবেজ রিস্টোর সফল হয়েছে! অ্যাপ রিলোড হচ্ছে...', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  } catch (err) {
    appStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function handleClearData() {
  if (!window.electronAPI) return;
  if (confirm(appStore.t('io.confirmClear'))) {
    if (confirm('চূড়ান্ত নিশ্চিতকরণ: সকল প্রাইজবন্ড ও ড্র হিস্ট্রি চিরতরে মুছে যাবে! নিশ্চিত তো?')) {
      await window.electronAPI.clearAllData();
      appStore.showToast('সকল ডাটা মুছে ফেলা হয়েছে', 'success');
      setTimeout(() => window.location.reload(), 800);
    }
  }
}
</script>
