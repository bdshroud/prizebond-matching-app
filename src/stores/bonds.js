import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBondsStore = defineStore('bonds', () => {
  const bonds = ref([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const searchQuery = ref('');
  const selectedSeries = ref('');
  const sortBy = ref('created_at');
  const sortOrder = ref('desc');
  const selectedIds = ref([]);

  async function fetchBonds() {
    loading.value = true;
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.getBonds({
          search: searchQuery.value,
          series: selectedSeries.value,
          sortBy: sortBy.value,
          order: sortOrder.value
        });
        bonds.value = res.bonds || [];
        totalCount.value = res.totalCount || 0;
      }
    } catch (err) {
      console.error('Failed to fetch bonds:', err);
    } finally {
      loading.value = false;
    }
  }

  async function addBond(bondData) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.addBond(bondData);
    await fetchBonds();
    return res;
  }

  async function bulkAddBonds(list) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.bulkAddBonds(list);
    await fetchBonds();
    return res;
  }

  async function updateBond(bondData) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.updateBond(bondData);
    await fetchBonds();
    return res;
  }

  async function deleteBond(id) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.deleteBond(id);
    selectedIds.value = selectedIds.value.filter((i) => i !== id);
    await fetchBonds();
    return res;
  }

  async function deleteSelected() {
    if (!window.electronAPI || selectedIds.value.length === 0) return null;
    const res = await window.electronAPI.deleteBonds(selectedIds.value);
    selectedIds.value = [];
    await fetchBonds();
    return res;
  }

  function toggleSelect(id) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((i) => i !== id);
    } else {
      selectedIds.value.push(id);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.value.length === bonds.value.length) {
      selectedIds.value = [];
    } else {
      selectedIds.value = bonds.value.map((b) => b.id);
    }
  }

  return {
    bonds,
    totalCount,
    loading,
    searchQuery,
    selectedSeries,
    sortBy,
    sortOrder,
    selectedIds,
    fetchBonds,
    addBond,
    bulkAddBonds,
    updateBond,
    deleteBond,
    deleteSelected,
    toggleSelect,
    toggleSelectAll
  };
});
