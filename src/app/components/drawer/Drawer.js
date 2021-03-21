export default {
  props: ['menuItems'],
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isBlocked() {
      return !!(this.$store.state.user
        && this.$store.state.user.blocked_at !== null);
    },
    epsCartLength() {
      return this.$store.state.eps.cartLength;
    },
    productsCartLength() {
      return this.$store.state.shop.cart.cartLength;
    },
    showCart() {
      return !!(
        (this.isAuthenticated && !this.isBlocked)
          && (this.epsCartLength || this.productsCartLength)
      );
    },
    newMobileNotifications() {
      return this.$store.state.mobileNotifications.notificationsNew;
    },
    showNotification() {
      return !!(this.newMobileNotifications && this.newMobileNotifications.length);
    },
    userAvatar() {
      return this.$store.state.user
        .full_name.split(' ').map(x => x[0]).join('');
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
  },
  methods: {
    CloseDrawer() {
      this.$store.dispatch('app/SetSidebar', false);
    },
    CloseDrawerOutline(status) {
      !status && this.CloseDrawer();
    },
    UserLogout() {
      console.log('logout');
      this.$store.dispatch('UserLogout');
      this.$router.push('/');
    },
  },
};
