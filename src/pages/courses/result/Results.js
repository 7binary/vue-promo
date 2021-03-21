export default {
  props: ['id'],
  computed: {
    user() {
      return this.$store.state.user;
    },
    results() {
      return this.$store.state.courses.testResultsList;
    },
  },
  methods: {
    correctPercent(correct, wrong, all) {
      return Math.round(correct / (all / 100));
    },
  },
  mounted() {
    this.$store.dispatch('courses/GetResultsList', { profile_id: this.user.profile_id, test_id: this.id });
  },
};
