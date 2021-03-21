export default {
  data() {
    return {
      user: {
        phone: '',
        password: '',
        passwordConfirm: '',
      },
      type: 'sms_profile',
      code: '',
      sentCode: false,
      token: null,
      hidePw: true,
      phoneRules: [
        v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
      ],
      codeRules: [
        v => !!v || 'Укажите проверочный код',
      ],
      passwordRules: [
        v => !!v || 'Укажите пароль',
      ],
    };
  },
  computed: {
    comparePasswords() {
      return this.user.password === this.user.passwordConfirm ? true : 'Пароли не совпадают';
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  created() {
    this.Focus('remindPhone');
  },
  mounted() {
    if (this.$store.state.settings.extranet === true) {
      this.$router.push('/');
    }
  },
  methods: {
    Focus(id) {
      this.$nextTick(() => {
        document.getElementById(id).focus();
      });
    },
    Reset() {
      this.user = {
        phone: '',
        password: '',
        passwordConfirm: '',
      };
      this.sentCode = false;
      this.code = '';
      this.token = null;
      this.Focus('remindPhone');
    },
    Back() {
      this.Reset();
      this.$router.push('/login');
    },
    SendCode() {
      const app = this;
      app.$store.getters.axl.post('api/token/get-sms', { phone: app.user.phone, type: app.type })
        .then(() => {
          app.sentCode = true;
          app.Focus('remindCode');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
          app.Focus('remindPhone');
        });
    },
    CheckCode() {
      const app = this;
      app.$store.getters.axl.post('api/token/check-sms', { phone: app.user.phone, type: app.type, code: app.code })
        .then((response) => {
          app.token = response.data.token;
          app.Focus('regLastName');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
          app.Focus('regCode');
        });
    },
    Remind() {
      const app = this;
      const formData = app.user;
      formData.token = app.token;

      app.$store.getters.axl.post('api/remind', formData)
        .then((response) => {
          app.Reset();
          app.$store.dispatch('ShowInfo', response.data.msg);
          app.$router.push('/login');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
};
