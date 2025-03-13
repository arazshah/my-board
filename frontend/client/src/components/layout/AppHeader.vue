<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/logo.svg" alt="Logo" />
          <span>My-Board</span>
        </router-link>
      </div>
      
      <nav class="nav-menu">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/features">Features</router-link></li>
          <li><router-link to="/pricing">Pricing</router-link></li>
          <li><router-link to="/about">About</router-link></li>
        </ul>
      </nav>
      
      <div class="auth-buttons">
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="dashboard-link">
            <base-button variant="outline">Dashboard</base-button>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login">
            <base-button variant="outline">Login</base-button>
          </router-link>
          <router-link to="/register">
            <base-button>Sign Up</base-button>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseButton from '@/components/common/BaseButton.vue';

export default {
  name: 'AppHeader',
  components: {
    BaseButton
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--dark-color);
      font-weight: 700;
      font-size: 20px;
      
      img {
        height: 32px;
        margin-right: 10px;
      }
    }
  }
  
  .nav-menu {
    ul {
      display: flex;
      list-style: none;
      
      li {
        margin: 0 15px;
        
        a {
          text-decoration: none;
          color: var(--dark-color);
          font-weight: 500;
          transition: var(--transition);
          
          &:hover, &.router-link-active {
            color: var(--primary-color);
          }
        }
      }
    }
  }
  
  .auth-buttons {
    display: flex;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .app-header {
    .nav-menu {
      display: none;
    }
  }
}
</style> 