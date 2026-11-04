<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
    <!-- Left Navigation Sidebar -->
    <Sidebar />

    <!-- Right Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navigation Bar -->
      <Topbar @open-add-bond="isAddModalOpen = true" />

      <!-- Main Scrollable Content -->
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>

    <!-- Global Quick Add Bond Modal -->
    <AddBondModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @saved="onBondSaved"
    />

    <!-- Global Floating Toast Notification -->
    <div
      v-if="appStore.toast"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-bottom-5 duration-300 select-none text-xs font-semibold"
      :class="[
        appStore.toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20' :
        appStore.toast.type === 'error' ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20' :
        'bg-slate-900 text-white border-slate-700 shadow-slate-900/20'
      ]"
    >
      <CheckCircle2 v-if="appStore.toast.type === 'success'" class="w-4 h-4 shrink-0" />
      <AlertCircle v-else-if="appStore.toast.type === 'error'" class="w-4 h-4 shrink-0" />
      <Info v-else class="w-4 h-4 shrink-0" />
      <span>{{ appStore.toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from './stores/app';
import { useBondsStore } from './stores/bonds';
import Sidebar from './components/Sidebar.vue';
import Topbar from './components/Topbar.vue';
import AddBondModal from './components/AddBondModal.vue';
import { CheckCircle2, AlertCircle, Info } from 'lucide-vue-next';

const appStore = useAppStore();
const bondsStore = useBondsStore();
const isAddModalOpen = ref(false);

function onBondSaved() {
  bondsStore.fetchBonds();
}

onMounted(() => {
  appStore.init();
});
</script>
