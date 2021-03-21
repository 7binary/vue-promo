export default {
  namespaced: true,
  state: {
    notificationsList: [],
    notification: null,
    lastShowTime: [],
    hasNotifications: false,
  },
  actions: {
    GetNotifications({ commit, state, rootGetters, dispatch }, profileID) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('notifications/api/notifications/list', { profile_id: profileID })
          .then((response) => {
            if (response && response.data) {
              const notificationsList = response.data.notifications.filter((item) => {
                const findIndexNotification = state.lastShowTime.findIndex(x => x.id === item.id);
                if (findIndexNotification !== -1) {
                  const timestamp = Math.round(new Date().getTime() / 1000);
                  const lastNotificationTimer = state.lastShowTime[findIndexNotification].time;
                  const itemTimer = item.frequency_hours * 3600;
                  return (timestamp - lastNotificationTimer) > itemTimer;
                }
                return true;
              });
              if (notificationsList.length) {
                commit('SetNotificationsList', notificationsList);
                commit('SetNotification', notificationsList[0]);
              } else {
                commit('InitialStoreNotifications');
              }
            } else {
              reject(new Error('no response data'));
            }
          })
          .then(() => {
            state.notificationsList.length && commit('SetNotificationsFlag', true);
            resolve(state.notificationsList);
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    successNotification({ commit, rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('notifications/api/notifications/answer', { profile_id: payload.profile_id, notification_id: payload.notification_id })
          .then((response) => {
            if (response && response.data) {
              response.data.answer.id && commit('InitialStoreNotifications');
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    InitialStoreNotifications({ commit }) {
      commit('InitialStoreNotifications');
    },
  },
  mutations: {
    SetNotificationsList(state, notifications) {
      state.notificationsList = [];
      state.notificationsList = notifications;
    },
    SetNotificationsFlag(state, payload) {
      state.hasNotifications = payload;
    },
    SetNotification(state, payload) {
      state.notification = {};
      state.notification = payload;
    },
    SetLastShowTime(state, payload) {
      if (state.lastShowTime.length && payload.time === null) {
        const findIndexNotification = state.lastShowTime.findIndex(x => x.id === payload.id);
        (findIndexNotification !== -1) && state.lastShowTime.splice(findIndexNotification, 1);
      } else if (state.lastShowTime.length && payload.time !== null) {
        const findIndexNotification = state.lastShowTime.findIndex(x => x.id === payload.id);
        if (findIndexNotification !== -1) {
          state.lastShowTime[findIndexNotification].time = payload.time;
        } else {
          state.lastShowTime.push({ id: payload.id, time: payload.time });
        }
      } else {
        state.lastShowTime.push({ id: payload.id, time: payload.time });
      }
    },
    InitialStoreNotifications(state) {
      state.notificationsList = [];
      state.notification = {};
      state.lastShowTime = [];
      state.hasNotifications = false;
    },
  },
};
