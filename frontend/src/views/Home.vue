<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="card p-8 max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to TuDu</h1>
          <p class="text-xl text-gray-600">
            The collaborative todo list app that helps you organize tasks and work together seamlessly
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Organize Tasks</h3>
            <p class="text-sm text-gray-600">Create and manage your todo lists efficiently</p>
          </div>
          
          <div class="text-center">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Collaborate</h3>
            <p class="text-sm text-gray-600">Share lists and work together with your team</p>
          </div>
          
          <div class="text-center">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Stay Productive</h3>
            <p class="text-sm text-gray-600">Track progress and get things done faster</p>
          </div>
        </div>
        
        <div v-if="!isAuthenticated" class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link to="/login" class="btn-primary">
              Get Started
            </router-link>
            <router-link to="/register" class="btn-secondary">
              Create Account
            </router-link>
          </div>
          <p class="text-sm text-gray-500">
            Already have an account? 
            <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </router-link>
          </p>
        </div>
        
        <div v-else class="space-y-4">
          <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p class="text-primary-800">
              <strong>Welcome back, {{ currentUser?.username }}!</strong>
            </p>
            <p class="text-primary-600 text-sm mt-1">
              Ready to tackle your tasks today?
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link to="/dashboard" class="btn-primary">
              Go to Dashboard
            </router-link>
            <button @click="logout" class="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore();
    
    const logout = async () => {
      await authStore.logout();
    };
    
    return {
      isAuthenticated: authStore.isAuthenticated,
      currentUser: authStore.currentUser,
      logout
    };
  }
}
</script>

.login-btn, .dashboard-btn {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin: 10px;
}

.login-btn:hover, .dashboard-btn:hover {
  background-color: #0056b3;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

