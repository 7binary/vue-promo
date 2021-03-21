export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    products() {
      return this.$store.state.shop.products;
    },
  },
  methods: {
    getProduct(id) {
      this.$router.push(`/shop-product/${id}`);
    },
  },
  created() {
    this.$store.dispatch('shop/GetProducts');
  },
};
