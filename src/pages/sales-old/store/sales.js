export default {
  namespaced: true,
  state: {
    sales: [],
    sale: null,
    products: [],
  },
  actions: {
    GetSalesList({ commit, rootGetters, dispatch }, payload) {
      commit('setField', { name: 'sales', value: [] });
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('sales/api/sale/list', payload)
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'sales', value: response.data.sales });
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
    GetSale({ commit, state }, saleID) {
      commit('setField', { name: 'sale', value: null });
      return new Promise((resolve, reject) => {
        if (state.sales.length) {
          if (saleID !== null) {
            const sale = state.sales.filter(item => item.id === saleID);
            sale.length && commit('setField', { name: 'sale', value: sale[0] });
          } else {
            commit('setField', { name: 'sale', value: null });
          }
          resolve();
        }
        reject(new Error('no sales'));
      });
    },
    GetProductsList({ commit, rootGetters, dispatch }) {
      commit('setField', { name: 'products', value: [] });
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('sales/api/product/list-products')
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'products', value: response.data.products });
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
    InitialStoreSales({ commit }) {
      commit('setField', { name: 'sales', value: [] });
      commit('setField', { name: 'sale', value: null });
      commit('setField', { name: 'products', value: [] });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
