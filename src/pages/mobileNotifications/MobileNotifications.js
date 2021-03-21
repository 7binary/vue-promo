export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    notifications() {
      return this.$store.state.mobileNotifications.notificationsList;
    },
    hasNotifications() {
      return this.$store.state.mobileNotifications.hasNotifications;
    },
  },
  created() {
    this.user && this.$store.dispatch('mobileNotifications/GetNotifications', this.user.profile_id);
  },
  beforeDestroy() {
    this.user && this.$store.dispatch('mobileNotifications/GetNotifications', this.user.profile_id);
  },
  updated() {
    this.$nextTick(() => {
      this.hasNotifications && this.user && this.$store.dispatch('mobileNotifications/setNotificationsRead', {
        profile_id: this.user.profile_id,
        notification_ids: this.notifications.map(item => item.id),
      });
    });
  },
};
