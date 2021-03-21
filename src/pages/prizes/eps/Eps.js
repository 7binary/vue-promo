import Scrollbar from 'smooth-scrollbar';

export default {
  data() {
    return {
      dialogAdded: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    cards() {
      return this.$store.state.eps.cards;
    },
  },
  mounted() {
    this.$store.dispatch('eps/GetCards');
    Scrollbar.initAll();
  },
  methods: {
    Add(card) {
      const app = this;
      if (card.nominal === undefined || !card.nominal) {
        document.getElementById(`select-card-${card.id}`).click();
        return;
      }
      app.$store.dispatch('eps/AddToCart', card);
      app.dialogAdded = true;
      card.nominal = null;
    },
    GoToCart() {
      this.$router.push('/cart');
    },
  },
};
