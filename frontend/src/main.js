/**
 * Main application entry point
 * @fileoverview Vue 3 application setup with Vite, Pinia, and Vue Router
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { pinia } from './stores';
import { useAuthStore } from './stores/auth';
import './assets/styles.css';

// Create Vue application
const app = createApp(App);

// Use plugins
app.use(pinia);
app.use(router);

// Initialize auth state and mount app
const initApp = async () => {
  const authStore = useAuthStore();
  await authStore.initAuth();
  app.mount('#app');
};

initApp();