import axios from 'axios';

const API_URL = '/api/users/settings/';

class SettingsService {
  async getSettings() {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  }

  async updateSettings(settingsData) {
    const response = await axios.patch(API_URL, settingsData, { withCredentials: true });
    return response.data;
  }

  async resetSettings() {
    const response = await axios.post(API_URL + 'reset/', {}, { withCredentials: true });
    return response.data;
  }

  async getIntegrations() {
    const response = await axios.get(API_URL + 'integrations/', { withCredentials: true });
    return response.data;
  }

  async connectIntegration(provider) {
    const response = await axios.post(API_URL + `integrations/${provider}/connect/`, {}, { withCredentials: true });
    return response.data;
  }

  async disconnectIntegration(provider) {
    const response = await axios.post(API_URL + `integrations/${provider}/disconnect/`, {}, { withCredentials: true });
    return response.data;
  }

  async getApiKeys() {
    const response = await axios.get(API_URL + 'api-keys/', { withCredentials: true });
    return response.data;
  }

  async createApiKey(data) {
    const response = await axios.post(API_URL + 'api-keys/', data, { withCredentials: true });
    return response.data;
  }

  async revokeApiKey(keyId) {
    const response = await axios.delete(API_URL + `api-keys/${keyId}/`, { withCredentials: true });
    return response.data;
  }

  async downloadUserData() {
    const response = await axios.get(API_URL + 'data-export/', { 
      withCredentials: true,
      responseType: 'blob'
    });
    return response.data;
  }

  async deleteAccount(data) {
    const response = await axios.post(API_URL + 'delete-account/', data, { withCredentials: true });
    return response.data;
  }
}

export default new SettingsService(); 