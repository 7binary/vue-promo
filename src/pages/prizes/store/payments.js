export default {
  namespaced: true,
  state: {
    payments: [], // переводы баллов на карты или телефон.
  },
  getters: {
  },
  actions: {
    GetPayments({ commit, rootGetters, dispatch }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('payments/api-v3/payments/by-profile', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'payments', value: response.data.payments });
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
    InitialStorePayments({ commit }) {
      commit('setField', { name: 'payments', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
