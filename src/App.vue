<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
    <!-- Left Navigation Sidebar (Desktop + Mobile Drawer) -->
    <Sidebar />

    <!-- Right / Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Navigation Bar -->
      <Topbar @open-add-bond="isAddModalOpen = true" />

      <!-- Main Scrollable Content -->
      <main class="flex-1 overflow-y-auto pb-16 md:pb-0">
        <router-view />
      </main>

      <!-- Mobile Bottom Navigation Bar (Android Native App Experience) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-30 select-none">
        <router-link
          v-for="item in mobileNavItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors"
          :class="[
            $route.path === item.path
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mb-0.5" />
          <span class="truncate max-w-[64px]">{{ appStore.t(item.label) }}</span>
        </router-link>
      </nav>
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
      class="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-bottom-5 duration-300 select-none text-xs font-semibold"
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
import {
  CheckCircle2,
  AlertCircle,
  Info,
  LayoutDashboard,
  Coins,
  Trophy,
  CalendarCheck,
  Settings
} from 'lucide-vue-next';

const appStore = useAppStore();
const bondsStore = useBondsStore();
const isAddModalOpen = ref(false);

const mobileNavItems = [
  { path: '/', label: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/bonds', label: 'nav.bonds', icon: Coins },
  { path: '/checker', label: 'nav.checker', icon: Trophy },
  { path: '/draws', label: 'nav.draws', icon: CalendarCheck },
  { path: '/settings', label: 'nav.settings', icon: Settings }
];

function onBondSaved() {
  bondsStore.fetchBonds();
}

onMounted(() => {
  appStore.init();
});
</script>
