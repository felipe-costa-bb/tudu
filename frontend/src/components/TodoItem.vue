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
        <h3 class="text-lg font-semibold text-gray-800 mb-2" 
            :class="{ 'line-through text-gray-500': item.status === 'completed' }">
          {{ item.title }}
        </h3>
        
        <p class="text-gray-600 mb-3" 
           :class="{ 'line-through text-gray-400': item.status === 'completed' }">
          {{ item.description }}
        </p>
        
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
          @click="editItem" 
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Edit
        </button>
        <button 
          @click="removeItem" 
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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

    const editItem = () => {
      emit('edit', props.item);
    };

    const removeItem = () => {
      emit('remove', props.item.id);
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return {
      isUpdating,
      statusColorClass,
      checkboxClass,
      statusBadgeClass,
      statusText,
      toggleCompletion,
      editItem,
      removeItem,
      formatDate
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