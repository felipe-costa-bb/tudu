
<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
    <div class="card max-w-md w-full mx-4 p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Sign up for your TuDu account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input 
            type="text" 
            id="username"
            v-model="username" 
            class="input-field"
            placeholder="Choose a username"
            required 
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input 
            type="email" 
            id="email"
            v-model="email" 
            class="input-field"
            placeholder="Enter your email"
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
            placeholder="Create a password"
            required 
          />
        </div>
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
        <button type="submit" class="w-full btn-primary">
          Register
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
            Login here
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
  name: 'Register',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const handleRegister = async () => {
      if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
        errorMessage.value = 'Please fill in all fields';
        return;
      }
      errorMessage.value = '';
      try {
        await authStore.register({ 
          username: username.value.trim(), 
          email: email.value.trim(), 
          password: password.value 
        });
        await router.push('/dashboard');
      } catch (error) {
        errorMessage.value = 'Registration failed. Please try again.';
      }
    };

    return {
      username,
      email,
      password,
      errorMessage,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
}
</style>
