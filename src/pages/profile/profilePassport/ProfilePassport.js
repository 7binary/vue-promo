import axios from 'axios';

export default {
  data() {
    return {
      form: {
        last_name: '',
        first_name: '',
        middle_name: '',
        birthday_on_local: '',
        document_series_and_number: '',
        inn: '',
        address: '',
        address_data: null,
        status: '',
        status_label: '',
        comments: [],
        document1_api: { file: '', url: '', name: '' },
        document2_api: { file: '', url: '', name: '' },
      },
      suggestions: [],
      suggestions_items: [],
      rules: {
        required: v => !!v || 'Поле должно быть заполнено',
      },
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    user() {
      return this.$store.state.user;
    },
    account() {
      return this.$store.state.user.account;
    },
  },
  mounted() {
    this.$store.dispatch('GetProfile');
    this.LoadPassport();
  },
  methods: {
    LoadPassport() {
      const app = this;
      app.$store.getters.ax.post('taxes/api/ndfl/ndfl-info', { profile_id: app.user.profile_id })
        .then((res) => {
          if (res.data.form) {
            delete res.data.form.document1;
            delete res.data.form.document2;
            app.form = res.data.form;
            console.log(app.form);
          } else {
            app.LoadFromUser();
          }
        });
    },
    LoadFromUser() {
      this.form.last_name = this.user.last_name;
      this.form.first_name = this.user.first_name;
      this.form.middle_name = this.user.middle_name;
      this.form.birthday_on_local = this.user.birthday_on;
    },
    AutocompleteSearch(queryString, cb) {
      if (!queryString) return;
      const app = this;
      const info = { count: 20, query: queryString };
      const config = {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Authorization: 'Token 7a77efb8ab6dae6e380c7e438b85360185660f34',
          'Content-Type': 'application/json',
        },
      };

      axios.post('https://dadata.ru/api/v2/suggest/address', info, config)
        .then((res) => {
          app.suggestions = res.data.suggestions;
          cb(app.suggestions);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    AutocompleteSelect(item) {
      this.suggestions.forEach((sug) => {
        if (sug.value === item.value) {
          this.form.address_data = sug.data;
          document.getElementById('form-address').focus();
        }
      });
    },
    PickDocument1() {
      this.$refs.document1.click();
    },
    PickDocument2() {
      this.$refs.document2.click();
    },
    OnDocument1(e) {
      this.OnFilePicked(e, 1);
    },
    OnDocument2(e) {
      this.OnFilePicked(e, 2);
    },
    OnFilePicked(e, docNumber) {
      const app = this;
      const { files } = e.target;
      if (files[0] !== undefined) {
        const [file] = files;
        if (file.name.lastIndexOf('.') <= 0) {
          return;
        }
        if (docNumber === 1) {
          app.form.document1_api.name = file.name;
        } else {
          app.form.document2_api.name = file.name;
        }
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener('load', () => {
          if (docNumber === 1) {
            app.form.document1_api.file = null;
            app.form.document1_api.url = fr.result;
          } else {
            app.form.document2_api.file = null;
            app.form.document2_api.url = fr.result;
          }
          app.$forceUpdate();
        });
      } else {
        docNumber === 1
          ? app.app.form.document1_api = { file: '', url: '', name: '' }
          : app.app.form.document2_api = { file: '', url: '', name: '' };
      }
    },
    SavePassport() {
      const app = this;
      const data = app.form;
      data.profile_id = app.user.profile_id;

      app.$store.getters.axl.post('taxes/api/ndfl/save-passport', data)
        .then((response) => {
          app.$store.dispatch('ShowInfo', 'Анкета сохранена!');
          console.log(response.data);
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
};
