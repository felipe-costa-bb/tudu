<template>
  <div class="text-center py-16">
    <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">No todo lists yet</h3>
    <p class="mt-2 text-gray-500">Get started by creating your first todo list</p>
    <button @click="$emit('create-list')" class="mt-6 btn-primary">
      Create Your First List
    </button>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  emits: ['create-list']
};
</script>
