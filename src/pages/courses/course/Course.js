export default {
  props: ['id'],
  data() {
    return {
      dialog: {
        active: false,
        content: '',
      },
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
  },
  methods: {
    startTest() {
      this.$store.dispatch('courses/startTry', { profile_id: this.user.profile_id, test_id: this.test.id });
      this.$router.push(`/test/${this.test.id}`);
    },
    showPDF(url) {
      this.dialog.active = true;
      this.dialog.content = `<iframe src="${url}" style="width:100%; min-height:700px" frameborder="0"></iframe>`;
    },
  },
  mounted() {
    this.$store.dispatch('courses/GetCourse', this.id);
  },
};
