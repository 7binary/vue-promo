import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import app from '../app/store/app';
import eps from '../pages/prizes/store/eps';
import payments from '../pages/prizes/store/payments';
import banners from '../pages/profile/store/banners';
import bonuses from '../pages/profile/store/bonuses';
import surveys from '../pages/profile/store/surveys';
import webpush from '../pages/profile/store/webpush';
import courses from '../pages/courses/store/courses';
import notifications from '../pages/profile/store/notifications';
import mobileNotifications from '../pages/mobileNotifications/store/mobileNotifications';
import sales from '../pages/sales/store/sales';
import news from '../pages/news/store/news';
import tickets from '../pages/tickets/store/tickets';
import shop from '../pages/shop/store/shop';
import { baseURL, xToken } from '../env/env.json';

Vue.use(Vuex);

const baseApiURL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/api`
  : baseURL;

const store = new Vuex.Store({
  plugins: [createPersistedState({ key: 'promo', ssr: false })],
  state: {
    loading: false,
    dialogs: {
      surveys: true,
      notifications: true,
    },
    profile_id: null,
    token: null,
    user: null,
    userTransactions: [],

    paymentsInfo: {},
    settings: {},
  },
  mutations: {
    menuSide(state, settings) {
      state.settings.layout = settings;
    },
    SetSettings(state, settings) {
      state.settings = settings;
    },
    SetUser(state, payload) {
      state.user = payload;
    },
    SetDialog(state, payload) {
      state.dialogs[payload.dialog] = payload.value;
    },
    SetUserTransactions(state, payload) {
      state.userTransactions = payload;
    },
    SetLogged(state, payload) {
      state.profile_id = payload.profile_id;
      state.token = payload.token;
    },
    SetLoading(state, payload) {
      state.loading = payload;
    },
    SetPaymentsSettings(state, payload) {
      state.paymentsInfo.methods = payload;
    },
    InitialStore(state) {
      state.loading = false;
      state.dialogs = {
        surveys: true,
        notifications: true,
      };
      state.profile_id = null;
      state.token = null;
      state.user = null;
      state.userTransactions = [];
      state.paymentsInfo = {};
      state.settings = {};
    },
    Logout(state) {
      state.profile_id = null;
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    SetLoading({ commit }, payload) {
      commit('SetLoading', payload);
    },
    UnsetError() {
      Vue.notify({ group: 'error', clean: true });
    },
    UnsetInfo() {
      Vue.notify({ group: 'info', clean: true });
    },
    ShowInfo({ dispatch }, message) {
      dispatch('UnsetError');
      dispatch('UnsetInfo');
      dispatch('ShowInfoMessage', message);
    },
    ShowError({ dispatch }, message) {
      dispatch('UnsetError');
      dispatch('UnsetInfo');
      dispatch('ShowErrorMessage', message);
    },
    ShowErrorMessage({}, message) {
      const text = message;
      Vue.notify({ group: 'error', type: 'error', text, duration: 60000 });
    },
    ShowInfoMessage({}, message) {
      const text = message;
      Vue.notify({ group: 'info', type: 'info', text, duration: 7000 });
    },
    HandleError({ dispatch }, error) {
      if (error.response) {
        // Error recieved from the server
        const { data } = error.response;
        let errors = [];
        if ('error' in data) {
          errors = [data.error];
        } else if ('errors' in data) {
          if (Array.isArray(data.errors)) {
            ({ errors } = data);
          } else {
            Object.keys(data.errors).forEach((k) => {
              errors.push(data.errors[k]);
            });
          }
        }
        // maximum show 2 errors
        if (errors.length > 2) {
          errors = errors.slice(0, 2);
        }
        errors.forEach((message) => {
          dispatch('ShowErrorMessage', message);
        });
      } else if (error.request) {
        // The request was made but no response was received
        dispatch('ShowErrorMessage', 'С вашим подключением не все так просто. Пожалуйста, проверьте доступ к интернету');
      } else {
        // Something happened in setting up the request that triggered an Error
        dispatch('ShowErrorMessage', 'Что-то пошло не так');
        console.log(error.config);
      }
    },
    GetSettings({ commit, getters }) {
      return new Promise((resolve, reject) => {
        getters.ax.post('api/settings')
          .then((response) => {
            if (response && response.data) {
              commit('SetSettings', response.data.settings);
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch(error => reject(error));
      });
    },
    GetProfile({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (state.profile_id) {
          getters.ax.post('profiles/api/auth/get-profile', { profile_id: state.profile_id })
            .then((response) => {
              if (response && response.data) {
                commit('SetUser', response.data.profile);
                resolve(response.data);
              }
              reject(new Error('no response data'));
            })
            .catch(error => reject(error));
        } else {
          resolve(null);
        }
      });
    },
    GetTransactions({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (state.profile_id) {
          getters.axl.post('profiles/api/transaction/list', { profile_id: state.profile_id })
            .then((response) => {
              if (response && response.data) {
                commit('SetUserTransactions', response.data.transactions);
                resolve(response.data);
              }
              reject(new Error('no response data'));
            })
            .catch(error => reject(error));
        }
      });
    },
    GetPaymentsSettings({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (state.profile_id) {
          getters.ax.post('payments/api-v3/settings/view')
            .then((response) => {
              if (response && response.data) {
                commit('SetPaymentsSettings', response.data.settings);
                resolve(response.data);
              }
              reject(new Error('no response data'));
            })
            .catch(error => reject(error));
        }
      });
    },
    UserLogin({ commit, dispatch }, payload) {
      commit('SetLogged', payload);
      dispatch('ShowInfoMessage', 'Добро пожаловать!');
    },
    UserLogout({ commit, dispatch }) {
      commit('Logout');
      commit('InitialStore');
      dispatch('courses/InitialStoreCourses');
      dispatch('mobileNotifications/InitialStoreNotifications');
      dispatch('news/InitialStoreNews');
      dispatch('eps/InitialStoreEps');
      dispatch('payments/InitialStorePayments');
      dispatch('banners/InitialStoreBanners');
      dispatch('bonuses/InitialStoreBonuses');
      dispatch('notifications/InitialStoreNotifications');
      dispatch('surveys/InitialStoreSurveys');
      dispatch('sales/InitialStoreSales');
      dispatch('shop/InitialStateShop');
      dispatch('tickets/InitialStoreTickets');
      dispatch('webpush/ResetToken');
      localStorage.clear();
      dispatch('GetSettings');
    },
    DownloadFile({ getters, dispatch }, info) {
      getters.axf.post(info.url, info.data).then((response) => {
        const blob = new Blob([response.data]);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, info.filename);
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', info.filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      }).catch((error) => {
        dispatch('HandleError', error);
      });
    },
  },
  getters: {
    ax(state) {
      const ax = axios.create({
        baseURL: baseApiURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          return config;
        },
        error => Promise.reject(error),
      );
      return ax;
    },
    axl(state) {
      const ax = axios.create({
        baseURL: baseApiURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          state.loading = true;
          return config;
        },
        error => Promise.reject(error),
      );
      ax.interceptors.response.use(
        (response) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return response;
        },
        (error) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return Promise.reject(error);
        },
      );
      return ax;
    },
    axf(state) {
      const ax = axios.create({
        baseURL: baseApiURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
        responseType: 'blob',
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          state.loading = true;
          return config;
        },
        error => Promise.reject(error),
      );
      ax.interceptors.response.use(
        (response) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return response;
        },
        (error) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return Promise.reject(error);
        },
      );
      return ax;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return state.profile_id !== null && state.profile_id !== undefined
        && state.token !== null && state.token !== undefined;
    },
  },
  modules: {
    app,
    courses,
    eps,
    payments,
    surveys,
    notifications,
    mobileNotifications,
    sales,
    news,
    tickets,
    banners,
    bonuses,
    shop,
    webpush,
  },
});

export default store;
