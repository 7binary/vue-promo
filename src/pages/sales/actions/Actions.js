export default {
  data() {
    return {
      description: '',
      showDescID: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    actions() {
      return this.$store.state.sales.actions;
    },
  },
  methods: {
    AddSale(id) {
      this.$router.push(`/sale/${id}/null`);
    },
    ShowDesc(id) {
      const actions = this.actions.filter(item => item.id === id);
      if (this.showDescID === id) {
        this.description = '';
        this.showDescID = false;
      } else {
        this.showDescID = id;
        this.description = actions.length ? actions[0].description : '';
      }
    },
    EditSale(id) {
      this.$store.dispatch('sales/GetSale', id);
      this.$router.push(`/sale/null/${id}`);
    },
    ConfirmAction(id) {
      this.$store.dispatch('sales/ConfirmAction', {
        profile_id: this.user.profile_id,
        action_id: id,
      });
    },
  },
  mounted() {
    this.$store.dispatch('sales/ClearAction');
    this.$store.dispatch('sales/ClearSale');
    this.$store.dispatch('sales/GetActionsList', { profile_id: this.user.profile_id });
  },
};
