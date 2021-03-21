import EpsCart from '../prizes/epsCart/EpsCart.vue';
import ProductsCart from '../shop/productsCart/ProductsCart.vue';

export default {
  components: {
    EpsCart,
    ProductsCart,
  },
  data() {
    return {};
  },
  computed: {
    productsCartLength() {
      return this.$store.state.shop.cart.cartLength;
    },
    epsCartLength() {
      return this.$store.state.eps.cartLength;
    },
  },
};
