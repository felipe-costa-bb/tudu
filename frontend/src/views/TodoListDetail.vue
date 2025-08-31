<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button 
              @click="goBack"
              class="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Back to Dashboard"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ currentList?.title || 'Loading...' }}</h1>
              <p class="text-sm text-gray-500">{{ currentList?.description || '' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ currentUser?.username }}</span>
            <button @click="logout" class="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ error }}</h3>
        <button @click="goBack" class="mt-6 btn-primary">
          Back to Dashboard
        </button>
      </div>

      <!-- List Content -->
      <div v-else-if="currentList">
        <!-- Add New Item Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Add New Item</h2>
          <form @submit.prevent="addNewItem" class="flex space-x-3">
            <input 
              v-model="newItemTitle"
              placeholder="What needs to be done?"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :disabled="isAddingItem"
            />
            <button 
              type="submit"
              :disabled="!newItemTitle.trim() || isAddingItem"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg v-if="!isAddingItem" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isAddingItem ? 'Adding...' : 'Add Item' }}
            </button>
          </form>
        </div>

        <!-- Items List -->
        <div v-if="currentList.items && currentList.items.length > 0" class="space-y-3">
          <todo-item
            v-for="item in currentList.items"
            :key="item.id"
            :item="item"
            :list-id="currentList.id"
            @remove="handleRemoveItem"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 12l2 2 4-4"></path>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No items in this list yet</h3>
          <p class="mt-2 text-gray-500">Add your first item using the form above</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTodosStore } from '../stores/todos';
import { useAuthStore } from '../stores/auth';
import TodoItem from '../components/TodoItem.vue';

export default {
  name: 'TodoListDetail',
  components: {
    TodoItem
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todosStore = useTodosStore();
    const authStore = useAuthStore();

    // State
    const isLoading = ref(true);
    const error = ref(null);
    const newItemTitle = ref('');
    const isAddingItem = ref(false);

    // Computed
    const currentUser = computed(() => authStore.user);
    const currentList = computed(() => {
      const listId = parseInt(route.params.id);
      return todosStore.todoLists.find(list => list.id === listId);
    });

    // Methods
    const loadList = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        // If we don't have the lists loaded yet, fetch them
        if (!todosStore.todoLists.length) {
          await todosStore.fetchTodoLists();
        }
        
        // Check if the list exists
        const listId = parseInt(route.params.id);
        const list = todosStore.todoLists.find(l => l.id === listId);
        
        if (!list) {
          error.value = 'Todo list not found';
        }
      } catch (err) {
        console.error('Error loading list:', err);
        error.value = 'Failed to load todo list';
      } finally {
        isLoading.value = false;
      }
    };

    const addNewItem = async () => {
      if (!newItemTitle.value.trim()) return;
      
      try {
        isAddingItem.value = true;
        await todosStore.addItem(currentList.value.id, {
          title: newItemTitle.value.trim()
        });
        newItemTitle.value = '';
      } catch (error) {
        console.error('Error adding item:', error);
      } finally {
        isAddingItem.value = false;
      }
    };

    const handleRemoveItem = async (itemId) => {
      try {
        await todosStore.removeItem(currentList.value.id, itemId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    };

    const goBack = () => {
      router.push('/dashboard');
    };

    const logout = async () => {
      await authStore.logout();
      router.push('/');
    };

    // Lifecycle
    onMounted(() => {
      loadList();
    });

    return {
      isLoading,
      error,
      newItemTitle,
      isAddingItem,
      currentUser,
      currentList,
      loadList,
      addNewItem,
      handleRemoveItem,
      goBack,
      logout
    };
  }
};
</script>

<style scoped>
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>
