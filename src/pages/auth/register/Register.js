const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  props: ['usertype'],
  data() {
    return {
      user: {
        phone: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        checkedPers: false,
      },
      pageRules: null,
      pagePers: null,
      dialogRules: false,
      dialogPers: false,
      code: '',
      sentCode: false,
      token: null,
      hidePw: true,
      rules: {
        required: v => !!v || 'Поле должно быть заполнено',
        email: v => pattern.test(v) || 'Поле E-mail заполнено с ошибками',
        password: v => !!v || 'Укажите пароль',
        phone: v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
        code: v => !!v || 'Укажите проверочный код',
      },
      valid: false,
      profile: {},
      search: '',
      cities: [],
      specialties: [],
      dealers: [],
      searchDealer: '',
      searchDealerObj: null,
    };
  },
  computed: {
    requireRules() {
      return this.$store.state.settings.register_rules === true;
    },
    requirePers() {
      return this.$store.state.settings.register_pers === true;
    },
    type() {
      if (this.$store.state.settings.registration === 'unregistered_by_phone') {
        return 'sms_noprofile_or_unregistered';
      }
      if (this.$store.state.settings.registration === 'existing_by_phone') {
        return 'sms_profile_unregistered';
      }
      if (this.$store.state.settings.registration === 'free_by_phone') {
        return 'sms_noprofile';
      }
      return null;
    },
    comparePasswords() {
      return this.user.password === this.user.passwordConfirm ? true : 'Пароли не совпадают';
    },
    loading() {
      return this.$store.state.loading;
    },
    settings() {
      return this.$store.state.settings;
    },
  },
  methods: {
    /** Предзагрузка данных в форму если участник добавлен в админке */
    LoadRegInfo() {
      const app = this;
      app.$store.getters.ax.post('profiles/api/register/info', { phone: app.user.phone })
        .then((response) => {
          app.pagePers = response.data.pagePers;
          app.pageRules = response.data.pageRules;
          const { profile } = response.data;
          if (profile) {
            app.user.first_name = profile.first_name;
            app.user.last_name = profile.last_name;
            app.user.middle_name = profile.middle_name;
            app.user.email = profile.email;
          }
        });
    },
    /** Фокус на указанное поле */
    Focus(id) {
      this.$nextTick(() => {
        document.getElementById(id).focus();
      });
    },
    /** Сброс полей формы */
    Reset() {
      this.user = {
        phone: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        specialty: '',
        email: '',
        password: '',
        passwordConfirm: '',
        checkedRules: false,
        checkedPers: false,
      };
      this.sentCode = false;
      this.code = '';
      this.token = null;
      this.dialogRules = false;
      this.dialogPers = false;
      this.Focus('regPhone');
    },
    /** Отправка проверочного СМС кода */
    SendCode() {
      const app = this;
      app.$store.getters.axl.post('api/token/get-sms', { phone: app.user.phone, type: app.type })
        .then(() => {
          app.sentCode = true;
          app.Focus('regCode');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
          app.Focus('regPhone');
        });
    },
    /** Проверка кода полученного в СМС */
    CheckCode() {
      const app = this;
      app.$store.getters.axl.post('api/token/check-sms', { phone: app.user.phone, type: app.type, code: app.code })
        .then((response) => {
          app.token = response.data.token;
          app.Focus('regLastName');
          app.LoadRegInfo();
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
          app.Focus('regCode');
        });
    },
    /** Отправка регистрационных данных в приложение */
    Register() {
      const app = this;
      const formData = app.user;
      formData.token = app.token;
      if (!app.requireRules) {
        formData.checkedRules = true;
      }
      if (!app.requirePers) {
        formData.checkedPers = true;
      }
      formData.birthday_on_local = app.profile.birthday;
      formData.gender = app.profile.gender;
      formData.specialty = app.profile.specialty;
      formData.city_local = app.profile.city;
      formData.role = app.profile.role;
      formData.dealer_id = app.profile.dealer_id;

      app.$store.getters.axl.post('profiles/api/register', formData)
        .then((response) => {
          app.$store.commit('SetLogged', response.data);
          app.Reset();
          app.$store.dispatch('ShowInfo', 'Добро пожаловать в программу!');
          app.$router.push('/dashboard');
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
  watch: {
    search(term) {
      term && this.$store.getters.ax.post('location/api/cities/autocomplete', { term })
        .then((result) => {
          this.cities = result.data.cities;
        });
    },
    searchDealer(name) {
      name && this.$store.getters.ax.post('profiles/api/register/autocomplete-company', {
        name, type: this.$props.usertype,
      })
        .then((result) => {
          this.dealers = result.data.dealers;
        });
    },
  },
  mounted() {
    if (this.$store.state.settings.extranet === true) {
      this.$router.push('/');
    }
    this.$store.dispatch('GetSettings');
    this.Focus('regPhone');
    if (this.$props.usertype === 'rtt') {
      this.specialties = [
        { title: 'Руководитель в точке продаж', value: 'rtt_leader' },
        { title: 'Продавец в точке продаж', value: 'rtt_manager' },
      ];
    } else if (this.$props.usertype === 'dealer') {
      this.specialties = [
        { title: 'Руководитель отдела продаж', value: 'dealer_leader' },
        { title: 'Менеджер отдела продаж', value: 'dealer_manager' },
      ];
    }
  },
};
