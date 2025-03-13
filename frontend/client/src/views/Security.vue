<template>
  <dashboard-layout :page-title="'Security Settings'">
    <div class="security-container">
      <div class="security-section">
        <h3>Change Password</h3>
        <form @submit.prevent="changePassword">
          <base-input
            id="current-password"
            v-model="passwordForm.current_password"
            label="Current Password"
            type="password"
            :error="passwordErrors.current_password"
            required
          />
          
          <base-input
            id="new-password"
            v-model="passwordForm.new_password"
            label="New Password"
            type="password"
            :error="passwordErrors.new_password"
            required
            @input="updatePasswordStrength"
          />
          
          <div class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-progress" 
                :style="{ width: `${passwordStrength}%` }"
                :class="strengthClass"
              ></div>
            </div>
            <span class="strength-text">{{ strengthText }}</span>
          </div>
          
          <base-input
            id="confirm-password"
            v-model="passwordForm.confirm_password"
            label="Confirm New Password"
            type="password"
            :error="passwordErrors.confirm_password"
            required
          />
          
          <div class="form-actions">
            <base-button type="submit" :loading="passwordLoading">Update Password</base-button>
          </div>
        </form>
      </div>
      
      <div class="security-section">
        <h3>Two-Factor Authentication</h3>
        <div class="twofa-status">
          <div class="status-indicator" :class="{ active: twoFactorEnabled }">
            <i :class="twoFactorEnabled ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>
          <div class="status-text">
            <h4>{{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}</h4>
            <p>Two-factor authentication adds an extra layer of security to your account.</p>
          </div>
          <div class="status-action">
            <base-button 
              :variant="twoFactorEnabled ? 'danger' : 'primary'"
              @click="toggleTwoFactor"
              :loading="twofaLoading"
            >
              {{ twoFactorEnabled ? 'Disable' : 'Enable' }}
            </base-button>
          </div>
        </div>
      </div>
      
      <div class="security-section">
        <h3>Active Sessions</h3>
        <div class="sessions-list">
          <div v-for="(session, index) in activeSessions" :key="index" class="session-item">
            <div class="session-info">
              <div class="session-device">
                <i :class="getDeviceIcon(session.device_type)"></i>
                <div class="device-details">
                  <h4>{{ session.device_name }}</h4>
                  <p>{{ session.location }} • {{ formatDate(session.last_active) }}</p>
                </div>
              </div>
              <div class="session-status" v-if="session.current">
                <span class="current-badge">Current</span>
              </div>
            </div>
            <div class="session-actions" v-if="!session.current">
              <base-button 
                variant="danger" 
                size="small"
                @click="terminateSession(session.id)"
                :loading="session.loading"
              >
                Terminate
              </base-button>
            </div>
          </div>
        </div>
        <div class="sessions-actions">
          <base-button 
            variant="danger" 
            @click="terminateAllSessions"
            :loading="terminateAllLoading"
          >
            Terminate All Other Sessions
          </base-button>
        </div>
      </div>
      
      <!-- Two-Factor Setup Modal -->
      <div class="modal" v-if="showTwoFactorModal">
        <div class="modal-overlay" @click="showTwoFactorModal = false"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h3>Set Up Two-Factor Authentication</h3>
            <button class="modal-close" @click="showTwoFactorModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="twofa-setup">
              <p>Scan this QR code with your authenticator app (like Google Authenticator or Authy):</p>
              <div class="qr-code">
                <img :src="twofaQrCode" alt="QR Code" />
              </div>
              <p class="secret-key">
                Or enter this code manually: <strong>{{ twofaSecretKey }}</strong>
              </p>
              <p>After scanning, enter the 6-digit verification code from your app:</p>
              <div class="verification-code">
                <base-input
                  id="verification-code"
                  v-model="verificationCode"
                  label="Verification Code"
                  :error="twofaError"
                  maxlength="6"
                  required
                />
              </div>
              <div class="modal-footer">
                <base-button variant="outline" type="button" @click="showTwoFactorModal = false">Cancel</base-button>
                <base-button @click="verifyTwoFactorCode" :loading="verifyLoading">Verify & Enable</base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { calculatePasswordStrength } from '@/utils/validators';
import SecurityService from '@/services/security.service';

export default {
  name: 'Security',
  components: {
    DashboardLayout,
    BaseInput,
    BaseButton
  },
  setup() {
    // Password change
    const passwordForm = ref({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    const passwordErrors = ref({});
    const passwordLoading = ref(false);
    const passwordStrength = ref(0);
    
    // Two-factor authentication
    const twoFactorEnabled = ref(false);
    const twofaLoading = ref(false);
    const showTwoFactorModal = ref(false);
    const twofaQrCode = ref('');
    const twofaSecretKey = ref('');
    const verificationCode = ref('');
    const verifyLoading = ref(false);
    const twofaError = ref('');
    
    // Sessions
    const activeSessions = ref([]);
    const terminateAllLoading = ref(false);
    
    // Computed properties
    const strengthClass = computed(() => {
      if (passwordStrength.value < 30) return 'weak';
      if (passwordStrength.value < 70) return 'medium';
      return 'strong';
    });
    
    const strengthText = computed(() => {
      if (passwordStrength.value < 30) return 'Weak';
      if (passwordStrength.value < 70) return 'Medium';
      return 'Strong';
    });
    
    // Methods
    const updatePasswordStrength = () => {
      passwordStrength.value = calculatePasswordStrength(passwordForm.value.new_password);
    };
    
    const changePassword = async () => {
      try {
        passwordLoading.value = true;
        passwordErrors.value = {};
        
        // Validate passwords match
        if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
          passwordErrors.value.confirm_password = "Passwords don't match";
          passwordLoading.value = false;
          return;
        }
        
        await SecurityService.changePassword(passwordForm.value);
        
        // Reset form
        passwordForm.value = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
        passwordStrength.value = 0;
        
        // Show success message
        alert('Password changed successfully');
        passwordLoading.value = false;
      } catch (error) {
        passwordLoading.value = false;
        
        if (error.response && error.response.data) {
          passwordErrors.value = error.response.data;
        } else {
          console.error('Error changing password:', error);
        }
      }
    };
    
    const toggleTwoFactor = async () => {
      if (twoFactorEnabled.value) {
        // Disable 2FA
        try {
          twofaLoading.value = true;
          await SecurityService.disableTwoFactor();
          twoFactorEnabled.value = false;
          twofaLoading.value = false;
        } catch (error) {
          console.error('Error disabling 2FA:', error);
          twofaLoading.value = false;
        }
      } else {
        // Start 2FA setup
        try {
          twofaLoading.value = true;
          const response = await SecurityService.getTwoFactorSetup();
          twofaQrCode.value = response.qr_code;
          twofaSecretKey.value = response.secret_key;
          showTwoFactorModal.value = true;
          twofaLoading.value = false;
        } catch (error) {
          console.error('Error getting 2FA setup:', error);
          twofaLoading.value = false;
        }
      }
    };
    
    const verifyTwoFactorCode = async () => {
      try {
        verifyLoading.value = true;
        twofaError.value = '';
        
        await SecurityService.enableTwoFactor({
          verification_code: verificationCode.value
        });
        
        twoFactorEnabled.value = true;
        showTwoFactorModal.value = false;
        verificationCode.value = '';
        verifyLoading.value = false;
      } catch (error) {
        verifyLoading.value = false;
        
        if (error.response && error.response.data) {
          twofaError.value = error.response.data.error || 'Invalid verification code';
        } else {
          twofaError.value = 'An error occurred. Please try again.';
          console.error('Error verifying 2FA code:', error);
        }
      }
    };
    
    const loadActiveSessions = async () => {
      try {
        const sessions = await SecurityService.getActiveSessions();
        activeSessions.value = sessions.map(session => ({
          ...session,
          loading: false
        }));
      } catch (error) {
        console.error('Error loading active sessions:', error);
      }
    };
    
    const terminateSession = async (sessionId) => {
      const session = activeSessions.value.find(s => s.id === sessionId);
      if (!session) return;
      
      try {
        session.loading = true;
        await SecurityService.terminateSession(sessionId);
        activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId);
      } catch (error) {
        console.error('Error terminating session:', error);
        session.loading = false;
      }
    };
    
    const terminateAllSessions = async () => {
      try {
        terminateAllLoading.value = true;
        await SecurityService.terminateAllSessions();
        // Keep only current session
        activeSessions.value = activeSessions.value.filter(s => s.current);
        terminateAllLoading.value = false;
      } catch (error) {
        console.error('Error terminating all sessions:', error);
        terminateAllLoading.value = false;
      }
    };
    
    const getDeviceIcon = (deviceType) => {
      switch (deviceType.toLowerCase()) {
        case 'desktop':
          return 'fas fa-desktop';
        case 'mobile':
          return 'fas fa-mobile-alt';
        case 'tablet':
          return 'fas fa-tablet-alt';
        default:
          return 'fas fa-question-circle';
      }
    };
    
    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      try {
        const securityInfo = await SecurityService.getSecurityInfo();
        twoFactorEnabled.value = securityInfo.two_factor_enabled;
        loadActiveSessions();
      } catch (error) {
        console.error('Error loading security info:', error);
      }
    });
    
    return {
      // Password change
      passwordForm,
      passwordErrors,
      passwordLoading,
      passwordStrength,
      strengthClass,
      strengthText,
      updatePasswordStrength,
      changePassword,
      
      // Two-factor authentication
      twoFactorEnabled,
      twofaLoading,
      showTwoFactorModal,
      twofaQrCode,
      twofaSecretKey,
      verificationCode,
      verifyLoading,
      twofaError,
      toggleTwoFactor,
      verifyTwoFactorCode,
      
      // Sessions
      activeSessions,
      terminateAllLoading,
      terminateSession,
      terminateAllSessions,
      getDeviceIcon,
      formatDate
    };
  }
};
</script>

<style lang="scss" scoped>
.security-container {
  max-width: 800px;
  margin: 0 auto;
}

.security-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--card-shadow);
  margin-bottom: 30px;
  
  h3 {
    margin: 0 0 20px;
    font-size: 18px;
    color: var(--dark-color);
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .form-actions {
    margin-top: 20px;
  }
}

.password-strength {
  margin-bottom: 20px;
  
  .strength-bar {
    height: 6px;
    background-color: #eee;
    border-radius: 3px;
    margin-bottom: 5px;
    
    .strength-progress {
      height: 100%;
      border-radius: 3px;
      
      &.weak {
        background-color: var(--danger-color);
      }
      
      &.medium {
        background-color: var(--warning-color);
      }
      
      &.strong {
        background-color: var(--success-color);
      }
    }
  }
  
  .strength-text {
    font-size: 12px;
    color: var(--gray-color);
  }
}

.twofa-status {
  display: flex;
  align-items: center;
  
  .status-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    
    i {
      font-size: 18px;
      color: var(--danger-color);
    }
    
    &.active {
      background-color: rgba(46, 213, 115, 0.1);
      
      i {
        color: var(--success-color);
      }
    }
  }
  
  .status-text {
    flex: 1;
    
    h4 {
      margin: 0 0 5px;
      font-size: 16px;
    }
    
    p {
      margin: 0;
      font-size: 14px;
      color: var(--gray-color);
    }
  }
}

.sessions-list {
  margin-bottom: 20px;
  
  .session-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .session-info {
      display: flex;
      align-items: center;
      flex: 1;
      
      .session-device {
        display: flex;
        align-items: center;
        
        i {
          font-size: 24px;
          color: var(--gray-color);
          margin-right: 15px;
          width: 30px;
          text-align: center;
        }
        
        .device-details {
          h4 {
            margin: 0 0 5px;
            font-size: 16px;
          }
          
          p {
            margin: 0;
            font-size: 14px;
            color: var(--gray-color);
          }
        }
      }
      
      .session-status {
        margin-left: 15px;
        
        .current-badge {
          background-color: rgba(46, 213, 115, 0.1);
          color: var(--success-color);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-container {
    background-color: white;
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1001;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 0;
      font-size: 20px;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--gray-color);
      
      &:hover {
        color: var(--dark-color);
      }
    }
  }
  
  .modal-body {
    padding: 20px;
    
    .twofa-setup {
      text-align: center;
      
      p {
        margin-bottom: 15px;
      }
      
      .qr-code {
        margin: 20px 0;
        
        img {
          max-width: 200px;
        }
      }
      
      .secret-key {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        font-family: monospace;
        margin: 20px 0;
      }
      
      .verification-code {
        max-width: 200px;
        margin: 0 auto;
      }
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
}
</style> 