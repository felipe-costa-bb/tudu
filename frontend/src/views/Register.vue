<template>
  <div class="register">
    <h1>Register</h1>
    <p style="color: #4CAF50; font-weight: bold;">✅ Hot Reload is Working! Changes update automatically.</p>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <router-link to="/login">Already have an account? Login here</router-link>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    return {
      authStore
    };
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        await this.authStore.register({ 
          username: this.username, 
          email: this.email, 
          password: this.password 
        });
        this.$router.push('/dashboard');
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }
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
