import axios from 'axios';

const API_URL = '/api/users/security/';

class SecurityService {
  async getSecurityInfo() {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  }

  async changePassword(passwordData) {
    const response = await axios.post(API_URL + 'change-password/', passwordData, { withCredentials: true });
    return response.data;
  }

  async getTwoFactorSetup() {
    const response = await axios.get(API_URL + '2fa/setup/', { withCredentials: true });
    return response.data;
  }

  async enableTwoFactor(data) {
    const response = await axios.post(API_URL + '2fa/enable/', data, { withCredentials: true });
    return response.data;
  }

  async disableTwoFactor() {
    const response = await axios.post(API_URL + '2fa/disable/', {}, { withCredentials: true });
    return response.data;
  }

  async getActiveSessions() {
    const response = await axios.get(API_URL + 'sessions/', { withCredentials: true });
    return response.data;
  }

  async terminateSession(sessionId) {
    const response = await axios.delete(API_URL + `sessions/${sessionId}/`, { withCredentials: true });
    return response.data;
  }

  async terminateAllSessions() {
    const response = await axios.delete(API_URL + 'sessions/', { withCredentials: true });
    return response.data;
  }
}

export default new SecurityService(); 