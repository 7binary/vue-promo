export default {
  data() {
    return {
      login: '',
      password: '',
      hidePw: true,
      loginRules: [
        v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
      ],
    };
  },
  mounted() {
    if (this.$store.state.settings.extranet === true) {
      this.$router.push('/');
    }
  },
  methods: {
    Login() {
      const app = this;
      app.$store.getters.axl.post('api/login', { login: app.login, password: app.password })
        .then((response) => {
          app.$store.dispatch('UserLogin', response.data);
          app.$router.push('/dashboard');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
