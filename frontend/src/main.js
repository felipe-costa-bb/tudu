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

// Initialize auth state before setting up router
const initApp = async () => {
  const authStore = useAuthStore();
  
  // Initialize auth state from stored token
  await authStore.initAuth();
  
  // Now set up router (this ensures auth state is ready for router guards)
  app.use(router);
  
  // Mount the app
  app.mount('#app');
};

initApp();