export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    notification() {
      return this.$store.state.notifications.notification;
    },
  },
  methods: {
    setTimeStamp() {
      return Math.round(new Date().getTime() / 1000);
    },
    submitLater() {
      this.$store.commit('SetDialog', { dialog: 'notifications', value: false });
      this.$store.commit('notifications/SetLastShowTime', { id: this.notification.id, time: this.setTimeStamp() });
      this.user && this.$store.dispatch('notifications/GetNotifications', this.user.profile_id);
      this.$store.commit('SetDialog', { dialog: 'notifications', value: true });
    },
    submit() {
      this.user && this.$store.dispatch('notifications/successNotification', {
        profile_id: this.user.profile_id, notification_id: this.notification.id,
      });
      this.user && this.$store.dispatch('notifications/GetNotifications', this.user.profile_id);
    },
  },
  mounted() {
    console.log(this.notification);
  },
};
