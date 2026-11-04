import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMatchingStore = defineStore('matching', () => {
  const isChecking = ref(false);
  const lastResult = ref(null);
  const history = ref([]);
  const historyLoading = ref(false);

  async function checkWinners(drawIds = null) {
    if (!window.electronAPI) return null;
    isChecking.value = true;
    try {
      const res = await window.electronAPI.checkWinners({
        draw_ids: drawIds,
        save_history: true
      });
      lastResult.value = res;
      return res;
    } catch (err) {
      console.error('Failed to run winner matching:', err);
      throw err;
    } finally {
      isChecking.value = false;
    }
  }

  async function fetchHistory(filters = {}) {
    if (!window.electronAPI) return [];
    historyLoading.value = true;
    try {
      const res = await window.electronAPI.getMatchHistory(filters);
      history.value = res || [];
      return res;
    } catch (err) {
      console.error('Failed to fetch match history:', err);
      return [];
    } finally {
      historyLoading.value = false;
    }
  }

  async function deleteHistory(ids) {
    if (!window.electronAPI) return;
    await window.electronAPI.deleteMatchHistory(ids);
    await fetchHistory();
  }

  async function clearAllHistory() {
    if (!window.electronAPI) return;
    await window.electronAPI.clearMatchHistory();
    history.value = [];
  }

  return {
    isChecking,
    lastResult,
    history,
    historyLoading,
    checkWinners,
    fetchHistory,
    deleteHistory,
    clearAllHistory
  };
});
