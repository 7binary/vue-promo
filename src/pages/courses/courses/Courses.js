export default {
  data() {
    return {
      course: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    courses() {
      return this.$store.state.courses.coursesList;
    },
  },
  methods: {
    goToCourse(id) {
      this.$router.push(`/course/${id}`);
    },
  },
  mounted() {
    this.$store.dispatch('courses/GetCoursesList');
  },
};
