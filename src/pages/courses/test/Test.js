export default {
  props: ['id'],
  data() {
    return {
      step: 0,
      questions: [],
      isValid: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    course() {
      return this.$store.state.courses.course;
    },
    test() {
      return this.$store.state.courses.course.tests[0];
    },
    try() {
      return this.$store.state.courses.try;
    },
  },
  methods: {
    setQuestions() {
      if (this.test.questions.length) {
        this.questions = [];
        for (let i = 0; i < this.test.questions.length; i += 1) {
          this.questions.push({
            ...this.test.questions[i],
            answer: {
              id: this.test.questions[i].id,
              checked: (!this.test.questions[i].isSingleAnswer) ? [] : 0,
            },
            isValid: false,
          });
        }
      }
    },
    showTest() {
      return this.try && this.questions.length;
    },
    questionValidate(item) {
      let isValid = false;
      if (item.isSingleAnswer && item.answer.checked) {
        isValid = true;
      }
      if (!item.isSingleAnswer && item.answer.checked.length) {
        isValid = true;
      }
      item.isValid = isValid;
      return isValid;
    },
    nextStep(qid, aid) {
      const app = this;
      const answer = {
        profile_id: this.user.profile_id,
        try_id: this.try.id,
        question_id: qid,
        answer_ids: Array.isArray(aid) ? aid : [aid],
      };
      app.$store.getters.axl.post('courses/api/test-try/answer', answer)
        .then((response) => {
          app.$store.commit('courses/setTry', response.data.try);
          app.step += 1;
        })
        .catch((error) => {
          if (error.response && (error.response.status === 301) && error.response.data.redirect) {
            app.$router.push(`/results/${app.test.id}`);
          } else if (error.response && (error.response.status === 400)) {
            app.$router.push(`/courses/${app.course.id}`);
          }
        });
    },
  },
  mounted() {
    this.$store.dispatch('courses/GetCourse', this.id);
    this.$store.dispatch('courses/startTry', { profile_id: this.user.profile_id, test_id: this.test.id });
    this.step = (this.try && this.try.step) ? this.try.step : 1;
    this.setQuestions();
  },
};
