import AuthService from '@/services/auth.service';

const initialState = {
  status: { loggedIn: false },
  user: null
};

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit }, user) {
      try {
        const userData = await AuthService.login(user);
        commit('loginSuccess', userData);
        return Promise.resolve(userData);
      } catch (error) {
        commit('loginFailure');
        return Promise.reject(error);
      }
    },
    async logout({ commit }) {
      try {
        await AuthService.logout();
        commit('logout');
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async register({ commit }, user) {
      try {
        const response = await AuthService.register(user);
        commit('registerSuccess');
        return Promise.resolve(response);
      } catch (error) {
        commit('registerFailure');
        return Promise.reject(error);
      }
    },
    async fetchCurrentUser({ commit }) {
      try {
        const user = await AuthService.getCurrentUser();
        commit('setUser', user);
        return Promise.resolve(user);
      } catch (error) {
        commit('logout');
        return Promise.reject(error);
      }
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    setUser(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    }
  },
  getters: {
    isLoggedIn: state => state.status.loggedIn,
    currentUser: state => state.user
  }
}; 