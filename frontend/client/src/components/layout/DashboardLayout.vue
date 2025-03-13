<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/images/logo.svg" alt="Logo" />
          <span v-if="!sidebarCollapsed">My-Board</span>
        </div>
        <button class="toggle-sidebar" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" exact>
              <i class="fas fa-tachometer-alt"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/projects">
              <i class="fas fa-project-diagram"></i>
              <span v-if="!sidebarCollapsed">Projects</span>
            </router-link>
          </li>
          <li>
            <router-link to="/tasks">
              <i class="fas fa-tasks"></i>
              <span v-if="!sidebarCollapsed">Tasks</span>
            </router-link>
          </li>
          <li>
            <router-link to="/calendar">
              <i class="fas fa-calendar-alt"></i>
              <span v-if="!sidebarCollapsed">Calendar</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile">
              <i class="fas fa-user"></i>
              <span v-if="!sidebarCollapsed">Profile</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings">
              <i class="fas fa-cog"></i>
              <span v-if="!sidebarCollapsed">Settings</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>
    
    <div class="main-container">
      <header class="dashboard-header">
        <div class="header-left">
          <div class="page-title">
            <h1>{{ pageTitle }}</h1>
          </div>
        </div>
        
        <div class="header-right">
          <div class="search-bar">
            <input type="text" placeholder="Search..." />
            <i class="fas fa-search"></i>
          </div>
          
          <div class="notifications" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span class="badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
            
            <div class="notifications-dropdown" v-if="showNotifications">
              <div class="notifications-header">
                <h3>Notifications</h3>
                <button @click="markAllAsRead">Mark all as read</button>
              </div>
              
              <div class="notifications-list" v-if="notifications.length > 0">
                <div 
                  v-for="(notification, index) in notifications" 
                  :key="index"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                >
                  <div class="notification-icon">
                    <i :class="notification.icon || 'fas fa-bell'"></i>
                  </div>
                  <div class="notification-content">
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="notifications-empty" v-else>
                <p>No notifications</p>
              </div>
              
              <div class="notifications-footer">
                <router-link to="/notifications">View all notifications</router-link>
              </div>
            </div>
          </div>
          
          <div class="user-menu" @click="toggleUserMenu">
            <div class="user-avatar">
              <img :src="userAvatar" alt="User Avatar" />
            </div>
            
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <div class="user-avatar">
                  <img :src="userAvatar" alt="User Avatar" />
                </div>
                <div class="user-details">
                  <h4>{{ userName }}</h4>
                  <p>{{ userEmail }}</p>
                </div>
              </div>
              
              <ul class="user-menu-items">
                <li>
                  <router-link to="/profile">
                    <i class="fas fa-user"></i> Profile
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
            </div>
          </div>
        </div>
      </header>
      
      <main class="dashboard-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'DashboardLayout',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const sidebarCollapsed = ref(false);
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const notifications = ref([]);
    
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const userName = computed(() => {
      if (!currentUser.value) return 'User';
      return `${currentUser.value.first_name || ''} ${currentUser.value.last_name || currentUser.value.username}`.trim();
    });
    const userEmail = computed(() => currentUser.value?.email || '');
    const userAvatar = computed(() => currentUser.value?.profile_image || 'https://via.placeholder.com/150');
    const notificationCount = computed(() => notifications.value.filter(n => !n.read).length);
    
    const pageTitle = computed(() => {
      const routeName = route.name;
      return routeName ? routeName.charAt(0).toUpperCase() + routeName.slice(1) : 'Dashboard';
    });
    
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value);
    };
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showUserMenu.value) showUserMenu.value = false;
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      if (showNotifications.value) showNotifications.value = false;
    };
    
    const markAllAsRead = () => {
      notifications.value = notifications.value.map(n => ({ ...n, read: true }));
    };
    
    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);
      
      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
      if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
      if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString();
    };
    
    onMounted(() => {
      // Load sidebar state from localStorage
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true';
      }
      
      // Load mock notifications
      notifications.value = [
        { 
          message: 'New comment on your project "Website Redesign"', 
          timestamp: new Date(Date.now() - 1000 * 60 * 30), 
          read: false,
          icon: 'fas fa-comment'
        },
        { 
          message: 'Task "Create wireframes" is due tomorrow', 
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
          read: false,
          icon: 'fas fa-tasks'
        },
        { 
          message: 'Meeting scheduled for 3:00 PM', 
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), 
          read: true,
          icon: 'fas fa-calendar'
        }
      ];
    });
    
    return {
      sidebarCollapsed,
      showNotifications,
      showUserMenu,
      notifications,
      userName,
      userEmail,
      userAvatar,
      notificationCount,
      pageTitle,
      toggleSidebar,
      toggleNotifications,
      toggleUserMenu,
      markAllAsRead,
      handleLogout,
      formatTime
    };
  }
};
</script>

<style lang="scss" scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  
  &.collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .logo {
      display: flex;
      align-items: center;
      
      img {
        width: 30px;
        height: 30px;
      }
      
      span {
        margin-left: 10px;
        font-weight: 600;
        white-space: nowrap;
      }
    }
    
    .toggle-sidebar {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      
      &:hover {
        color: var(--primary-light);
      }
    }
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 5px;
        
        a {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          
          i {
            font-size: 18px;
            min-width: 30px;
          }
          
          span {
            margin-left: 10px;
            white-space: nowrap;
          }
          
          &:hover, &.router-link-active {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    .logout-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: var(--border-radius);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      
      i {
        font-size: 18px;
        min-width: 30px;
      }
      
      span {
        margin-left: 10px;
        white-space: nowrap;
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .header-left {
    .page-title {
      h1 {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .search-bar {
      position: relative;
      margin-right: 20px;
      
      input {
        padding: 10px 15px 10px 40px;
        border: 1px solid #eee;
        border-radius: 30px;
        width: 250px;
        font-size: 14px;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 114, 255, 0.1);
          width: 300px;
        }
      }
      
      i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
      }
    }
    
    .notifications, .user-menu {
      position: relative;
      margin-left: 20px;
      cursor: pointer;
      
      i {
        font-size: 20px;
        color: #555;
      }
      
      .badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: var(--danger-color);
        color: white;
        font-size: 12px;
        font-weight: 600;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .notifications-dropdown, .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 10px;
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      width: 320px;
      z-index: 100;
      overflow: hidden;
    }
    
    .notifications-header, .notifications-footer {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      
      h3 {
        margin: 0;
        font-size: 16px;
      }
      
      button, a {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .notifications-footer {
      border-top: 1px solid #eee;
      border-bottom: none;
    }
    
    .notifications-list {
      max-height: 300px;
      overflow-y: auto;
      
      .notification-item {
        display: flex;
        padding: 15px;
        border-bottom: 1px solid #f5f5f5;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #f9f9f9;
        }
        
        &.unread {
          background-color: rgba(0, 114, 255, 0.05);
        }
        
        .notification-icon {
          margin-right: 15px;
          
          i {
            font-size: 16px;
            color: var(--primary-color);
            background-color: rgba(0, 114, 255, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .notification-content {
          flex: 1;
          
          p {
            margin: 0 0 5px;
            font-size: 14px;
          }
          
          .notification-time {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
    
    .notifications-empty {
      padding: 30px;
      text-align: center;
      color: #999;
    }
    
    .user-avatar {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    
    .user-dropdown {
      width: 280px;
      
      .user-info {
        padding: 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        
        .user-avatar {
          margin-right: 15px;
          
          img {
            width: 50px;
            height: 50px;
          }
        }
        
        .user-details {
          h4 {
            margin: 0 0 5px;
            font-size: 16px;
          }
          
          p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
        }
      }
      
      .user-menu-items {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          a {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #333;
            text-decoration: none;
            transition: all 0.3s ease;
            
            i {
              margin-right: 10px;
              font-size: 16px;
              color: #666;
            }
            
            &:hover {
              background-color: #f5f5f5;
            }
          }
        }
      }
    }
  }
}

.dashboard-content {
  flex: 1;
  padding: 30px;
  background-color: #f8f9fa;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    height: 100%;
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
    }
    
    &.collapsed {
      transform: translateX(-100%);
    }
  }
  
  .dashboard-header {
    .header-right {
      .search-bar {
        display: none;
      }
    }
  }
}
</style> 