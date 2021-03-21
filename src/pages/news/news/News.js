export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    news() {
      return this.$store.state.news.news;
    },
  },
  methods: {
    getPublication(id) {
      this.$router.push(`/publication/${id}`);
    },
  },
  created() {
    this.user.profile_id && this.$store.dispatch('news/GetNews', this.user.profile_id);
  },
};
