export default {
  namespaced: true,
  state: {
    surveysList: [],
    survey: null,
    lastShowTime: [],
    hasSurvey: false,
  },
  actions: {
    GetSurveys({ commit, state, rootGetters, dispatch }, profileID) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('survey/api/surveys/surveys-list', { profile_id: profileID })
          .then((response) => {
            if (response && response.data) {
              const surveysList = response.data.surveys.filter((item) => {
                const findIndexSurvey = state.lastShowTime.findIndex(x => x.id === item.id);
                if (findIndexSurvey !== -1) {
                  const timestamp = Math.round(new Date().getTime() / 1000);
                  const lastSueveyTimer = state.lastShowTime[findIndexSurvey].time;
                  const itemTimer = item.frequency_hours * 3600;
                  return item.enabled && ((timestamp - lastSueveyTimer) > itemTimer);
                }
                return item.enabled;
              });
              if (surveysList.length) {
                commit('SetSurveyFlag', false);
                commit('SetSurveysList', surveysList);
                commit('SetSurvey', surveysList[0]);
              } else {
                state.surveysList = [];
                state.survey = {};
                commit('SetSurveyFlag', false);
              }
            } else {
              reject(new Error('no response data'));
            }
          })
          .then(() => {
            state.surveysList.length && commit('SetSurveyFlag', true);
            resolve(state.surveysList);
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    InitialStoreSurveys({ commit }) {
      commit('InitialStoreSurveys');
    },
  },
  mutations: {
    SetSurveysList(state, surveys) {
      state.surveysList = [];
      state.surveysList = surveys;
    },
    SetSurvey(state, payload) {
      state.survey = {};
      state.survey = payload;
    },
    SetSurveyFlag(state, payload) {
      state.hasSurvey = payload;
    },
    InitialStoreSurveys(state) {
      state.surveysList = [];
      state.survey = null;
      state.lastShowTime = [];
      state.hasSurvey = false;
    },
    SetLastShowTime(state, payload) {
      if (state.lastShowTime.length && payload.time === null) {
        const findIndexSurvey = state.lastShowTime.findIndex(x => x.id === payload.id);
        (findIndexSurvey !== -1) && state.lastShowTime.splice(findIndexSurvey, 1);
      } else if (state.lastShowTime.length && payload.time !== null) {
        const findIndexSurvey = state.lastShowTime.findIndex(x => x.id === payload.id);
        if (findIndexSurvey !== -1) {
          state.lastShowTime[findIndexSurvey].time = payload.time;
        } else {
          state.lastShowTime.push({ id: payload.id, time: payload.time });
        }
      } else {
        state.lastShowTime.push({ id: payload.id, time: payload.time });
      }
    },
  },
};
