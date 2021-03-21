export default {
  props: ['menuItems'],
  components: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userAvatar() {
      return this.$store.state.user.full_name.split(' ').map(x => x[0]).join('');
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isBlocked() {
      return !!(this.$store.state.user
        && this.$store.state.user.blocked_at !== null);
    },
    extranet() {
      return this.$store.state.settings.extranet === true;
    },
    logoUrl() {
      return this.$store.state.settings.logoUrl;
    },
    newMobileNotifications() {
      return this.$store.state.mobileNotifications.notificationsNew;
    },
    epsCartLength() {
      return this.$store.state.eps.cartLength;
    },
    epsCartSummary() {
      return this.$store.state.eps.cartSummary;
    },
    productsCartLength() {
      return this.$store.state.shop.cart.cartLength;
    },
    productsCartSummary() {
      return this.$store.state.shop.cart.cartSummary;
    },
  },
  methods: {
    SetSidebar(status) {
      this.$store.dispatch('app/SetSidebar', status);
    },
    UserLogout() {
      console.log('logout');
      this.$store.dispatch('UserLogout');
      this.$router.push('/');
    },
  },
  created() {
    this.user && this.$store.dispatch('mobileNotifications/GetNotifications', this.user.profile_id);
  },
};
