import velocity from 'velocity-animate';
import Notifications from 'vue-notification';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { Autocomplete } from 'element-ui';
import Tooltip from 'vue-directive-tooltip';
import VueTheMask from 'vue-the-mask';
import ImageUploader from 'vue-image-upload-resize';
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  faRubleSign,
  faUserCircle,
  faQuestionCircle,
  faNewspaper,
  faHome,
  faGift,
  faFileAlt,
  faChalkboardTeacher,
  faShoppingCart,
  faUserGraduate,
  faComments,
  faUserShield,
  faSignInAlt,
  faSignOutAlt,
  faShoppingBasket,
  faBell,
  faFilePdf,
  faPaperPlane,
  faClipboardList,
  faCloudDownloadAlt,
  faTrashAlt,
  faBookReader,
  faBookOpen,
  faEdit,
  faUserEdit,
  faPlusCircle,
  faClipboardCheck,
  faAngleDoubleDown,
  faEye,
  faComment,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
  faAddressCard,
  faSave,
  faTimesCircle,
  faTimes,
  faChartBar,
  faBars,
  faCommentDots,
  faCommentAlt,
  faAngleDown,
  faAngleUp,
  faFileInvoiceDollar,
  faKiwiBird,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import colors from 'vuetify/lib/util/colors';
import router from './routes';
import store from './store/storage';
import App from './app/App.vue';
import 'vuetify/dist/vuetify.min.css';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/scss/main.scss';

// import FontAwesome icons
library.add(
  faRubleSign,
  faUserCircle,
  faQuestionCircle,
  faNewspaper,
  faHome,
  faGift,
  faFileAlt,
  faChalkboardTeacher,
  faShoppingCart,
  faUserGraduate,
  faComments,
  faUserShield,
  faSignInAlt,
  faSignOutAlt,
  faShoppingBasket,
  faCloudDownloadAlt,
  faBell,
  faFilePdf,
  faPaperPlane,
  faClipboardList,
  faTrashAlt,
  faBookReader,
  faBookOpen,
  faEdit,
  faUserEdit,
  faPlusCircle,
  faClipboardCheck,
  faAngleDoubleDown,
  faEye,
  faComment,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
  faAddressCard,
  faSave,
  faTimesCircle,
  faTimes,
  faChartBar,
  faBars,
  faCommentDots,
  faCommentAlt,
  faAngleDown,
  faAngleUp,
  faFileInvoiceDollar,
  faKiwiBird,
  faMobileAlt,
);
dom.i2svg();

// Vue plugins
Vue.use(Vuetify);
Vue.use(Tooltip);
Vue.use(VueTheMask);
Vue.use(Autocomplete);
Vue.use(Notifications, { velocity });
Vue.use(ImageUploader);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: colors.teal.darken2,
          secondary: colors.teal.lighten2,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
        dark: {
          primary: colors.blue.lighten3,
        },
      },
    },
  }),
  store,
  render: h => h(App),
  created() {
    this.$store.commit('SetLoading', false);
    this.$store.dispatch('GetProfile');
  },
}).$mount('#app');

new Vue({
  store,
  computed: {
    myFavicon() {
      return this.$store.state.settings.faviconUrl;
    },
  },
}).$mount('.favicon');
