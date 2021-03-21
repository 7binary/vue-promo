export default {
  namespaced: true,
  state: {
    sales: [],
    sale: null,
    actions: [],
    action: null,
    categories: [],
    groups: [],
    products: [],
  },
  actions: {
    GetSalesList({ commit, rootGetters }, payload) {
      commit('setField', { name: 'sales', value: [] });
      rootGetters.axl.post('sales/api/sale/list', payload)
        .then((response) => {
          commit('setField', { name: 'sales', value: response.data.sales });
        });
    },
    ConfirmAction({ dispatch, rootGetters }, payload) {
      rootGetters.axl.post('/actions/api/action/take-part', {
        profile_id: payload.profile_id,
        action_id: payload.action_id,
      })
        .then(() => {
          dispatch('GetActionsList', { profile_id: payload.profile_id });
        })
        .catch((error) => {
          dispatch('HandleError', error, { root: true });
        });
    },
    // eslint-disable-next-line consistent-return
    GetSale({ commit, state }, saleID) {
      commit('setField', { name: 'sale', value: null });
      if (state.sales.length) {
        if (saleID !== null) {
          const sale = state.sales.filter(item => item.id === saleID);
          sale.length && commit('setField', { name: 'sale', value: sale[0] });
          return sale[0];
          // eslint-disable-next-line no-else-return
        } else {
          commit('setField', { name: 'sale', value: null });
          return null;
        }
      }
    },
    GetProductsList({ commit, rootGetters }) {
      return new Promise((resolve) => {
        commit('setField', { name: 'products', value: [] });
        rootGetters.ax.post('sales/api/product/list-products')
          .then((response) => {
            commit('setField', { name: 'products', value: response.data.products });
            resolve();
          });
      });
    },
    GetActionsList({ commit, rootGetters }, payload) {
      commit('setField', { name: 'actions', value: [] });
      rootGetters.axl.post('actions/api/action/current-list', payload)
        .then((response) => {
          commit('setField', { name: 'actions', value: response.data.actions });
        });
    },
    GetAction({ commit, rootGetters, dispatch }, payload) {
      dispatch('ClearAction');
      if (payload.noClearSale === undefined) {
        dispatch('ClearSale');
      }
      rootGetters.axl.post('actions/api/action/view', payload)
        .then((response) => {
          commit('setField', { name: 'action', value: response.data.action });
          commit('setField', { name: 'categories', value: response.data.action.categories });
          commit('setField', { name: 'groups', value: response.data.action.groups });
          commit('setField', { name: 'products', value: response.data.action.products });
        });
    },
    ClearAction({ commit }) {
      commit('setField', { name: 'action', value: null });
      commit('setField', { name: 'categories', value: [] });
      commit('setField', { name: 'groups', value: [] });
      commit('setField', { name: 'products', value: [] });
    },
    ClearSale({ commit }) {
      commit('setField', { name: 'sale', value: null });
    },
    ClearSales({ commit }) {
      commit('setField', { name: 'sales', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
