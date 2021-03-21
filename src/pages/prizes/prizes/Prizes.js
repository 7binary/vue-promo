import Payments from '../prizesPayments/PrizesPayments.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    Payments,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    requirePers() {
      return this.$store.state.settings.profile_pers === true && !this.$store.state.user.pers_at;
    },
    hasEps() {
      return this.$store.state.settings.eps === true;
    },
    hasPayments() {
      return this.$store.state.settings.payments === true;
    },
    hasShop() {
      return this.$store.state.settings.shop === true;
    },
    cards() {
      return this.$store.state.eps.cards;
    },
  },
  methods: {
    GetDetails(type) {
      this.$router.push(`eps/${type}`);
    },
    expand(i) {
      const elName = `expand-block-${i}`;
      const el = this.$refs[elName][0];
      if (this.cards[i].active === false || this.cards[i].active === undefined) {
        this.cards[i].active = true;
        el.classList.add('expand-block-show');
        el.classList.remove('expand-block-hide');
      } else {
        this.cards[i].active = false;
        el.classList.add('expand-block-hide');
        el.classList.remove('expand-block-show');
      }
    },
  },
  mounted() {
    const app = this;
    if (app.requirePers) {
      app.$router.push('/dashboard', () => {
        setTimeout(() => {
          app.$store.dispatch('ShowError', 'Для раздела "Призы" необходимо согласие на обработку персональных данных!');
        }, 500);
      });
    }
    if (app.hasEps) {
      app.$store.dispatch('eps/GetCards');
    }
  },
};
