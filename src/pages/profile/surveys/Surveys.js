export default {
  data() {
    return {
      step: 1,
      questions: [],
      isValid: false,
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    survey() {
      return this.$store.state.surveys.survey;
    },
    checkAllValidate() {
      return !this.questions.filter(item => !item.isValid).length;
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('SetDialog', { dialog: 'surveys', value: false });
    },
    openDialog() {
      this.$store.commit('SetDialog', { dialog: 'surveys', value: true });
    },
    setQuestions() {
      if ((JSON.stringify(this.survey) !== '{}') && this.survey.questions.length) {
        this.questions = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.survey.questions.length; i++) {
          this.questions.push({
            ...this.survey.questions[i],
            answer: {
              id: this.survey.questions[i].id,
              checked: (this.survey.questions[i].multiple) ? [] : 0,
              user_comment: '',
            },
            isValid: false,
          });
          this.openDialog();
        }
      }
    },
    checkUserComment(item) {
      let require = false;
      if (item.answer.checked === 0 || item.answer.checked.length === 0) {
        require = true;
      }
      return require;
    },
    questionValidate(item) {
      let isValid = false;
      if (item.custom && item.answer.user_comment) {
        isValid = true;
      }
      if (!item.multiple && item.answer.checked) {
        isValid = true;
      }
      if (item.multiple && item.answer.checked.length) {
        isValid = true;
      }
      item.isValid = isValid;
      return isValid;
    },
    prevStep() {
      if (this.step > 1) {
        this.step = this.step - 1;
      }
    },
    nextStep() {
      if (this.survey.questions.length !== this.step) {
        this.step = this.step + 1;
      }
    },
    setTimeStamp() {
      return Math.round(new Date().getTime() / 1000);
    },
    submitLater() {
      this.closeDialog();
      this.$store.commit('surveys/SetLastShowTime', { id: this.survey.id, time: this.setTimeStamp() });
    },
    submit() {
      if (this.checkAllValidate) {
        const app = this;
        const survey = {
          profile_id: app.user.profile_id,
          survey_id: app.survey.id,
          type: 'answer',
          questions: {},
        };
        survey.questions = app.questions.map(item => item.answer);

        app.$store.getters.axl.post('survey/api/surveys/survey-answer', survey)
          .then(() => {
            app.$store.dispatch('ShowInfo', 'Ваш опрос успешно отправлен');
            app.closeDialog();
            this.$store.commit('surveys/SetLastShowTime', { id: app.survey.id, time: null });
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      }
    },
  },
  created() {
    this.$store.dispatch('GetProfile');
    this.setQuestions();
  },
};
