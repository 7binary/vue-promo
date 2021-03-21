export default {
  props: ['id'],
  data() {
    return {
      qty: 1,
      dialog: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    product() {
      return this.$store.state.shop.product;
    },
  },
  methods: {
    AddToCart(item) {
      const payload = item;
      payload.qty = this.qty;
      this.$store.dispatch('shop/AddToCart', payload);
      this.dialog = true;
    },
    ChangeQty(e) {
      this.qty = +e.target.value ? +e.target.value : this.qty = 1;
    },
  },
  created() {
    this.$store.dispatch('shop/GetProduct', { product_id: this.$props.id });
  },
};
