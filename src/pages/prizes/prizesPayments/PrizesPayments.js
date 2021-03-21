const patternNumber = /^\d{1,10}$/;
const patternPurse = /^\d{12,15}$/;

export default {
  data() {
    return {
      current: {},
      enabledPaymentsMethods: [],
      settings: [],
      paymentFinish: false,
      form: {
        value: '',
        amount: '',
        valid: true,
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        phoneLength: value => (value && value.length >= 17) || 'Номер телефона заполнен не полностью',
        cardLength: value => (value && value.length >= 19) || 'Номер карты заполнен не полностью',
        summLength: value => (value && +value >= 1500) || 'Сумма должна быть больше 1500р',
        number: value => patternNumber.test(value) || 'Поле должно содержать только числа',
        purse: value => patternPurse.test(value) || 'Поле должно содержать только числа',
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    paymentsInfo() {
      const { paymentsInfo } = this.$store.state;
      return paymentsInfo;
    },
    hasTaxes() {
      return this.$store.state.settings.taxes === true;
    },
    userHasPassport() {
      return this.user && this.user.account && this.user.account.status === 'approved';
    },
  },
  methods: {
    GetPaymentsSettings() {
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
    handleChangeMethod(item) {
      this.current = item;
      this.ResetForm();
    },
    paymentSubmit() {
      const app = this;
      if (app.form.valid) {
        const payment = {
          profile_id: app.user.profile_id,
          type: app.current.type,
          amount: app.form.amount,
          parameters: {
            phone_mobile: app.form.value,
          },
        };
        app.$store.getters.axl.post('payments/api-v3/payments/create', payment)
          .then(() => {
            app.ResetForm();
            this.$store.dispatch('GetProfile');
            app.paymentFinish = true;
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      }
    },
    ResetForm() {
      this.$refs.form.reset();
      this.form.amount = '';
      this.form.value = '';
    },
  },
  async mounted() {
    await this.$store.dispatch('GetPaymentsSettings')
      .then((data) => {
        if (data && data.settings && data.settings.length) {
          const enabledPaymentsMethods = data.settings.filter(method => method.enabled);
          this.enabledPaymentsMethods = enabledPaymentsMethods;
          this.current = enabledPaymentsMethods.length ? enabledPaymentsMethods[0] : {};
        }
      });
  },
};
