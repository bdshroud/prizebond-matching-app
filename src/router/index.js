import { createRouter, createWebHashHistory } from 'vue-router';

// Lazy load views for high performance desktop rendering
const DashboardView = () => import('../views/DashboardView.vue');
const BondsView = () => import('../views/BondsView.vue');
const DrawsView = () => import('../views/DrawsView.vue');
const CheckerView = () => import('../views/CheckerView.vue');
const HistoryView = () => import('../views/HistoryView.vue');
const RulesView = () => import('../views/RulesView.vue');
const ReportsView = () => import('../views/ReportsView.vue');
const ImportExportView = () => import('../views/ImportExportView.vue');
const SettingsView = () => import('../views/SettingsView.vue');
const AboutView = () => import('../views/AboutView.vue');

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/bonds', name: 'bonds', component: BondsView },
  { path: '/draws', name: 'draws', component: DrawsView },
  { path: '/checker', name: 'checker', component: CheckerView },
  { path: '/history', name: 'history', component: HistoryView },
  { path: '/rules', name: 'rules', component: RulesView },
  { path: '/reports', name: 'reports', component: ReportsView },
  { path: '/import-export', name: 'import-export', component: ImportExportView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/about', name: 'about', component: AboutView }
];

export const router = createRouter({
  history: createWebHashHistory(), // Safe for Electron file:// protocol
  routes
});
