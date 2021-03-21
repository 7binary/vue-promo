import axios from 'axios';

export default {
  data() {
    return {
      dialogOrdered: false,
      checkbox: false,
      form: {
        delivery_email: this.$store.state.user.email,
        delivery_address: '',
        is_allow_cancel: false,
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    balance() {
      return this.$store.state.user.balance * 1;
    },
    userHasPassport() {
      return this.user && this.user.account && this.user.account.status === 'approved';
    },
    loading() {
      return this.$store.state.loading;
    },
    cart() {
      return this.$store.state.eps.cart;
    },
    cartSummary() {
      return this.$store.state.eps.cartSummary;
    },
    cartLength() {
      return this.$store.state.eps.cartLength;
    },
    productsCartLength() {
      return this.$store.state.shop.cart.cartLength;
    },
    cards() {
      return this.$store.state.eps.cards;
    },
    hasPlastic() {
      let hasPlastic = false;
      Object.keys(this.cart).forEach((cardType) => {
        for (let i = 0; i < this.cards.length; i += 1) {
          if (this.cards[i].type === cardType && this.cards[i].is_plastic) {
            hasPlastic = true;
          }
        }
      });
      return hasPlastic;
    },
  },
  mounted() {
    this.dialogOrdered = false;
    this.form.is_allow_cancel = false;
    this.form.delivery_email = this.$store.state.user.email;
    this.form.delivery_address = '';
    this.$store.dispatch('GetProfile');
    this.$store.dispatch('eps/GetCards');
  },
  methods: {
    GetCard(cardType) {
      for (let i = 0; i < this.cards.length; i += 1) {
        if (this.cards[i].type === cardType) {
          return this.cards[i];
        }
      }
      return null;
    },
    GetCardTitle(price, cardType) {
      const card = this.GetCard(cardType);
      let text = card.title;
      for (let i = 0; i < card.nominals_text.length; i += 1) {
        if (card.nominals_text[i].price === parseInt(price, 10)) {
          text = `${text} ${card.nominals_text[i].nominal}`;
        }
      }
      return text;
    },
    GetCardHint(price, cardType) {
      const card = this.GetCard(cardType);
      for (let i = 0; i < card.nominals_text.length; i += 1) {
        if (card.nominals_text[i].price === parseInt(price, 10)) {
          return `${card.nominals_text[i].text}`;
        }
      }
      return '';
    },
    ChangeQty(cardType, nominal, qty) {
      if (qty <= 0) {
        this.RemoveCard(cardType, nominal);
        return;
      }
      this.$store.dispatch('eps/ChangeQty', { cardType, nominal, qty });
    },
    RemoveCard(cardType, nominal) {
      this.$store.dispatch('eps/RemoveCard', { cardType, nominal });
    },
    SendOrder() {
      const app = this;
      const formData = app.form;
      formData.profile_id = app.user.profile_id;
      formData.items = app.$store.getters['eps/cartItems'];

      app.$store.getters.axl.post('catalog/api-v3/orders/create', formData)
        .then(() => {
          app.dialogOrdered = true;
          app.$store.dispatch('GetProfile', app.user.profile_id);
          app.$store.dispatch('eps/GetOrders', app.user.profile_id);
          app.$store.dispatch('eps/ClearCart');
          this.$router.push('/prizes');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
    GoToOrders() {
      this.$router.push('/orders');
    },
    AutocompleteSearch(queryString, cb) {
      if (!queryString) return;
      const app = this;
      const info = { count: 20, query: queryString };
      const config = {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Authorization: 'Token 7a77efb8ab6dae6e380c7e438b85360185660f34',
          'Content-Type': 'application/json',
        },
      };

      axios.post('https://dadata.ru/api/v2/suggest/address', info, config)
        .then((res) => {
          app.suggestions = res.data.suggestions;
          cb(app.suggestions);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    AutocompleteSelect(item) {
      this.suggestions.forEach((sug) => {
        if (sug.value === item.value) {
          this.form.address_data = sug.data;
          document.getElementById('delivery-address').focus();
        }
      });
    },
  },
};
