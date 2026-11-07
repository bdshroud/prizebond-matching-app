import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';
import './style.css';
import { createMobileBridge } from './services/mobileBridge';

// If not running inside Electron Desktop shell (e.g. Android Capacitor, PWA, or Web),
// automatically initialize the universal offline storage bridge.
if (!window.electronAPI) {
  window.electronAPI = createMobileBridge();
  console.log('[App] Initialized Android/PWA offline storage bridge');
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
