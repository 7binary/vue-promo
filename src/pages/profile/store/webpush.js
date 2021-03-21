import * as firebase from 'firebase/app';
import 'firebase/messaging';

export default {
  namespaced: true,
  state: {
    webpushPopupOpened: true,
    webpushFirebaseToken: null,
    webpushDeclinedAt: null,
    debug: false,
  },
  actions: {
    RequestPermission({ dispatch }) {
      dispatch('InitFirebase');
      dispatch('Subscribe');
    },
    InitFirebase({ state }) {
      if (!('Notification' in window)) {
        return;
      }
      const config = {
        apiKey: '',
        authDomain: 'vue-promo.firebaseapp.com',
        databaseURL: 'https://vue-promo.firebaseio.com',
        projectId: 'vue-promo',
        storageBucket: 'vue-promo.appspot.com',
        messagingSenderId: '71066749120',
        appId: '1:71066749120:web:03ee796adc7b752bdf0525',
        measurementId: 'G-JDMPRZETHX',
      };
      firebase.initializeApp(config);
      if (state.debug) {
        console.log('...firebase initialized...');
      }
    },
    Subscribe({ commit, dispatch, state }) {
      commit('SetWebpushPopupOpened', false);

      if (!('Notification' in window)) {
        return;
      }

      const messaging = firebase.messaging();

      // запрашиваем разрешение на получение уведомлений
      messaging.requestPermission()
        .then(() => {
          // получаем ID устройства
          messaging.getToken()
            .then((currentToken) => {
              if (currentToken) {
                if (state.debug) {
                  console.log(currentToken);
                }
                dispatch('SendWebpushTokenToServer', currentToken);
              } else {
                if (state.debug) {
                  console.warn('Не удалось получить токен.');
                }
                commit('SetWebpushFirebaseToken', null);
              }
            })
            .catch((err) => {
              if (state.debug) {
                console.warn('При получении токена произошла ошибка.', err);
              }
              commit('SetWebpushFirebaseToken', null);
            });
        })
        .catch((err) => {
          if (state.debug) {
            console.warn('Не удалось получить разрешение на показ уведомлений.', err);
          }
        });
    },
    SendWebpushTokenToServer({ rootState, rootGetters, state, commit }, token) {
      // отправка токена на сервер
      if (state.webpushFirebaseToken !== token) {
        if (state.debug) {
          console.log('Отправка токена на сервер...');
        }
        const info = {
          profile_id: rootState.user.profile_id,
          platform: 'web',
          token,
        };
        rootGetters.ax.post('mobile/api/firebase/register-device', info)
          .then((response) => {
            commit('SetWebpushFirebaseToken', token);
            if (state.debug) {
              console.log(response.data.gcm);
            }
          });
      } else if (state.debug) {
        console.log('Токен уже отправлен на сервер.');
      }
    },
    OpenPopup({ commit }) {
      commit('SetWebpushPopupOpened', true);
    },
    ClosePopup({ commit }) {
      commit('SetWebpushPopupOpened', false);
    },
    Decline({ commit }) {
      commit('SetWebpushPopupOpened', false);
      commit('SetWebpushDeclined', true);
    },
    ResetDecline({ commit }) {
      commit('SetWebpushDeclined', false);
    },
    ResetToken({ commit }) {
      commit('SetWebpushFirebaseToken', null);
      if ('indexedDB' in window) {
        indexedDB.deleteDatabase('fcm_token_details_db');
        indexedDB.deleteDatabase('fcm_vapid_details_db');
      }
    },
  },
  mutations: {
    SetWebpushPopupOpened(state, isOpened) {
      state.webpushPopupOpened = isOpened;
    },
    SetWebpushFirebaseToken(state, token) {
      state.webpushFirebaseToken = token;
    },
    SetWebpushDeclined(state, isDeclined) {
      if (isDeclined) {
        const now = new Date();
        state.webpushDeclinedAt = now.toLocaleString();
      } else {
        state.webpushDeclinedAt = null;
      }
    },
  },
};
