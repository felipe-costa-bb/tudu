<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <dashboard-header 
      :current-user="currentUser"
      @logout="logout"
    />

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
      <loading-spinner v-if="todosStore.isLoading" />

      <!-- Empty State -->
      <empty-state 
        v-else-if="todoLists.length === 0" 
        @create-list="showCreateModal = true"
      />

      <!-- Todo Lists Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <todo-list-card
          v-for="list in todoLists" 
          :key="list.id" 
          :list="list"
          :is-adding-item="addingItems[list.id] || false"
          @share="shareList"
          @delete="deleteList"
          @add-item="handleAddQuickItem"
          @remove-item="handleRemoveItem"
        />
      </div>
    </main>

    <!-- Create Todo List Modal -->
    <create-list-modal
      v-if="showCreateModal"
      :is-creating="todosStore.isCreating"
      @submit="createTodoList"
      @cancel="showCreateModal = false"
    />

    <!-- Share Modal -->
    <share-list-modal
      v-if="showShareModal && listToShare"
      :list-title="listToShare.title"
      :is-sharing="todosStore.isSharing"
      @submit="handleShareSubmit"
      @cancel="cancelShare"
    />

    <!-- Delete Confirmation Modal -->
    <delete-confirm-modal
      v-if="showDeleteModal && listToDelete"
      :list-title="listToDelete.title"
      :is-deleting="deletingList"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTodosStore } from '../stores/todos';
import { useAuthStore } from '../stores/auth';
import DashboardHeader from '../components/DashboardHeader.vue';
import TodoListCard from '../components/TodoListCard.vue';
import CreateListModal from '../components/CreateListModal.vue';
import ShareListModal from '../components/ShareListModal.vue';
import DeleteConfirmModal from '../components/DeleteConfirmModal.vue';
import EmptyState from '../components/EmptyState.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'Dashboard',
  components: {
    DashboardHeader,
    TodoListCard,
    CreateListModal,
    ShareListModal,
    DeleteConfirmModal,
    EmptyState,
    LoadingSpinner
  },
  setup() {
    const router = useRouter();
    const todosStore = useTodosStore();
    const authStore = useAuthStore();

    // State
    const showCreateModal = ref(false);
    const showShareModal = ref(false);
    const showDeleteModal = ref(false);
    const listToShare = ref(null);
    const listToDelete = ref(null);
    
    // Quick add item forms for each list
    const addingItems = ref({});
    const deletingList = ref(false);

    // Computed
    const currentUser = computed(() => authStore.user);
    const todoLists = computed(() => todosStore.todoLists || []);

    // Methods
    const createTodoList = async (formData) => {
      const success = await todosStore.createTodoList(formData);
      
      if (success) {
        showCreateModal.value = false;
      }
    };

    const shareList = (list) => {
      listToShare.value = list;
      showShareModal.value = true;
    };

    const handleShareSubmit = async (username) => {
      const success = await todosStore.shareTodoList(listToShare.value.id, username);
      if (success) {
        window.alert('List shared successfully!');
        showShareModal.value = false;
        listToShare.value = null;
      } else {
        window.alert('Failed to share list.');
      }
    };

    const cancelShare = () => {
      showShareModal.value = false;
      listToShare.value = null;
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

    const handleAddQuickItem = async ({ listId, item }) => {
      try {
        addingItems.value[listId] = true;
        await todosStore.addItem(listId, item);
      } catch (error) {
        console.error('Error adding item:', error);
      } finally {
        addingItems.value[listId] = false;
      }
    };

    const handleRemoveItem = async (itemId) => {
      try {
        // Find which list contains this item
        for (const list of todoLists.value) {
          if (list.items && list.items.some(item => item.id === itemId)) {
            await todosStore.removeItem(list.id, itemId);
            break;
          }
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    };


    const logout = async () => {
      await authStore.logout();
      router.push('/');
    };

    // Lifecycle
    onMounted(() => {
      todosStore.fetchTodoLists();
    });

    return {
      // Reactive data
      showCreateModal,
      showShareModal,
      showDeleteModal,
      listToShare,
      listToDelete,
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
      shareList,
      handleShareSubmit,
      cancelShare,
      deleteList,
      confirmDelete,
      cancelDelete,
      handleAddQuickItem,
      handleRemoveItem,
      logout
    };
  }
};
</script>
