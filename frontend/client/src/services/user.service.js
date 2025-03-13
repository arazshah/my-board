import axios from 'axios';

const API_URL = '/api/users/';

class UserService {
  async getProfile() {
    const response = await axios.get(API_URL + 'me/', { withCredentials: true });
    return response.data;
  }

  async updateProfile(userData) {
    const response = await axios.patch(API_URL + 'me/', userData, { withCredentials: true });
    return response.data;
  }

  async updateProfileImage(formData) {
    const response = await axios.post(API_URL + 'me/upload-image/', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async changePassword(passwordData) {
    const response = await axios.post(API_URL + 'change-password/', passwordData, { withCredentials: true });
    return response.data;
  }

  async getNotifications() {
    const response = await axios.get(API_URL + 'notifications/', { withCredentials: true });
    return response.data;
  }

  async markNotificationAsRead(notificationId) {
    const response = await axios.post(API_URL + `notifications/${notificationId}/read/`, {}, { withCredentials: true });
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await axios.post(API_URL + 'notifications/read-all/', {}, { withCredentials: true });
    return response.data;
  }
}

export default new UserService(); 