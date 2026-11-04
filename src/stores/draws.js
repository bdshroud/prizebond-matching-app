import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDrawsStore = defineStore('draws', () => {
  const draws = ref([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const selectedYear = ref('');
  const currentDraw = ref(null);

  async function fetchDraws() {
    loading.value = true;
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.getDraws({
          search: searchQuery.value,
          year: selectedYear.value
        });
        draws.value = res || [];
      }
    } catch (err) {
      console.error('Failed to fetch draws:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchDrawById(id) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.getDrawById(id);
    currentDraw.value = res;
    return res;
  }

  async function addDraw(drawData) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.addDraw(drawData);
    await fetchDraws();
    return res;
  }

  async function updateDraw(drawData) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.updateDraw(drawData);
    await fetchDraws();
    return res;
  }

  async function deleteDraw(id) {
    if (!window.electronAPI) return null;
    const res = await window.electronAPI.deleteDraw(id);
    await fetchDraws();
    return res;
  }

  return {
    draws,
    loading,
    searchQuery,
    selectedYear,
    currentDraw,
    fetchDraws,
    fetchDrawById,
    addDraw,
    updateDraw,
    deleteDraw
  };
});
