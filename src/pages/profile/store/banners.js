export default {
  namespaced: true,
  state: {
    bannersList: [],
  },
  actions: {
    GetBannersList({ commit, rootGetters, dispatch }) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('posters/api/posters/by-group', { group: 'guest-index' })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'bannersList', value: response.data.banners });
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
    InitialStoreBanners({ commit }) {
      commit('setField', { name: 'bannersList', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
