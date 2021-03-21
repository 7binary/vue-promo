export default {
  mounted() {
    this.$store.dispatch('webpush/OpenPopup');
  },
  methods: {
    WebpushClosePopup() {
      this.$store.dispatch('webpush/ClosePopup');
    },
    WebpushDecline() {
      this.$store.dispatch('webpush/Decline');
    },
    WebpushRequestPermission() {
      this.$store.dispatch('webpush/RequestPermission');
    },
  },
};
