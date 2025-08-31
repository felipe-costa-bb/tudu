<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Share "{{ listTitle }}"</h3>
      </div>
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="shareUsername" class="block text-sm font-medium text-gray-700 mb-2">
              Username to share with
            </label>
            <input 
              v-model="username"
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
              @click="handleCancel"
              class="btn-secondary"
              :disabled="isSharing"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="!username.trim() || isSharing"
            >
              <span v-if="isSharing">Sharing...</span>
              <span v-else>Share List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ShareListModal',
  props: {
    listTitle: {
      type: String,
      required: true
    },
    isSharing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const username = ref('');

    const handleSubmit = () => {
      if (!username.value.trim()) return;
      emit('submit', username.value.trim());
    };

    const handleCancel = () => {
      username.value = '';
      emit('cancel');
    };

    return {
      username,
      handleSubmit,
      handleCancel
    };
  }
};
</script>
