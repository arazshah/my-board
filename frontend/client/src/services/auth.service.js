import axios from 'axios';

const API_URL = '/api/users/';

class AuthService {
  async login(user) {
    const response = await axios.post(API_URL + 'login/', {
      email: user.email,
      password: user.password
    }, { withCredentials: true });
    return response.data;
  }

  async logout() {
    const response = await axios.post(API_URL + 'logout/', {}, { withCredentials: true });
    return response.data;
  }

  async register(user) {
    const response = await axios.post(API_URL + 'register/', {
      username: user.username,
      email: user.email,
      password: user.password,
      password2: user.password2
    }, { withCredentials: true });
    return response.data;
  }

  async getCurrentUser() {
    const response = await axios.get(API_URL + 'me/', { withCredentials: true });
    return response.data;
  }
}

export default new AuthService(); 