import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    completedCourses: [],
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setCompletedCourses(state, courses) {
      state.completedCourses = courses;
    },
    clearAuthData(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = '';
      state.completedCourses = [];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  actions: {
    async login({ commit }, userData) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', userData);
        const token = response.data.token;
        commit('setToken', token);
        commit('setAuthentication', true);
        await this.dispatch('fetchUserData');
      } catch (error) {
        console.error('Failed to log in:', error);
        throw error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', userData);
        const token = response.data.token;
        commit('setToken', token);
        commit('setAuthentication', true);
        await this.dispatch('fetchUserData');
      } catch (error) {
        console.error('Failed to register:', error);
        throw error;
      }
    },
    async fetchUserData({ commit, state }) {
      try {
        if (state.token) {
          const response = await axios.get('http://localhost:3000/api/auth/user', {
            headers: { 'x-auth-token': state.token }
          });
          commit('setUser', response.data);
          await this.dispatch('fetchCompletedCourses');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        commit('clearAuthData');
      }
    },
    async fetchCompletedCourses({ commit, state }) {
      try {
        const response = await axios.get('http://localhost:3000/api/userCourses/completed', {
          headers: { 'x-auth-token': state.token }
        });
        commit('setCompletedCourses', response.data.completedCourses);
      } catch (error) {
        console.error('Failed to fetch completed courses:', error);
      }
    },
    async markCourseAsCompleted({ commit, state }, courseId) {
      try {
        await axios.post('http://localhost:3000/api/userCourses/complete', { courseId }, {
          headers: { 'x-auth-token': state.token }
        });
        await this.dispatch('fetchCompletedCourses'); // Refetch completed courses
      } catch (error) {
        console.error('Failed to mark course as completed:', error);
      }
    },
    logout({ commit }) {
      commit('clearAuthData');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    completedCourses: state => state.completedCourses,
  },
});
