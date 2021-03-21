export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    bonusesList() {
      return this.$store.state.bonuses.bonusesList || [];
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    PriceFormat(val) {
      const price = Number.prototype.toFixed.call(parseFloat(val) || 0, 2);
      const priceSep = price.replace(/(\D)/g, ',');
      return `${priceSep.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} руб`;
    },
  },
  mounted() {
    this.$store.dispatch('GetProfile');
    this.user && this.$store
      .dispatch('bonuses/GetBonusesList', { profile_id: this.user.profile_id });
  },
};
