export default {
  namespaced: true,
  state: {
    products: [],
    product: null,
    orders: [],
    cart: {
      products: [],
      cartLength: 0,
      cartSummary: 0,
    },
  },
  actions: {
    GetProducts({ commit, rootGetters, dispatch }) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('shop/api-v3/product/list')
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
    GetProduct({ commit, rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('shop/api-v3/product/view', payload)
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'product', value: response.data.product });
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
    GerOrders({ commit, rootGetters, dispatch }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('shop/api-v3/order/list', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'orders', value: response.data.orders });
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
    SendOrder({ dispatch, rootGetters }, payload) {
      rootGetters.axl.post('shop/api-v3/order/create', payload)
        .then(() => {
          dispatch('InitialStateShop');
          dispatch('ShowInfoMessage', 'Товары заказаны', { root: true });
        })
        .catch((error) => {
          dispatch('HandleError', error, { root: true });
        });
    },
    AddToCart({ commit, state }, payload) {
      return new Promise((resolve) => {
        const newCart = { ...state.cart };
        const product = { ...payload };
        if (!newCart.products.length || !newCart.products.find(item => product.id === item.id)) {
          newCart.products.push(product);
        } else if (newCart.products.length && newCart.products
          .find(item => product.id === item.id)) {
          newCart.products = newCart.products.map((item) => {
            if (product.id === item.id) {
              item.qty += product.qty;
            }
            return item;
          });
        }
        newCart.cartLength += product.qty;
        newCart.cartSummary += (product.price * product.qty);
        commit('setField', { name: 'cart', value: newCart });
        resolve(newCart);
      });
    },
    ChangeQty({ commit, state }, payload) {
      return new Promise((resolve) => {
        const newCart = { ...state.cart };
        const product = { ...payload };
        let length = 0;
        let sum = 0;
        newCart.products = newCart.products.map((item) => {
          if (product.id === item.id) {
            item.qty += product.qty;
          }
          length += item.qty;
          sum += (item.qty * item.price);
          return item;
        });
        newCart.cartLength = length;
        newCart.cartSummary = sum;
        commit('setField', { name: 'cart', value: newCart });
        resolve(newCart);
      });
    },
    RemoveProduct({ commit, state }, payload) {
      return new Promise((resolve) => {
        const newCart = { ...state.cart };
        let length = 0;
        let sum = 0;
        newCart.products = newCart.products.filter((item) => {
          if (payload.id !== item.id) {
            length += item.qty;
            sum += (item.qty * item.price);
            return true;
          }
          return false;
        });
        newCart.cartLength = length;
        newCart.cartSummary = sum;
        commit('setField', { name: 'cart', value: newCart });
        resolve(newCart);
      });
    },
    InitialStateShop({ commit }) {
      const cart = {
        products: [],
        cartLength: 0,
        cartSummary: 0,
      };
      commit('setField', { name: 'products', value: [] });
      commit('setField', { name: 'orders', value: [] });
      commit('setField', { name: 'product', value: null });
      commit('setField', { name: 'cart', value: cart });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
  },
};
