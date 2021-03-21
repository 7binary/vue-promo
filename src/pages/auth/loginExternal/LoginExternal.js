export default {
  props: ['id', 'token'],
  methods: {
    Login() {
      if (this.$store.state.settings.extranet !== true) {
        this.$router.push('/');
      }

      const app = this;
      const data = { external_id: app.id, external_token: app.token };

      app.$store.getters.axl.post('api/login/external', data)
        .then((response) => {
          app.$store.dispatch('UserLogin', response.data);
          app.$router.push('/dashboard');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
  mounted() {
    this.Login();
  },
};
