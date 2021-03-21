import Surveys from '../surveys/Surveys.vue';
import Notifications from '../notifications/Notifications.vue';
import Carousel from '../../../sharedComponents/carousel/Carousel.vue';

export default {
  data() {
    return {
      pagePers: null,
      dialogPers: false,
    };
  },
  components: {
    Surveys,
    Notifications,
    Carousel,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    requirePers() {
      const { state } = this.$store;
      return !!(
        state.settings.profile_pers === true
          && state.user
          && !state.user.pers_at
      );
    },
    account() {
      return this.$store.state.user.account;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isBlocked() {
      return !!(this.$store.state.user
        && this.$store.state.user.blocked_at !== null);
    },
    hasSurvey() {
      return this.$store.state.surveys.hasSurvey;
    },
    hasNotifications() {
      return this.$store.state.notifications.hasNotifications;
    },
    isBannersOn() {
      return this.$store.state.settings.module_banners === true;
    },
    banners() {
      return this.$store.state.banners.bannersList || [];
    },
    taxes() {
      return this.$store.state.settings.taxes === true;
    },
  },
  methods: {
    ConfirmPers() {
      const app = this;
      app.$store.getters.axl.post('profiles/api/auth/confirm-pers', { profile_id: app.user.profile_id })
        .then(() => {
          app.user.pers_at = true;
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
    LoadPers() {
      const app = this;
      app.$store.getters.ax.post('profiles/api/register/info')
        .then((response) => {
          app.pagePers = response.data.pagePers;
        });
    },
  },
  created() {
    this.user && this.$store.dispatch('surveys/GetSurveys', this.user.profile_id);
    this.user && this.$store.dispatch('notifications/GetNotifications', this.user.profile_id);
    this.isBannersOn && this.$store.dispatch('banners/GetBannersList');
  },
  mounted() {
    this.$store.dispatch('GetProfile');
    this.$store.dispatch('GetSettings');
    if (this.requirePers) {
      this.LoadPers();
    }
  },
};
