export default {
  namespaced: true,
  state: {
    news: [],
    publication: null,
    instructions: [],
    instruction: null,
  },
  actions: {
    GetNews({ commit, rootGetters, dispatch }, id) {
      commit('setField', { name: 'news', value: [] });
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('news/api/news', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'news', value: response.data.news });
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
    SetPublication({ state, commit }, id) {
      return new Promise((resolve) => {
        commit('setField', { name: 'publication', value: null });
        const tmpArray = state.news.filter(item => item.id === id);
        tmpArray.length && commit('setField', { name: 'publication', value: tmpArray[0] });
        resolve(tmpArray[0]);
      });
    },
    SetPublicationReaded({ rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('news/api/news/readed', {
          profile_id: payload.profile_id,
          news_id: payload.news_id,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    GetInstructions({ commit, rootGetters, dispatch }, id) {
      commit('setField', { name: 'instructions', value: [] });
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('news/api/instructions', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'instructions', value: response.data.instructions });
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
    SetInstruction({ state, commit }, id) {
      return new Promise((resolve) => {
        commit('setField', { name: 'instruction', value: null });
        const tmpArray = state.instructions.filter(item => item.id === id);
        tmpArray.length && commit('setField', { name: 'instruction', value: tmpArray[0] });
        resolve(tmpArray[0]);
      });
    },
    SetInstructionReaded({ rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('news/api/instructions/readed', {
          profile_id: payload.profile_id,
          instruction_id: payload.instruction_id,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    InitialStoreNews({ commit }) {
      commit('setField', { name: 'news', value: [] });
      commit('setField', { name: 'publication', value: null });
      commit('setField', { name: 'instructions', value: [] });
      commit('setField', { name: 'instruction', value: null });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
