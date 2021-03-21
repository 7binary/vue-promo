const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  data() {
    return {
      valid: false,
      profile: {},
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        email: value => pattern.test(value) || 'Поле E-mail заполнено с ошибками',
      },
      search: '',
      cities: [],
      specialties: [],
      dealers: [],
      searchDealer: '',
      searchDealerObj: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    loading() {
      return this.$store.state.loading;
    },
    settings() {
      return this.$store.state.settings;
    },
  },
  methods: {
    createUser() {
      this.profile = { ...this.user };
      if (this.user.dealer) {
        this.dealers.push(this.user.dealer);
      }
    },
    profileSubmit() {
      const app = this;
      if (this.$refs.form.validate() && this.isAuthenticated) {
        const profile = {
          profile_id: app.profile.profile_id,
          dealer_id: app.profile.dealer_id,
          last_name: app.profile.last_name,
          first_name: app.profile.first_name,
          middle_name: app.profile.middle_name,
          email: app.profile.email,
          birthday_on: app.profile.birthday_on,
          city_local: app.profile.city_local,
          gender: app.profile.gender,
          specialty: app.profile.specialty,
          role: app.profile.role,
        };
        app.$store.getters.axl.post('profiles/api/auth/profile-edit', profile)
          .then(() => {
            app.$store.dispatch('ShowInfo', 'Ваш профиль был успешно обновлён');
            this.$router.push({ name: 'dashboard' });
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      } else {
        app.$store.dispatch('HandleError', 'Ошибка отправки формы');
      }
    },
  },
  watch: {
    search(val) {
      if (val) {
        this.$store.getters.ax.post('location/api/cities/autocomplete', { term: val })
          .then((result) => {
            this.cities = result.data.cities;
          });
      }
    },
    searchDealer(name) {
      name && this.$store.getters.ax.post('profiles/api/register/autocomplete-company', { name })
        .then((result) => {
          this.dealers = result.data.dealers;
        });
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$store.dispatch('eps/GetOrders', this.user.profile_id);
      this.createUser();
      this.user.city_local ? this.search = this.user.city_local : '';
      if (this.profile.role === 'rtt') {
        this.specialties = [
          { title: 'Руководитель в точке продаж', value: 'rtt_leader' },
          { title: 'Продавец в точке продаж', value: 'rtt_manager' },
        ];
      } else if (this.profile.role === 'dealer') {
        this.specialties = [
          { title: 'Руководитель отдела продаж', value: 'dealer_leader' },
          { title: 'Менеджер отдела продаж', value: 'dealer_manager' },
        ];
      }
    }
  },
};
