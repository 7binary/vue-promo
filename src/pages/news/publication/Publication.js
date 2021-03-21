export default {
  props: ['id'],
  data() {
    return {
      pubID: this.$props.id,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    publication() {
      return this.$store.state.news.publication;
    },
  },
  methods: {
    setPublicationReaded() {
      const payload = {
        profile_id: this.user.profile_id,
        news_id: +this.pubID,
      };
      this.$store.dispatch('news/SetPublicationReaded', payload);
    },
  },
  created() {
    this.user.profile_id && this.pubID && this.setPublicationReaded();
    this.$store.dispatch('news/SetPublication', +this.$props.id);
  },
};
