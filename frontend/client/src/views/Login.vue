<template>
  <div class="login-container">
    <div class="form-container">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'login' }" 
          @click="activeTab = 'login'"
        >
          Login
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'register' }" 
          @click="activeTab = 'register'"
        >
          Register
        </div>
      </div>
      
      <div class="form-content" v-if="activeTab === 'login'">
        <form @submit.prevent="handleLogin">
          <base-input
            id="login-email"
            v-model="loginForm.email"
            label="Email"
            type="email"
            :error="loginErrors.email"
            required
          />
          
          <base-input
            id="login-password"
            v-model="loginForm.password"
            label="Password"
            type="password"
            :error="loginErrors.password"
            required
          >
            <template #icon>
              <button 
                type="button" 
                class="toggle-password"
                @click="togglePasswordVisibility('login')"
              >
                <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </template>
          </base-input>
          
          <div class="form-actions">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="loginForm.remember">
              <label for="remember">Remember me</label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>
          
          <base-button type="submit" :loading="loading">Login</base-button>
        </form>
      </div>
      
      <div class="form-content" v-if="activeTab === 'register'">
        <form @submit.prevent="handleRegister">
          <base-input
            id="register-username"
            v-model="registerForm.username"
            label="Username"
            :error="registerErrors.username"
            required
          />
          
          <base-input
            id="register-email"
            v-model="registerForm.email"
            label="Email"
            type="email"
            :error="registerErrors.email"
            required
          />
          
          <base-input
            id="register-password"
            v-model="registerForm.password"
            label="Password"
            :type="showRegisterPassword ? 'text' : 'password'"
            :error="registerErrors.password"
            required
          >
            <template #icon>
              <button 
                type="button" 
                class="toggle-password"
                @click="togglePasswordVisibility('register')"
              >
                <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </template>
          </base-input>
          
          <base-input
            id="register-confirm-password"
            v-model="registerForm.password2"
            label="Confirm Password"
            :type="showRegisterPassword ? 'text' : 'password'"
            :error="registerErrors.password2"
            required
          />
          
          <div class="terms">
            <input type="checkbox" id="terms" v-model="registerForm.acceptTerms">
            <label for="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
          </div>
          
          <base-button type="submit" :loading="loading">Register</base-button>
        </form>
      </div>
    </div>
    
    <!-- Dialog for messages -->
    <base-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :type="dialog.type"
      @close="closeDialog"
    >
      <div v-if="typeof dialog.message === 'object'">
        <div v-for="(messages, key) in dialog.message" :key="key" class="dialog-error">
          <strong>{{ key }}:</strong> {{ Array.isArray(messages) ? messages.join(', ') : messages }}
        </div>
      </div>
      <div v-else :class="`dialog-${dialog.type}`">
        {{ dialog.message }}
      </div>
    </base-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseDialog from '@/components/common/BaseDialog.vue';
import { validateEmail, validatePassword } from '@/utils/validators';

export default {
  name: 'LoginView',
  components: {
    BaseInput,
    BaseButton,
    BaseDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const activeTab = ref('login');
    const loading = ref(false);
    const showLoginPassword = ref(false);
    const showRegisterPassword = ref(false);
    
    const loginForm = reactive({
      email: '',
      password: '',
      remember: false
    });
    
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      password2: '',
      acceptTerms: false
    });
    
    const loginErrors = reactive({
      email: '',
      password: ''
    });
    
    const registerErrors = reactive({
      username: '',
      email: '',
      password: '',
      password2: ''
    });
    
    const dialog = reactive({
      show: false,
      title: '',
      message: '',
      type: 'info' // info, success, error
    });
    
    const validateLoginForm = () => {
      let isValid = true;
      
      // Reset errors
      loginErrors.email = '';
      loginErrors.password = '';
      
      // Validate email
      if (!loginForm.email) {
        loginErrors.email = 'Email is required';
        isValid = false;
      } else if (!validateEmail(loginForm.email)) {
        loginErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Validate password
      if (!loginForm.password) {
        loginErrors.password = 'Password is required';
        isValid = false;
      }
      
      return isValid;
    };
    
    const validateRegisterForm = () => {
      let isValid = true;
      
      // Reset errors
      registerErrors.username = '';
      registerErrors.email = '';
      registerErrors.password = '';
      registerErrors.password2 = '';
      
      // Validate username
      if (!registerForm.username) {
        registerErrors.username = 'Username is required';
        isValid = false;
      } else if (registerForm.username.length < 3) {
        registerErrors.username = 'Username must be at least 3 characters';
        isValid = false;
      }
      
      // Validate email
      if (!registerForm.email) {
        registerErrors.email = 'Email is required';
        isValid = false;
      } else if (!validateEmail(registerForm.email)) {
        registerErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Validate password
      if (!registerForm.password) {
        registerErrors.password = 'Password is required';
        isValid = false;
      } else if (!validatePassword(registerForm.password)) {
        registerErrors.password = 'Password must be at least 8 characters and include a number and a special character';
        isValid = false;
      }
      
      // Validate password confirmation
      if (!registerForm.password2) {
        registerErrors.password2 = 'Please confirm your password';
        isValid = false;
      } else if (registerForm.password !== registerForm.password2) {
        registerErrors.password2 = 'Passwords do not match';
        isValid = false;
      }
      
      // Validate terms acceptance
      if (!registerForm.acceptTerms) {
        showDialog('Registration Error', 'You must accept the Terms of Service and Privacy Policy', 'error');
        isValid = false;
      }
      
      return isValid;
    };
    
    const handleLogin = async () => {
      if (!validateLoginForm()) return;
      
      loading.value = true;
      
      try {
        await store.dispatch('auth/login', {
          email: loginForm.email,
          password: loginForm.password
        });
        
        router.push('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.response && error.response.data) {
          showDialog('Login Failed', error.response.data, 'error');
        } else {
          showDialog('Login Failed', 'An error occurred during login. Please try again.', 'error');
        }
      } finally {
        loading.value = false;
      }
    };
    
    const handleRegister = async () => {
      if (!validateRegisterForm()) return;
      
      loading.value = true;
      
      try {
        await store.dispatch('auth/register', {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          password2: registerForm.password2
        });
        
        showDialog(
          'Registration Successful',
          'Your account has been created successfully! Please login.',
          'success'
        );
        
        // Reset form and switch to login tab
        registerForm.username = '';
        registerForm.email = '';
        registerForm.password = '';
        registerForm.password2 = '';
        registerForm.acceptTerms = false;
        
        activeTab.value = 'login';
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response && error.response.data) {
          showDialog('Registration Failed', error.response.data, 'error');
        } else {
          showDialog('Registration Failed', 'An error occurred during registration. Please try again.', 'error');
        }
      } finally {
        loading.value = false;
      }
    };
    
    const showDialog = (title, message, type = 'info') => {
      dialog.show = true;
      dialog.title = title;
      dialog.message = message;
      dialog.type = type;
    };
    
    const closeDialog = () => {
      dialog.show = false;
    };
    
    const togglePasswordVisibility = (formType) => {
      if (formType === 'login') {
        showLoginPassword.value = !showLoginPassword.value;
      } else {
        showRegisterPassword.value = !showRegisterPassword.value;
      }
    };
    
    return {
      activeTab,
      loading,
      loginForm,
      registerForm,
      loginErrors,
      registerErrors,
      dialog,
      showLoginPassword,
      showRegisterPassword,
      handleLogin,
      handleRegister,
      closeDialog,
      togglePasswordVisibility
    };
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.form-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tab.active {
  background-color: #f8f9fa;
  border-bottom: 3px solid var(--primary-color);
  color: var(--primary-color);
}

.form-content {
  padding: 30px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  
  input {
    margin-right: 8px;
  }
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
}

.terms {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  
  input {
    margin-right: 8px;
    margin-top: 4px;
  }
  
  label {
    font-size: 14px;
    color: var(--gray-color);
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
  
  &:hover {
    color: var(--dark-color);
  }
}
</style> 