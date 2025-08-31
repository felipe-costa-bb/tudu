<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Create New Todo List</h3>
      </div>
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              List Title *
            </label>
            <input 
              v-model="form.title"
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
              v-model="form.description"
              id="description"
              rows="3"
              class="input-field resize-none"
              placeholder="Add a description..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="handleCancel"
              class="btn-secondary"
              :disabled="isCreating"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="!form.title.trim() || isCreating"
            >
              <span v-if="isCreating">Creating...</span>
              <span v-else>Create List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'CreateListModal',
  props: {
    isCreating: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const titleInput = ref(null);
    const form = ref({
      title: '',
      description: ''
    });

    const handleSubmit = () => {
      if (!form.value.title.trim()) return;
      
      emit('submit', {
        title: form.value.title.trim(),
        description: form.value.description.trim() || undefined
      });
    };

    const handleCancel = () => {
      form.value = { title: '', description: '' };
      emit('cancel');
    };

    const focusTitle = async () => {
      await nextTick();
      if (titleInput.value) {
        titleInput.value.focus();
      }
    };

    onMounted(() => {
      focusTitle();
    });

    return {
      titleInput,
      form,
      handleSubmit,
      handleCancel
    };
  }
};
</script>
