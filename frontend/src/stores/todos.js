/**
 * Todos Pinia store
 * @fileoverview Handles todo lists and items state and actions using Pinia
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

/**
 * Todos store using Pinia composition API
 * @returns {Object} Todos store with state, getters, and actions
 */
export const useTodosStore = defineStore('todos', () => {
  // State
  const todoLists = ref([]);
  const currentTodoList = ref(null);
  const loading = ref(false);
  
  // Getters (computed)
  const allTodoLists = computed(() => todoLists.value);
  const isLoading = computed(() => loading.value);
  
  // Actions
  /**
   * Set loading state
   * @param {boolean} isLoading - Loading status
   */
  const setLoading = (isLoading) => {
    loading.value = isLoading;
  };
  
  /**
   * Set todo lists
   * @param {Array} lists - Array of todo lists
   */
  const setTodoLists = (lists) => {
    todoLists.value = lists;
  };
  
  /**
   * Add new todo list
   * @param {Object} list - New todo list
   */
  const addTodoList = (list) => {
    todoLists.value.push(list);
  };
  
  /**
   * Update todo list
   * @param {Object} updatedList - Updated todo list
   */
  const updateTodoList = (updatedList) => {
    const index = todoLists.value.findIndex(list => list.id === updatedList.id);
    if (index !== -1) {
      todoLists.value[index] = updatedList;
    }
  };
  
  /**
   * Remove todo list
   * @param {number} listId - Todo list ID to remove
   */
  const removeTodoListById = (listId) => {
    const index = todoLists.value.findIndex(list => list.id === listId);
    if (index !== -1) {
      todoLists.value.splice(index, 1);
    }
  };
  
  /**
   * Set current todo list
   * @param {Object} list - Todo list to set as current
   */
  const setCurrentTodoList = (list) => {
    currentTodoList.value = list;
  };
  
  /**
   * Fetch all todo lists for the user
   * @returns {Promise<Array>} Array of todo lists
   */
  const fetchTodoLists = async () => {
    setLoading(true);
    try {
      const response = await api.get('/todos');
      setTodoLists(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo lists:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Create a new todo list
   * @param {Object} listData - Todo list data
   * @param {string} listData.title - List title
   * @param {string} [listData.description] - List description
   * @returns {Promise<Object>} Created todo list
   */
  const createTodoList = async (listData) => {
    try {
      const response = await api.post('/todos', listData);
      addTodoList(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating todo list:', error);
      throw error;
    }
  };
  
  /**
   * Update a todo list
   * @param {number} id - List ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated todo list
   */
  const updateTodoListById = async (id, data) => {
    try {
      const response = await api.put(`/todos/${id}`, data);
      updateTodoList(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating todo list:', error);
      throw error;
    }
  };
  
  /**
   * Remove a todo list
   * @param {number} listId - Todo list ID
   * @returns {Promise<void>}
   */
  const removeTodoList = async (listId) => {
    try {
      await api.delete(`/todos/${listId}`);
      removeTodoListById(listId);
    } catch (error) {
      console.error('Error removing todo list:', error);
      throw error;
    }
  };
  
  /**
   * Add item to a todo list
   * @param {number} listId - Todo list ID
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} Created item
   */
  const addItem = async (listId, itemData) => {
    try {
      const response = await api.post(`/todos/${listId}/items`, itemData);
      // Update the local list with the new item
      const list = todoLists.value.find(list => list.id === listId);
      if (list) {
        // Initialize items array if it doesn't exist
        if (!list.items) {
          list.items = [];
        }
        list.items.push(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };
  
  /**
   * Update a todo item
   * @param {number} itemId - Item ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated item
   */
  const updateItem = async (itemId, data) => {
    try {
      const response = await api.put(`/items/${itemId}`, data);
      // Update the local item in the appropriate list
      for (const list of todoLists.value) {
        if (list.items) {
          const itemIndex = list.items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            list.items[itemIndex] = response.data;
            break;
          }
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };
  
  /**
   * Remove an item from a todo list
   * @param {number} listId - Todo list ID
   * @param {number} itemId - Item ID
   * @returns {Promise<void>}
   */
  const removeItem = async (listId, itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      // Remove the item from local state
      const list = todoLists.value.find(list => list.id === listId);
      if (list && list.items) {
        const itemIndex = list.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          list.items.splice(itemIndex, 1);
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };
  
  /**
   * Share a todo list with users
   * @param {number} listId - Todo list ID
   * @param {Array} userIds - Array of user IDs to share with
   * @returns {Promise<void>}
   */
  const shareTodoList = async (listId, userIds) => {
    try {
      await api.post(`/todos/${listId}/share`, { userIds });
    } catch (error) {
      console.error('Error sharing todo list:', error);
      throw error;
    }
  };
  
  /**
   * Assign an item to a user
   * @param {number} itemId - Item ID
   * @param {number} userId - User ID to assign to
   * @returns {Promise<void>}
   */
  const assignItemToUser = async (itemId, userId) => {
    try {
      await api.patch(`/items/${itemId}/assign`, { userId });
    } catch (error) {
      console.error('Error assigning item:', error);
      throw error;
    }
  };
  
  // Return store API
  return {
    // State
    todoLists,
    currentTodoList,
    loading,
    
    // Getters
    allTodoLists,
    isLoading,
    
    // Actions
    setLoading,
    setTodoLists,
    addTodoList,
    updateTodoList,
    removeTodoListById,
    setCurrentTodoList,
    fetchTodoLists,
    createTodoList,
    updateTodoListById,
    removeTodoList,
    addItem,
    updateItem,
    removeItem,
    shareTodoList,
    assignItemToUser
  };
});