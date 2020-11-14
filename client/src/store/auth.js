import AuthService from '../services/auth.js';
import cookie from 'js-cookie';

const id = cookie.get('id');

export default {
  namespaced: true,
  state: {
    logged: id ? true : false,
    loginStatus: null,
  },
  actions: {
    login({ commit }, user) {
      commit('loginPending');
      return AuthService.login(user)
        .then(user => {
          commit('loginSuccess');
          return Promise.resolve();
        })
        .catch(error => {
          setTimeout(() => {
            commit('loginFailure');
          }, 1000);
          return Promise.reject();
        });
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
  },
  mutations: {
    loginPending(state) {
      state.loginStatus = 'PENDING';
    },
    loginSuccess(state) {
      state.logged = true;
      state.loginStatus = 'SUCCESS';
    },
    loginFailure(state) {
      state.logged = false;
      state.loginStatus = 'FAILURE';
    },
    logout(state) {
      state.logged = false;
      state.loginStatus = null;
    },
  },
};
