import axios from 'axios';

export default {
  data() {
    return {
      delivery_address: '',
      address_data: '',
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
      return this.$store.state.shop.cart;
    },
    epsCartLength() {
      return this.$store.state.eps.cartLength;
    },
  },
  methods: {
    ChangeQty(product) {
      if (+product.qty <= 0) {
        this.RemoveProduct(product.id);
        return;
      }
      this.$store.dispatch('shop/ChangeQty', { product });
    },
    RemoveProduct(id) {
      this.$store.dispatch('shop/RemoveProduct', { id });
    },
    SendOrder() {
      const app = this;
      const payload = {
        profile_id: app.user.profile_id,
        phone_mobile: app.user.phone_mobile,
        email: app.user.email,
        delivery_address: app.delivery_address,
        items: app.cart.products.map(product => ({
          id: product.id,
          qty: product.qty,
          size: '',
        })),
      };
      app.$router.push('/orders');
      app.$store.dispatch('shop/SendOrder', payload);
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
          this.address_data = sug.data;
        }
      });
    },
  },
  created() {
  },
};
