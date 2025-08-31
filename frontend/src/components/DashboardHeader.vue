<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">TuDu</h1>
          <span class="ml-4 text-sm text-gray-500">Collaborative Todo Lists</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">Welcome, {{ currentUser?.username }}</span>
          <button @click="$emit('logout')" class="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'DashboardHeader',
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  emits: ['logout']
};
</script>
