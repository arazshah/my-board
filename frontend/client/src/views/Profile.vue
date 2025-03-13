<template>
  <dashboard-layout :page-title="'Profile'">
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="userAvatar" alt="User Avatar" />
          <button class="change-avatar-btn" @click="openFileUpload">
            <i class="fas fa-camera"></i>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              style="display: none" 
              @change="handleFileUpload"
            />
          </button>
        </div>
        <div class="profile-info">
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>
          <p class="profile-role">{{ user.role }}</p>
          <p class="profile-joined">Member since {{ formatDate(user.date_joined) }}</p>
          <div class="profile-completion">
            <div class="completion-bar">
              <div class="completion-progress" :style="{ width: `${profileCompletion}%` }"></div>
            </div>
            <p>Profile completion: {{ profileCompletion }}%</p>
          </div>
        </div>
        <div class="profile-actions">
          <base-button @click="editProfile">Edit Profile</base-button>
        </div>
      </div>
      
      <div class="profile-content">
        <div class="profile-section">
          <h3>Personal Information</h3>
          <div class="profile-details">
            <div class="detail-item">
              <div class="detail-label">Full Name</div>
              <div class="detail-value">{{ user.first_name }} {{ user.last_name }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Email</div>
              <div class="detail-value">{{ user.email }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Phone</div>
              <div class="detail-value">{{ user.phone_number || 'Not provided' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Location</div>
              <div class="detail-value">{{ user.location || 'Not provided' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Website</div>
              <div class="detail-value">
                <a v-if="user.website" :href="user.website" target="_blank">{{ user.website }}</a>
                <span v-else>Not provided</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-section">
          <h3>Bio</h3>
          <div class="profile-bio">
            <p v-if="user.bio">{{ user.bio }}</p>
            <p v-else class="empty-info">No bio provided. Tell us about yourself!</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Profile Modal -->
    <div class="modal" v-if="showEditModal">
      <div class="modal-overlay" @click="showEditModal = false"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Edit Profile</h3>
          <button class="modal-close" @click="showEditModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProfile">
            <div class="form-row">
              <base-input
                id="edit-first-name"
                v-model="editForm.first_name"
                label="First Name"
                :error="formErrors.first_name"
              />
              <base-input
                id="edit-last-name"
                v-model="editForm.last_name"
                label="Last Name"
                :error="formErrors.last_name"
              />
            </div>
            
            <base-input
              id="edit-email"
              v-model="editForm.email"
              label="Email"
              type="email"
              :error="formErrors.email"
              disabled
            />
            
            <base-input
              id="edit-phone"
              v-model="editForm.phone_number"
              label="Phone Number"
              :error="formErrors.phone_number"
            />
            
            <base-input
              id="edit-location"
              v-model="editForm.location"
              label="Location"
              :error="formErrors.location"
            />
            
            <base-input
              id="edit-website"
              v-model="editForm.website"
              label="Website"
              :error="formErrors.website"
            />
            
            <div class="form-group">
              <label for="edit-bio">Bio</label>
              <textarea
                id="edit-bio"
                v-model="editForm.bio"
                rows="4"
                :class="{ 'has-error': formErrors.bio }"
              ></textarea>
              <p v-if="formErrors.bio" class="error-message">{{ formErrors.bio }}</p>
            </div>
            
            <div class="modal-footer">
              <base-button variant="outline" type="button" @click="showEditModal = false">Cancel</base-button>
              <base-button type="submit" :loading="loading">Save Changes</base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import UserService from '@/services/user.service';

export default {
  name: 'Profile',
  components: {
    DashboardLayout,
    BaseButton,
    BaseInput
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters['auth/currentUser'] || {});
    const userAvatar = computed(() => {
      return user.value.profile_image || 'https://via.placeholder.com/150';
    });
    
    const showEditModal = ref(false);
    const loading = ref(false);
    const fileInput = ref(null);
    const formErrors = ref({});
    
    const editForm = ref({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      location: '',
      website: '',
      bio: ''
    });
    
    const profileCompletion = computed(() => {
      const fields = [
        'first_name', 
        'last_name', 
        'email', 
        'phone_number', 
        'location', 
        'website', 
        'bio', 
        'profile_image'
      ];
      
      const filledFields = fields.filter(field => {
        return user.value[field] && user.value[field].toString().trim() !== '';
      });
      
      return Math.round((filledFields.length / fields.length) * 100);
    });
    
    const openFileUpload = () => {
      fileInput.value.click();
    };
    
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('profile_image', file);
      
      try {
        loading.value = true;
        await UserService.updateProfileImage(formData);
        await store.dispatch('auth/fetchCurrentUser');
        loading.value = false;
      } catch (error) {
        console.error('Error uploading profile image:', error);
        loading.value = false;
      }
    };
    
    const editProfile = () => {
      // Initialize form with current user data
      editForm.value = {
        first_name: user.value.first_name || '',
        last_name: user.value.last_name || '',
        email: user.value.email || '',
        phone_number: user.value.phone_number || '',
        location: user.value.location || '',
        website: user.value.website || '',
        bio: user.value.bio || ''
      };
      
      formErrors.value = {};
      showEditModal.value = true;
    };
    
    const saveProfile = async () => {
      try {
        loading.value = true;
        formErrors.value = {};
        
        await UserService.updateProfile(editForm.value);
        await store.dispatch('auth/fetchCurrentUser');
        
        showEditModal.value = false;
        loading.value = false;
      } catch (error) {
        loading.value = false;
        
        if (error.response && error.response.data) {
          formErrors.value = error.response.data;
        } else {
          console.error('Error updating profile:', error);
        }
      }
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    return {
      user,
      userAvatar,
      profileCompletion,
      showEditModal,
      loading,
      fileInput,
      editForm,
      formErrors,
      openFileUpload,
      handleFileUpload,
      editProfile,
      saveProfile,
      formatDate
    };
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--card-shadow);
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .profile-avatar {
    position: relative;
    margin-right: 30px;
    
    @media (max-width: 768px) {
      margin-right: 0;
      margin-bottom: 20px;
    }
    
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .change-avatar-btn {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      transition: var(--transition);
      
      &:hover {
        background-color: darken(#0072ff, 10%);
      }
    }
  }
  
  .profile-info {
    flex: 1;
    
    h2 {
      margin: 0 0 5px;
      font-size: 24px;
    }
    
    .profile-role {
      color: var(--primary-color);
      font-weight: 600;
      margin: 0 0 5px;
    }
    
    .profile-joined {
      color: var(--gray-color);
      font-size: 14px;
      margin: 0 0 15px;
    }
    
    .profile-completion {
      .completion-bar {
        height: 6px;
        background-color: #eee;
        border-radius: 3px;
        margin-bottom: 5px;
        
        .completion-progress {
          height: 100%;
          background: linear-gradient(to right, var(--primary-light), var(--primary-color));
          border-radius: 3px;
        }
      }
      
      p {
        margin: 0;
        font-size: 14px;
        color: var(--gray-color);
      }
    }
  }
  
  .profile-actions {
    @media (max-width: 768px) {
      margin-top: 20px;
    }
  }
}

.profile-content {
  .profile-section {
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
    
    .profile-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .detail-item {
        .detail-label {
          font-size: 14px;
          color: var(--gray-color);
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 16px;
          
          a {
            color: var(--primary-color);
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    .profile-bio {
      p {
        margin: 0;
        line-height: 1.6;
      }
      
      .empty-info {
        color: var(--gray-color);
        font-style: italic;
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
    max-width: 600px;
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
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 14px;
        color: var(--dark-color);
      }
      
      textarea {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-size: 14px;
        transition: var(--transition);
        resize: vertical;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 114, 255, 0.1);
        }
        
        &.has-error {
          border-color: var(--danger-color);
        }
      }
      
      .error-message {
        color: var(--danger-color);
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
}
</style> 