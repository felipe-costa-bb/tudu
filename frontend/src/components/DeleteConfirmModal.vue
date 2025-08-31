<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Delete Todo List</h3>
      </div>
      <div class="px-6 py-4">
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{{ listTitle }}</strong>"? 
          This action cannot be undone and all items in this list will be permanently deleted.
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('cancel')"
            class="btn-secondary"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button 
            @click="$emit('confirm')"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete List</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmModal',
  props: {
    listTitle: {
      type: String,
      required: true
    },
    isDeleting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel']
};
</script>
