<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">TuDu</h1>
            <span class="ml-4 text-sm text-gray-500">Collaborative Todo Lists</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {{ currentUser?.username }}</span>
            <button @click="logout" class="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Title and Create Button -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Your Todo Lists</h2>
          <p class="mt-2 text-gray-600">Organize your tasks and collaborate with others</p>
        </div>
        <button @click="showCreateModal = true" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New List
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="todosStore.isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="todoLists.length === 0" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No todo lists yet</h3>
        <p class="mt-2 text-gray-500">Get started by creating your first todo list</p>
        <button @click="showCreateModal = true" class="mt-6 btn-primary">
          Create Your First List
        </button>
      </div>

      <!-- Todo Lists Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="list in todoLists" 
          :key="list.id" 
          class="card group hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ list.title }}</h3>
              <p v-if="list.description" class="text-gray-600 text-sm mb-4">{{ list.description }}</p>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <button 
                @click="shareList(list)" 
                class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Share list"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
              <button 
                @click="deleteList(list)" 
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete list"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="space-y-3">
            <!-- Todo Items Preview -->
            <div class="space-y-2">
              <div v-if="list.items && list.items.length > 0" class="space-y-1">
                <div 
                  v-for="item in list.items.slice(0, 3)" 
                  :key="item.id"
                  class="flex items-center text-sm text-gray-600"
                >
                  <svg 
                    class="w-3 h-3 mr-2 flex-shrink-0" 
                    :class="item.completed ? 'text-green-500' : 'text-gray-300'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span :class="item.completed ? 'line-through text-gray-400' : ''">{{ item.title }}</span>
                </div>
                <div v-if="list.items.length > 3" class="text-xs text-gray-400 ml-5">
                  +{{ list.items.length - 3 }} more items
                </div>
              </div>
              
              <!-- Quick Add Item -->
              <div class="mt-3">
                <form @submit.prevent="addQuickItem(list.id)" class="flex space-x-2">
                  <input 
                    v-model="quickItemForms[list.id]"
                    :placeholder="`Add item to ${list.title}...`"
                    class="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    @keyup.enter="addQuickItem(list.id)"
                  />
                  <button 
                    type="submit"
                    :disabled="!quickItemForms[list.id]?.trim() || addingItems[list.id]"
                    class="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="!addingItems[list.id]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
            
            <!-- List Stats -->
            <div class="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                {{ list.items?.length || 0 }} items
              </div>
              <div class="text-xs text-gray-400">
                Created {{ formatDate(list.created_at) }}
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <router-link 
              :to="`/todos/${list.id}`" 
              class="btn-primary w-full text-center"
            >
              Open List
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Todo List Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Create New Todo List</h3>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="createTodoList">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                List Title *
              </label>
              <input 
                v-model="newListForm.title"
                ref="titleInput"
                id="title"
                type="text" 
                required
                class="input-field"
                placeholder="Enter list title..."
              >
            </div>
            <div class="mb-6">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea 
                v-model="newListForm.description"
                id="description"
                rows="3"
                class="input-field resize-none"
                placeholder="Add a description..."
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="cancelCreate"
                class="btn-secondary"
                :disabled="todosStore.isCreating"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="!newListForm.title.trim() || todosStore.isCreating"
              >
                <span v-if="todosStore.isCreating">Creating...</span>
                <span v-else>Create List</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal && listToShare" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Share "{{ listToShare.title }}"</h3>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="shareTodoList">
            <div class="mb-6">
              <label for="shareUsername" class="block text-sm font-medium text-gray-700 mb-2">
                Username to share with
              </label>
              <input 
                v-model="shareForm.username"
                id="shareUsername"
                type="text" 
                required
                class="input-field"
                placeholder="Enter username..."
              >
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="cancelShare"
                class="btn-secondary"
                :disabled="todosStore.isSharing"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="!shareForm.username.trim() || todosStore.isSharing"
              >
                <span v-if="todosStore.isSharing">Sharing...</span>
                <span v-else>Share List</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal && listToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Delete Todo List</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "<strong>{{ listToDelete.title }}</strong>"? 
            This action cannot be undone and all items in this list will be permanently deleted.
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="cancelDelete"
              class="btn-secondary"
              :disabled="deletingList"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              :disabled="deletingList"
            >
              <span v-if="deletingList">Deleting...</span>
              <span v-else>Delete List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useTodosStore } from '../stores/todos';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const todosStore = useTodosStore();
    const authStore = useAuthStore();
    const titleInput = ref(null);

    // State
    const showCreateModal = ref(false);
    const showShareModal = ref(false);
    const showDeleteModal = ref(false);
    const listToShare = ref(null);
    const listToDelete = ref(null);
    
    const newListForm = ref({
      title: '',
      description: ''
    });
    
    const shareForm = ref({
      username: ''
    });

    // Quick add item forms for each list
    const quickItemForms = ref({});
    const addingItems = ref({});
    const deletingList = ref(false);

    // Computed
    const currentUser = computed(() => authStore.user);
    const todoLists = computed(() => todosStore.todoLists || []);

    // Methods
    const createTodoList = async () => {
      if (!newListForm.value.title.trim()) return;
      
      const success = await todosStore.createTodoList({
        title: newListForm.value.title.trim(),
        description: newListForm.value.description.trim() || undefined
      });
      
      if (success) {
        showCreateModal.value = false;
        newListForm.value = { title: '', description: '' };
      }
    };

    const cancelCreate = () => {
      showCreateModal.value = false;
      newListForm.value = { title: '', description: '' };
    };

    const shareList = (list) => {
      listToShare.value = list;
      shareForm.value.username = '';
      showShareModal.value = true;
    };

    const shareTodoList = async () => {
      if (!shareForm.value.username.trim()) return;
      
      const success = await todosStore.shareTodoList(
        listToShare.value.id, 
        shareForm.value.username.trim()
      );
      
      if (success) {
        showShareModal.value = false;
        listToShare.value = null;
        shareForm.value.username = '';
      }
    };

    const cancelShare = () => {
      showShareModal.value = false;
      listToShare.value = null;
      shareForm.value.username = '';
    };

    const deleteList = (list) => {
      listToDelete.value = list;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      try {
        deletingList.value = true;
        await todosStore.removeTodoList(listToDelete.value.id);
        showDeleteModal.value = false;
        listToDelete.value = null;
      } catch (error) {
        console.error('Error deleting todo list:', error);
        // You could add error handling here, like showing a toast notification
      } finally {
        deletingList.value = false;
      }
    };

    const cancelDelete = () => {
      showDeleteModal.value = false;
      listToDelete.value = null;
    };

    const addQuickItem = async (listId) => {
      const itemTitle = quickItemForms.value[listId];
      if (!itemTitle?.trim()) return;
      
      try {
        addingItems.value[listId] = true;
        await todosStore.addItem(listId, {
          title: itemTitle.trim(),
          completed: false
        });
        
        quickItemForms.value[listId] = '';
        // The local state is already updated by the store's addItem method
      } catch (error) {
        console.error('Error adding item:', error);
      } finally {
        addingItems.value[listId] = false;
      }
    };

    const logout = async () => {
      await authStore.logout();
      router.push('/');
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    };

    const focusTitle = async () => {
      await nextTick();
      if (titleInput.value) {
        titleInput.value.focus();
      }
    };

    // Lifecycle
    onMounted(() => {
      todosStore.fetchTodoLists();
    });

    return {
      // Refs
      titleInput,
      
      // Reactive data
      showCreateModal,
      showShareModal,
      showDeleteModal,
      listToShare,
      listToDelete,
      newListForm,
      shareForm,
      quickItemForms,
      addingItems,
      deletingList,
      
      // Stores
      todosStore,
      authStore,
      
      // Computed
      currentUser,
      todoLists,
      
      // Methods
      createTodoList,
      cancelCreate,
      shareList,
      shareTodoList,
      cancelShare,
      deleteList,
      confirmDelete,
      cancelDelete,
      addQuickItem,
      logout,
      formatDate,
      focusTitle
    };
  },
  
  watch: {
    showCreateModal(newVal) {
      if (newVal) {
        this.focusTitle();
      }
    }
  }
};
</script>
