export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    instructions() {
      return this.$store.state.news.instructions;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    getPublication(id) {
      this.$store.dispatch('news/SetInstruction', id);
      this.$router.push(`/instruction/${id}`);
    },
  },
  created() {
    this.user.profile_id && this.$store.dispatch('news/GetInstructions', this.user.profile_id);
  },
};
