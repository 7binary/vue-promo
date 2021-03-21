import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    cards: [], // Список всех карт ЭПС, доступных для заказа.
    card: {}, // Выбранная электронная карта для детального просмотра.
    orders: [], // Заказы ЭПС.
    cart: {},
    cartLength: 0,
    cartSummary: 0,
  },
  actions: {
    GetOrders({ commit, rootGetters, dispatch }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('catalog/api-v3/users/orders', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('SetOrders', response.data.orders);
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
    GetCards({ commit, rootGetters, dispatch }) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('catalog/api-v3/cards/list')
          .then((response) => {
            if (response && response.data) {
              commit('SetCards', response.data.cards);
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
    GetCard({ state, commit }, type) {
      return new Promise((resolve, reject) => {
        const card = state.cards.find(item => item.type === type);
        if (card) {
          commit('SetCard', card);
          resolve(card);
        }
        reject(new Error('card is not found'));
      });
    },
    AddToCart({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        if (payload.card.nominal === undefined || !payload.card.nominal || !payload.qty) {
          reject(new Error('card is not added'));
        }
        commit('AddToCart', { card: payload.card, qty: payload.qty });
        dispatch('CountCart');
        resolve({ card: payload.card, qty: payload.qty });
      });
    },
    ChangeQty({ commit, dispatch }, payload) {
      return new Promise((resolve) => {
        commit('ChangeQty', payload);
        dispatch('CountCart');
        resolve();
      });
    },
    RemoveCard({ commit, dispatch }, payload) {
      return new Promise((resolve) => {
        commit('RemoveCard', payload);
        dispatch('CountCart');
        resolve();
      });
    },
    CountCart({ state, commit }) {
      return new Promise((resolve) => {
        let cartSummary = 0;
        let cartLength = 0;
        Object.keys(state.cart).forEach((cardType) => {
          Object.keys(state.cart[cardType]).forEach((nominal) => {
            if (nominal !== 'card' && state.cart[cardType][nominal]) {
              const qty = parseInt(state.cart[cardType][nominal], 10);
              cartLength = parseInt(cartLength, 10) + qty;
              cartSummary = parseInt(cartSummary, 10) + qty * nominal;
            }
          });
        });
        commit('SetCartLength', cartLength);
        commit('SetCartSummary', cartSummary);
        resolve(cartLength);
      });
    },
    ClearCart({ commit }) {
      commit('ClearCart');
    },
    InitialStoreEps({ commit }) {
      commit('InitialStoreEps');
    },
  },
  mutations: {
    RemoveCard(state, payload) {
      Vue.delete(state.cart[payload.cardType], payload.nominal);
    },
    ChangeQty(state, payload) {
      Vue.set(state.cart[payload.cardType], payload.nominal, payload.qty);
    },
    AddToCart(state, payload) {
      const nominal = `${payload.card.nominal}`;
      if (state.cart[payload.card.type]) {
        if (state.cart[payload.card.type][nominal]) {
          Vue.set(state.cart[payload.card.type], nominal,
            state.cart[payload.card.type][nominal] + payload.qty);
        } else {
          Vue.set(state.cart[payload.card.type], nominal, payload.qty);
        }
      } else {
        Vue.set(state.cart, payload.card.type, { card: payload.card });
        Vue.set(state.cart[payload.card.type], nominal, payload.qty);
      }
      if (!state.cart[payload.card.type].card) {
        Vue.set(state.cart[payload.card.type], 'card', payload.card);
      }
    },
    ClearCart(state) {
      state.cart = {};
      state.cartLength = 0;
      state.cartSummary = 0;
    },
    InitialStoreEps(state) {
      state.cards = [];
      state.card = {};
      state.orders = [];
      state.cart = {};
      state.cartLength = 0;
      state.cartSummary = 0;
    },
    SetCartLength(state, length) {
      state.cartLength = length;
    },
    SetCartSummary(state, summary) {
      state.cartSummary = summary;
    },
    SetCards(state, cards) {
      state.cards = cards;
    },
    SetOrders(state, orders) {
      state.orders = orders;
    },
    SetCard(state, card) {
      state.card = card;
    },
  },
  getters: {
    cartItems(state) {
      const items = [];
      if (!state.cart || state.cart.length === 0) {
        return [];
      }
      Object.keys(state.cart).forEach((cardType) => {
        Object.keys(state.cart[cardType]).forEach((nominal) => {
          if (nominal !== 'card' && state.cart[cardType][nominal]) {
            const qty = parseInt(state.cart[cardType][nominal], 10);
            for (let i = 0; i < state.cards.length; i += 1) {
              if (state.cards[i].type === cardType) {
                const card = state.cards[i];
                for (let j = 0; j < card.nominals_text.length; j += 1) {
                  if (card.nominals_text[j].price === parseInt(nominal, 10)) {
                    items.push({
                      card: cardType,
                      nominal: card.nominals_text[j].nominal,
                      qty,
                    });
                  }
                }
              }
            }
          }
        });
      });
      return items;
    },
  },
};
