/**
 * Authentication Pinia store
 * @fileoverview Handles user authentication state and actions using Pinia
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

/**
 * Authentication store using Pinia composition API
 * @returns {Object} Auth store with state, getters, and actions
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  
  // Getters (computed)
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const currentUser = computed(() => user.value);
  
  // Actions
  /**
   * Set authentication data
   * @param {Object} userData - User data
   * @param {string} authToken - Authentication token
   */
  const setAuth = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
  };
  
  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };
  
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} User data
   * @throws {Error} When login fails
   */
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user: userData, token: authToken } = response.data;
      
      setAuth(userData, authToken);
      return userData;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @returns {Promise<Object>} User data
   * @throws {Error} When registration fails
   */
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user: newUser, token: authToken } = response.data;
      
      setAuth(newUser, authToken);
      return newUser;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };
  
  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };
  
  /**
   * Initialize auth state from stored token
   * @returns {Promise<void>}
   */
  const initAuth = async () => {
    if (token.value) {
      try {
        const response = await api.get('/auth/me');
        const userData = response.data;
        setAuth(userData, token.value);
      } catch (error) {
        clearAuth();
      }
    }
  };
  
  // Return store API
  return {
    // State
    user,
    token,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    setAuth,
    clearAuth,
    login,
    register,
    logout,
    initAuth
  };
});