export default {
  namespaced: true,
  state: {
    coursesList: [],
    course: {},
    try: null,
    testsList: [],
    testResultsList: [],
  },
  actions: {
    GetCoursesList({ commit, rootGetters, dispatch }) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('courses/api/course/list')
          .then((response) => {
            if (response && response.data) {
              commit('InitialStoreCourses');
              commit('setCoursesList', response.data.courses);
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    GetCourse({ commit, rootGetters, dispatch }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('courses/api/course/view', { course_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setCourse', response.data.course);
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    startTry({ commit, rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('courses/api/test-try/index', { profile_id: payload.profile_id, test_id: payload.test_id })
          .then((response) => {
            if (response && response.data) {
              commit('setTry', response.data.try);
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    GetResultsList({ commit, rootGetters, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('courses/api/test-try/list', { profile_id: payload.profile_id, test_id: payload.test_id })
          .then((response) => {
            if (response && response.data) {
              commit('setResultsList', response.data.tries);
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    InitialStoreCourses({ commit }) {
      commit('InitialStoreCourses');
    },
  },
  mutations: {
    setCoursesList(state, payload) {
      state.coursesList = payload;
    },
    setCourse(state, payload) {
      state.course = payload;
    },
    setResultsList(state, payload) {
      state.testResultsList = payload;
    },
    setTry(state, payload) {
      state.try = payload;
    },
    InitialStoreCourses(state) {
      state.coursesList = [];
      state.course = {};
      state.try = null;
      state.testsList = [];
      state.testResultsList = [];
    },
  },
};
