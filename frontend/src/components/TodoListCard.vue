<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-8 group hover:shadow-lg transition-shadow duration-200">
    <!-- Card Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate">{{ list.title }}</h3>
        <p v-if="list.description" class="text-gray-600 text-sm mb-4">{{ list.description }}</p>
      </div>
      <div class="flex items-center space-x-2 ml-4">
        <button 
          @click="$emit('share', list)" 
          class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          title="Share list"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
        </button>
        <button 
          @click="$emit('delete', list)" 
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
      <!-- Todo Items List -->
      <div class="space-y-2">
        <div v-if="list.items && list.items.length > 0" class="space-y-2">
          <todo-item
            v-for="item in list.items"
            :key="item.id"
            :item="item"
            :list-id="list.id"
            @remove="$emit('remove-item', $event)"
          />
        </div>
        
        <!-- Quick Add Item -->
        <div class="mt-3">
          <form @submit.prevent="handleAddQuickItem" class="flex space-x-2">
            <input 
              v-model="quickItemText"
              :placeholder="`Add item to ${list.title}...`"
              class="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @keyup.enter="handleAddQuickItem"
            />
            <button 
              type="submit"
              :disabled="!quickItemText?.trim() || isAddingItem"
              class="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="!isAddingItem" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</template>

<script>
import { ref } from 'vue';
import TodoItem from './TodoItem.vue';

export default {
  name: 'TodoListCard',
  components: {
    TodoItem
  },
  props: {
    list: {
      type: Object,
      required: true
    },
    isAddingItem: {
      type: Boolean,
      default: false
    }
  },
  emits: ['share', 'delete', 'add-item', 'remove-item'],
  setup(props, { emit }) {
    const quickItemText = ref('');

    const handleAddQuickItem = () => {
      const itemTitle = quickItemText.value;
      if (!itemTitle?.trim()) return;
      
      emit('add-item', {
        listId: props.list.id,
        item: {
          title: itemTitle.trim(),
          completed: false
        }
      });
      
      quickItemText.value = '';
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    };

    return {
      quickItemText,
      handleAddQuickItem,
      formatDate
    };
  }
};
</script>
