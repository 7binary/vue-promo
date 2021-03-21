export default {
  namespaced: true,
  state: {
    bonusesList: [],
  },
  actions: {
    GetBonusesList({ commit, rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('bonuses/api/bonuses', payload)
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'bonusesList', value: response.data.bonuses });
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
    InitialStoreBonuses({ commit }) {
      commit('setField', { name: 'bonusesList', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
