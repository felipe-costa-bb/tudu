/**
 * Pinia store configuration
 * @fileoverview Central store setup for the Todo application using Pinia
 */

import { createPinia } from 'pinia';

/**
 * Creates and configures the main Pinia store
 * @returns {Object} The configured Pinia instance
 */
export const pinia = createPinia();

export default pinia;
