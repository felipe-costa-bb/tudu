<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
    <div class="card max-w-md w-full mx-4 p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to your TuDu account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input 
            type="text" 
            id="username"
            v-model="username" 
            class="input-field"
            placeholder="Enter your username"
            required 
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input 
            type="password" 
            id="password"
            v-model="password" 
            class="input-field"
            placeholder="Enter your password"
            required 
          />
        </div>
        
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
        
        <button type="submit" class="w-full btn-primary" :disabled="isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Create one here
          </router-link>
        </p>
      </div>
      
      <div class="mt-8 text-center">
        <router-link to="/" class="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    
    const handleLogin = async () => {
      if (!username.value.trim() || !password.value.trim()) {
        errorMessage.value = 'Please fill in all fields';
        return;
      }
      
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        await authStore.login({ 
          username: username.value.trim(), 
          password: password.value 
        });
        // Explicitly navigate to dashboard after successful login
        await router.push('/dashboard');
      } catch (error) {
        errorMessage.value = 'Invalid username or password';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      username,
      password,
      errorMessage,
      isLoading,
      handleLogin
    };
  }
};
</script>