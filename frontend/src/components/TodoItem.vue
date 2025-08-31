<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4" 
       :class="statusColorClass">
    <div class="flex items-start gap-4">
      <!-- Completion Checkbox -->
      <div class="flex-shrink-0 mt-1">
        <button 
          @click="toggleCompletion"
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
          :class="checkboxClass"
          :disabled="isUpdating"
        >
          <svg v-if="item.status === 'completed'" 
               class="w-4 h-4 text-white" 
               fill="currentColor" 
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Item Content -->
      <div class="flex-grow">
        <!-- Editable Title -->
        <div v-if="isEditingTitle" class="mb-2">
          <input
            ref="titleInput"
            v-model="editForm.title"
            @blur="saveTitle"
            @keydown.enter="saveTitle"
            @keydown.esc="cancelEdit"
            class="w-full text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none"
            :class="{ 'line-through text-gray-500': item.status === 'completed' }"
          />
        </div>
        <h3 v-else
            @click="startEditingTitle"
            class="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors" 
            :class="{ 'line-through text-gray-500': item.status === 'completed' }">
          {{ item.title }}
        </h3>
        
        <!-- Status and metadata -->
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span class="px-2 py-1 rounded-full text-xs font-medium" 
                :class="statusBadgeClass">
            {{ statusText }}
          </span>
          
          <span v-if="item.assignedTo">
            👤 Assigned to: {{ item.assignedTo }}
          </span>
          
          <span v-if="item.completed_at && item.status === 'completed'" 
                class="text-green-600">
            ✅ Completed {{ formatDate(item.completed_at) }}
          </span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex-shrink-0 flex gap-2">
        <button 
          @click="removeItem" 
          class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Delete item"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import { useTodosStore } from '../stores/todos';

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    listId: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const todosStore = useTodosStore();
    const isUpdating = ref(false);
    const isEditingTitle = ref(false);
    const titleInput = ref(null);
    
    // Edit form
    const editForm = ref({
      title: props.item.title
    });

    // Reset edit form when item changes
    const resetEditForm = () => {
      editForm.value = {
        title: props.item.title
      };
    };

    // Computed properties for styling
    const statusColorClass = computed(() => {
      switch (props.item.status) {
        case 'completed':
          return 'border-green-500';
        case 'in_progress':
          return 'border-yellow-500';
        default:
          return 'border-blue-500';
      }
    });

    const checkboxClass = computed(() => {
      if (props.item.status === 'completed') {
        return 'bg-green-500 border-green-500';
      }
      return 'border-gray-300 hover:border-green-400';
    });

    const statusBadgeClass = computed(() => {
      switch (props.item.status) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    });

    const statusText = computed(() => {
      switch (props.item.status) {
        case 'completed':
          return 'Completed';
        case 'in_progress':
          return 'In Progress';
        default:
          return 'Pending';
      }
    });

    // Methods
    const toggleCompletion = async () => {
      if (isUpdating.value) return;
      
      isUpdating.value = true;
      try {
        await todosStore.toggleItemCompletion(props.listId, props.item.id);
      } catch (error) {
        console.error('Error toggling completion:', error);
        // You could add a toast notification here
      } finally {
        isUpdating.value = false;
      }
    };

    const removeItem = () => {
      emit('remove', props.item.id);
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Inline editing methods
    const startEditingTitle = async () => {
      if (props.item.status === 'completed') return; // Don't allow editing completed items
      isEditingTitle.value = true;
      resetEditForm();
      await nextTick();
      titleInput.value?.focus();
      titleInput.value?.select();
    };

    const saveTitle = async () => {
      if (!editForm.value.title.trim()) {
        cancelEdit();
        return;
      }

      if (editForm.value.title.trim() === props.item.title) {
        cancelEdit();
        return;
      }

      try {
        isUpdating.value = true;
        await todosStore.updateItem(props.listId, props.item.id, {
          title: editForm.value.title.trim()
        });
        isEditingTitle.value = false;
      } catch (error) {
        console.error('Error updating title:', error);
        resetEditForm();
      } finally {
        isUpdating.value = false;
      }
    };

    const cancelEdit = () => {
      isEditingTitle.value = false;
      resetEditForm();
    };

    return {
      isUpdating,
      isEditingTitle,
      titleInput,
      editForm,
      statusColorClass,
      checkboxClass,
      statusBadgeClass,
      statusText,
      toggleCompletion,
      removeItem,
      formatDate,
      startEditingTitle,
      saveTitle,
      cancelEdit
    };
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>