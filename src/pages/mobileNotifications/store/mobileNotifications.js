export default {
  namespaced: true,
  state: {
    notificationsList: [],
    notificationsNew: [],
    hasNotifications: false,
  },
  actions: {
    GetNotifications({ commit, state, rootGetters, dispatch }, profileID) {
      dispatch('InitialStoreNotifications');
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('mobile/api/notifications', { profile_id: profileID })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'notificationsList', value: response.data.notifications });
              const newNotifications = response.data.notifications.filter(item => !item.readed);
              commit('setField', { name: 'notificationsNew', value: newNotifications });
            } else {
              reject(new Error('no response data'));
            }
          })
          .then(() => {
            state.notificationsList.length && commit('setField', { name: 'hasNotifications', value: true });
            resolve(state.notificationsList);
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    setNotificationsRead({ rootGetters }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('mobile/api/notifications/readed', {
          profile_id: payload.profile_id,
          notification_ids: payload.notification_ids,
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
    InitialStoreNotifications({ commit }) {
      commit('setField', { name: 'notificationsList', value: [] });
      commit('setField', { name: 'hasNotifications', value: false });
      commit('setField', { name: 'notificationsNew', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
