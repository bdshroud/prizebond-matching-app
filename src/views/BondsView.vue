<template>
  <div class="p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ appStore.t('bonds.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ appStore.t('bonds.subtitle') }} • মোট: {{ appStore.formatNumber(bondsStore.totalCount) }}টি
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="bondsStore.selectedIds.length > 0"
          @click="confirmDeleteSelected"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <Trash2 class="w-4 h-4" />
          <span>{{ appStore.t('bonds.deleteSelected') }} ({{ bondsStore.selectedIds.length }})</span>
        </button>

        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>{{ appStore.t('bonds.addSingle') }} / বাল্ক যোগ</span>
        </button>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="bondsStore.searchQuery"
          @input="onSearchInput"
          type="text"
          :placeholder="appStore.t('bonds.searchPlaceholder')"
          class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Sorting & Filtering -->
      <div class="flex items-center gap-2 w-full md:w-auto justify-end">
        <select
          v-model="bondsStore.sortBy"
          @change="bondsStore.fetchBonds"
          class="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
        >
          <option value="created_at">তারিখ অনুযায়ী (Date)</option>
          <option value="number">নম্বর অনুযায়ী (Number)</option>
          <option value="purchase_date">ক্রয় তারিখ (Purchase)</option>
        </select>

        <button
          @click="toggleSortOrder"
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
          :title="bondsStore.sortOrder === 'asc' ? 'Ascending' : 'Descending'"
        >
          <ArrowDownUp class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Bonds Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
            <tr>
              <th class="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="bondsStore.toggleSelectAll"
                  class="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class="py-3.5 px-4">{{ appStore.t('bonds.bondNumber') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('bonds.series') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('bonds.purchaseDate') }}</th>
              <th class="py-3.5 px-4">{{ appStore.t('bonds.notes') }}</th>
              <th class="py-3.5 px-4 text-right">{{ appStore.t('bonds.actions') }}</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr
              v-for="b in bondsStore.bonds"
              :key="b.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              :class="bondsStore.selectedIds.includes(b.id) ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''"
            >
              <td class="p-4 text-center">
                <input
                  type="checkbox"
                  :checked="bondsStore.selectedIds.includes(b.id)"
                  @change="bondsStore.toggleSelect(b.id)"
                  class="rounded text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="py-3 px-4 font-mono font-bold text-sm text-slate-900 dark:text-white">
                {{ b.bond_number }}
              </td>
              <td class="py-3 px-4 font-medium">
                <span v-if="b.series" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ b.series }}
                </span>
                <span v-else class="text-slate-400 text-[11px]">—</span>
              </td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">
                {{ b.purchase_date || '—' }}
              </td>
              <td class="py-3 px-4 text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {{ b.notes || '—' }}
              </td>
              <td class="py-3 px-4 text-right space-x-1">
                <button
                  @click="openEditModal(b)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  title="সম্পাদনা"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="deleteBond(b.id)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  title="মুছুন"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!bondsStore.loading && bondsStore.bonds.length === 0" class="text-center py-16 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          <Coins class="w-6 h-6" />
        </div>
        <h4 class="text-base font-bold text-slate-800 dark:text-slate-200">
          {{ appStore.t('bonds.noBonds') }}
        </h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          {{ appStore.t('bonds.noBondsHint') }}
        </p>
        <button
          @click="isAddModalOpen = true"
          class="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>{{ appStore.t('bonds.addSingle') }}</span>
        </button>
      </div>
    </div>

    <!-- Modals -->
    <AddBondModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @saved="bondsStore.fetchBonds"
    />

    <!-- Edit Bond Modal -->
    <div v-if="editingBond" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 class="text-base font-bold text-slate-900 dark:text-white">
          {{ appStore.t('bonds.editBond') }}
        </h3>
        
        <form @submit.prevent="handleUpdateBond" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              {{ appStore.t('bonds.bondNumber') }}
            </label>
            <input
              v-model="editingBond.bond_number"
              type="text"
              required
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              {{ appStore.t('bonds.series') }}
            </label>
            <input
              v-model="editingBond.series"
              type="text"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              {{ appStore.t('bonds.purchaseDate') }}
            </label>
            <input
              v-model="editingBond.purchase_date"
              type="date"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              {{ appStore.t('bonds.notes') }}
            </label>
            <input
              v-model="editingBond.notes"
              type="text"
              class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="editingBond = null"
              class="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100"
            >
              {{ appStore.t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {{ appStore.t('common.save') }}
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
import { useBondsStore } from '../stores/bonds';
import AddBondModal from '../components/AddBondModal.vue';
import {
  Coins,
  Plus,
  Search,
  ArrowDownUp,
  Pencil,
  Trash2
} from 'lucide-vue-next';

const appStore = useAppStore();
const bondsStore = useBondsStore();

const isAddModalOpen = ref(false);
const editingBond = ref(null);

const isAllSelected = computed(() => {
  return (
    bondsStore.bonds.length > 0 &&
    bondsStore.selectedIds.length === bondsStore.bonds.length
  );
});

let searchTimeout = null;
function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    bondsStore.fetchBonds();
  }, 250);
}

function toggleSortOrder() {
  bondsStore.sortOrder = bondsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  bondsStore.fetchBonds();
}

function openEditModal(bond) {
  editingBond.value = { ...bond };
}

async function handleUpdateBond() {
  if (!editingBond.value) return;
  try {
    await bondsStore.updateBond(editingBond.value);
    appStore.showToast(appStore.t('common.success'), 'success');
    editingBond.value = null;
  } catch (err) {
    appStore.showToast(err.message, 'error');
  }
}

async function deleteBond(id) {
  if (confirm(appStore.t('bonds.confirmDelete'))) {
    await bondsStore.deleteBond(id);
    appStore.showToast(appStore.t('common.success'), 'success');
  }
}

async function confirmDeleteSelected() {
  const count = bondsStore.selectedIds.length;
  if (confirm(appStore.t('bonds.confirmDeleteMultiple', { count }))) {
    await bondsStore.deleteSelected();
    appStore.showToast(appStore.t('common.success'), 'success');
  }
}

onMounted(() => {
  bondsStore.fetchBonds();
});
</script>
