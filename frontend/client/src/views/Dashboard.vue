<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="user-welcome">
        <div class="user-info">
          <div class="user-avatar">
            <img :src="userAvatar" alt="User Avatar" />
          </div>
          <div class="user-details">
            <h2>{{ userName }}</h2>
            <p>Last login: <span>{{ lastLogin }}</span></p>
          </div>
        </div>
      </div>
      <div class="dashboard-actions">
        <div class="notification-bell" @click="toggleNotifications">
          <i class="fas fa-bell"></i>
          <span class="notification-badge">{{ notificationCount }}</span>
        </div>
        <button class="btn btn-outline" @click="goToHome">
          <i class="fas fa-home"></i> Back to Site
        </button>
        <button class="btn btn-primary" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </header>

    <div class="dashboard-layout">
      <aside class="sidebar">
        <ul class="sidebar-menu">
          <li>
            <router-link to="/dashboard" exact>
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/profile">
              <i class="fas fa-user"></i> Profile
            </router-link>
          </li>
          <li>
            <router-link to="/security">
              <i class="fas fa-shield-alt"></i> Security
            </router-link>
          </li>
          <li>
            <router-link to="/settings">
              <i class="fas fa-cog"></i> Settings
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>

    <!-- Notification Panel -->
    <div class="notification-panel" :class="{ active: showNotifications }">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button class="close-btn" @click="toggleNotifications">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notification-list">
        <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
          <div class="notification-icon">
            <i class="fas fa-comment"></i>
          </div>
          <div class="notification-content">
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ formatDate(notification.timestamp) }}</span>
          </div>
        </div>
      </div>
      <div class="notification-footer">
        <a href="#">View all notifications</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      showNotifications: false,
      notifications: [],
      notificationCount: 3
    };
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    userName() {
      if (!this.currentUser) return 'User';
      return `${this.currentUser.first_name || ''} ${this.currentUser.last_name || this.currentUser.username}`.trim();
    },
    userAvatar() {
      return this.currentUser?.profile_image || 'https://via.placeholder.com/150';
    },
    lastLogin() {
      if (!this.currentUser?.last_login) return 'Never';
      return new Date(this.currentUser.last_login).toLocaleString();
    }
  },
  created() {
    this.loadUserData();
    this.loadNotifications();
  },
  methods: {
    async loadUserData() {
      try {
        await this.$store.dispatch('auth/fetchCurrentUser');
      } catch (error) {
        console.error('Failed to load user data:', error);
        this.$router.push('/login');
      }
    },
    loadNotifications() {
      // Mock data for now
      this.notifications = [
        { message: 'John commented on your post "Design Ideas"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
        { message: 'Sarah liked your comment', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        { message: 'New user followed you', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) }
      ];
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    goToHome() {
      window.location.href = '/';
    },
    async handleLogout() {
      try {
        await this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
// Import your dashboard styles here
</style> 