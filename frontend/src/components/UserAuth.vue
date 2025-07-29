<template>
  <div class="user-auth">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username:</label>
        <input 
          id="username"
          type="text" 
          v-model="username" 
          :disabled="isLoading"
          required 
        />
      </div>
      <div class="form-group" v-if="!isLogin">
        <label for="email">Email:</label>
        <input 
          id="email"
          type="email" 
          v-model="email" 
          :disabled="isLoading"
          :required="!isLogin" 
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          type="password" 
          v-model="password" 
          :disabled="isLoading"
          required 
        />
      </div>
      <div class="form-actions">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="submit-btn"
        >
          <span v-if="isLoading">{{ isLogin ? 'Logging in...' : 'Registering...' }}</span>
          <span v-else>{{ isLogin ? 'Login' : 'Register' }}</span>
        </button>
        <button 
          type="button" 
          @click="toggleAuthMode"
          :disabled="isLoading"
          class="toggle-btn"
        >
          {{ isLogin ? 'Switch to Register' : 'Switch to Login' }}
        </button>
      </div>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
/**
 * UserAuth Component - Handles user authentication (login/register)
 * @vue-component
 * @example
 * <UserAuth />
 */

import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'UserAuth',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const isLogin = ref(true);
    const errorMessage = ref('');
    const isLoading = ref(false);

    /**
     * Handle form submission for login/register
     */
    const handleSubmit = async () => {
      if (isLoading.value) return;
      
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        if (isLogin.value) {
          await authStore.login({ 
            username: username.value, 
            password: password.value 
          });
        } else {
          await authStore.register({ 
            username: username.value, 
            email: email.value, 
            password: password.value 
          });
        }
        
        // Clear fields after successful authentication
        username.value = '';
        email.value = '';
        password.value = '';
        
        // Redirect to dashboard
        router.push('/dashboard');
        
      } catch (error) {
        console.error('Authentication error:', error);
        // Handle different error structures
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else if (error.message) {
          errorMessage.value = error.message;
        } else {
          errorMessage.value = 'An error occurred during authentication';
        }
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Toggle between login and register modes
     */
    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value;
      errorMessage.value = '';
    };

    return {
      username,
      email,
      password,
      isLogin,
      errorMessage,
      isLoading,
      handleSubmit,
      toggleAuthMode,
    };
  },
};
</script>

<style scoped>
.user-auth {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-auth h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn:hover:not(:disabled) {
  background-color: #3498db;
  color: white;
}

.toggle-btn:disabled {
  color: #bdc3c7;
  border-color: #bdc3c7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  background-color: #fdf2f2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}
</style>