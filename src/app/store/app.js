export default {
  namespaced: true,
  state: {
    sidebar: false,
  },
  actions: {
    SetSidebar({ commit }, payload) {
      commit('setField', { name: 'sidebar', value: payload });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
