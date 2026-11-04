import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { translations } from '../i18n';

export const useAppStore = defineStore('app', () => {
  const lang = ref('bn');
  const theme = ref('system');
  const appVersion = ref('1.0.0');
  const userDataPath = ref('');
  const toast = ref(null);

  // Initialize preferences from settings
  async function init() {
    try {
      if (window.electronAPI) {
        const storedTheme = await window.electronAPI.getSetting('theme');
        if (storedTheme) theme.value = storedTheme;

        const storedLang = await window.electronAPI.getSetting('language');
        if (storedLang) lang.value = storedLang;

        appVersion.value = await window.electronAPI.getAppVersion();
        userDataPath.value = await window.electronAPI.getUserDataPath();
      }
    } catch (e) {
      console.warn('Failed to load electron preferences:', e);
    }
    applyTheme();
  }

  function setLanguage(newLang) {
    lang.value = newLang;
    if (window.electronAPI) {
      window.electronAPI.saveSetting('language', newLang);
    }
  }

  function setTheme(newTheme) {
    theme.value = newTheme;
    if (window.electronAPI) {
      window.electronAPI.saveSetting('theme', newTheme);
    }
    applyTheme();
  }

  function applyTheme() {
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function showToast(message, type = 'info') {
    toast.value = { message, type, id: Date.now() };
    setTimeout(() => {
      if (toast.value?.id === toast.value?.id) {
        toast.value = null;
      }
    }, 4000);
  }

  // Helper translation function with dotted paths e.g. t('dashboard.title')
  function t(path, params = {}) {
    const currentTrans = translations[lang.value] || translations.bn;
    const parts = path.split('.');
    let val = currentTrans;

    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) {
        val = val[p];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fp of parts) {
          if (fallback && typeof fallback === 'object' && fp in fallback) {
            fallback = fallback[fp];
          } else {
            return path;
          }
        }
        val = fallback;
        break;
      }
    }

    if (typeof val === 'string' && Object.keys(params).length > 0) {
      let str = val;
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
      return str;
    }

    return val;
  }

  // Format currency with Bangla or English digits
  function formatAmount(amount) {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString(lang.value === 'bn' ? 'bn-BD' : 'en-US');
    return `৳${formatted}`;
  }

  function formatNumber(number) {
    if (lang.value === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(number).replace(/[0-9]/g, (d) => bnDigits[d]);
    }
    return String(number);
  }

  return {
    lang,
    theme,
    appVersion,
    userDataPath,
    toast,
    init,
    setLanguage,
    setTheme,
    applyTheme,
    showToast,
    t,
    formatAmount,
    formatNumber
  };
});
