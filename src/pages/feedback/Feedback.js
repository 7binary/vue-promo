const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  data() {
    return {
      categories_options: [],
      category: '',
      faq: [],
      documents: [],
      document: {
        name: '',
        file: '',
        url: '',
      },
      valid: false,
      name: '',
      email: '',
      phone: '',
      message: '',
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        phoneLength: value => (!value || value.length >= 17) || 'Номер телефона заполнен не полностью',
        email: value => pattern.test(value) || 'Поле E-mail заполнено с ошибками',
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
    loading() {
      return this.$store.state.loading;
    },
    isEnabled() {
      return !!this.name && !!this.email && !!this.phone && !!this.message;
    },
  },
  methods: {
    /** Получить категории формы обратной связи */
    GetFeedbackCategories() {
      const app = this;
      app.$store.getters.ax.post('feedback/api/feedback/feedback-categories')
        .then((response) => {
          if (response.data.categories) {
            app.categories = response.data.categories;
            app.categories_options = app.SetFormThemes(response.data.categories);
            app.category = response.data.categories.length ? response.data.categories[0].name : '';
          }
        });
    },
    /** Получить темы формы */
    SetFormThemes(category) {
      return category.map(item => item.name);
    },
    /** Проверить тип прикрепленного файла */
    CheckPDF(item) {
      return item.url && (item.url.indexOf('/pdf;') !== -1);
    },
    /** Получить путь до файла */
    GetFilePath(item) {
      if (item.url || item.file) {
        return item.url ? item.url : item.file;
      }
      return '';
    },
    /** Получить ID категории */
    GetCategoryID() {
      const arr = this.categories.filter(item => item.name === this.category);
      return arr[0].id;
    },
    /** Удалить документ из списка */
    HandleDeleteFile(item, index) {
      item.name === this.documents[index].name && this.documents.splice(index, 1);
    },
    /** Методы для работы с документами */
    PickDocument() {
      this.$refs.document.click();
    },
    OnDocument(e) {
      this.OnFilePicked(e);
    },
    OnFilePicked(e) {
      const app = this;
      const { files } = e.target;
      if (files[0] !== undefined) {
        const [file] = files;
        if (file.name.lastIndexOf('.') <= 0) {
          return;
        }
        app.document.name = file.name;

        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener('load', () => {
          app.document.file = null;
          app.document.url = fr.result;
          app.documents.push(app.document);
          app.document = { file: '', url: '', name: '' };
          app.$forceUpdate();
        });
      } else {
        app.document = { file: '', url: '', name: '' };
      }
    },
    GetFaq() {
      const app = this;
      app.$store.getters.ax.post('feedback/api/feedback/faq')
        .then((response) => {
          app.faq = response.data.faq.filter(item => item.is_published);
        });
    },
    /** Отправить данные формы обратной связи */
    FeedbackSubmit() {
      const app = this;
      if (app.$refs.feedbackForm.validate()) {
        const feedback = {
          name: app.name,
          email: app.email,
          phone_mobile_local: app.phone,
          content: app.message,
        };
        if (app.isAuthenticated) {
          feedback.profile_id = app.user.profile_id;
        }
        if (app.documents.length) {
          feedback.documents = app.documents;
        }
        feedback.category_id = app.category ? app.getCategoryID() : null;

        app.$store.getters.axl.post('feedback/api/feedback/feedback', feedback)
          .then(() => {
            app.$router.push(app.isAuthenticated ? '/dashboard' : '/');
            app.ResetForm();
            app.$store.dispatch('ShowInfo', 'Ваше сообщение успешно отправлено');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      }
    },
    /** Сбросить поля формы */
    ResetForm() {
      this.name = '';
      this.phone = '';
      this.email = '';
      this.message = '';
    },
  },
  mounted() {
    this.GetFaq();
    this.GetFeedbackCategories();
    if (this.isAuthenticated) {
      this.name = this.user.full_name;
      this.email = this.user.email;
      this.phone = this.user.phone_mobile;
    }
  },
};
