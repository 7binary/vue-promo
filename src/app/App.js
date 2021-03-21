import Webpush from '../pages/profile/webpush/Webpush.vue';
import Footer from './components/footer/Footer.vue';
import Drawer from './components/drawer/Drawer.vue';
import Header from './components/header/Header.vue';

export default {
  data() {
    return {};
  },
  components: {
    Drawer,
    Header,
    Webpush,
    Footer,
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isBlocked() {
      return !!(this.$store.state.user
        && this.$store.state.user.blocked_at !== null);
    },
    extranet() {
      return this.$store.state.settings.extranet === true;
    },
    loading() {
      return this.$store.state.loading;
    },
    epsCartLength() {
      return this.$store.state.eps.cartLength;
    },
    layout() {
      return this.$store.state.settings.layout;
    },
    bgUrl() {
      return this.$store.state.settings.bgUrl;
    },
    showWebpushPopup() {
      return 'Notification' in window
        && this.$store.state.user
        && this.$store.state.settings.webpush === true
        && this.$store.state.webpush.webpushPopupOpened === true
        && this.$store.state.webpush.webpushFirebaseToken === null
        && this.$store.state.webpush.webpushDeclinedAt === null;
    },
    news() {
      return this.$store.state.settings.news === true;
    },
    instructions() {
      return this.$store.state.settings.instructions === true;
    },
    sales() {
      return this.$store.state.settings.sales === true;
    },
    courses() {
      return this.$store.state.settings.courses === true;
    },
    tickets() {
      return this.$store.state.settings.module_tickets === true;
    },
    isBannersOn() {
      return this.$store.state.settings.module_banners === true;
    },
    isShopOn() {
      return this.$store.state.settings.shop === true;
    },
    /** Верхнее меню */
    topMenuItems() {
      if (this.isAuthenticated && !this.isBlocked) {
        const menu = [
          {
            title: 'Профиль',
            path: '/profile',
            icon: 'user-circle',
            showIcon: true,
            showTitle: true,
          },
          {
            title: 'Призы',
            path: '/prizes',
            icon: 'gift',
            showIcon: true,
            showTitle: true,
          },
          {
            title: 'Заказы',
            path: '/orders',
            icon: 'file-alt',
            showIcon: true,
            showTitle: true,
          },
        ];
        this.news && menu.push({
          title: 'Новости',
          path: '/news',
          icon: 'comment-dots',
          showIcon: true,
          showTitle: true,
        });
        this.instructions && menu.push({
          title: 'Презентации',
          path: '/instructions',
          icon: 'chart-bar',
          showIcon: true,
          showTitle: true,
        });
        this.sales && menu.push({
          title: 'Продажи',
          path: '/actions',
          icon: 'ruble-sign',
          showIcon: true,
          showTitle: true,
        });
        this.courses && menu.push({
          title: 'Обучение',
          path: '/courses',
          icon: 'user-graduate',
          showIcon: true,
          showTitle: true,
        });
        this.isShopOn && menu.push({
          title: 'Товары',
          path: '/shop',
          icon: 'shopping-cart',
          showIcon: true,
          showTitle: true,
        });
        return menu;
      }
      return [];
    },
    /** Левое мобильное меню в дровере */
    leftMenuItems() {
      if (this.isAuthenticated) {
        let menu = [];
        if (!this.isBlocked) {
          menu = [
            {
              title: 'Профиль',
              path: '/profile',
              icon: 'user-circle',
            },
            {
              title: 'Призы',
              path: '/prizes',
              icon: 'gift',
            },
            {
              title: 'Заказы',
              path: '/orders',
              icon: 'file-alt',
            },
          ];
          this.news && menu.push({
            title: 'Новости',
            path: '/news',
            icon: 'comment-dots',
          });
          this.isShopOn && menu.push({
            title: 'Товары',
            path: '/shop',
            icon: 'shopping-cart',
          });
          this.instructions && menu.push({
            title: 'Презентации',
            path: '/instructions',
            icon: 'chart-bar',
            optionalClass: 'long-title',
          });
          this.sales && menu.push({
            title: 'Продажи',
            path: '/actions',
            icon: 'ruble-sign',
          });
          this.courses && menu.push({
            title: 'Обучение',
            path: '/courses',
            icon: 'user-graduate',
          });
          this.tickets ? menu.push({
            title: 'Помощь',
            path: '/tickets',
            icon: 'question-circle',
          }) : menu.push({
            title: 'Помощь',
            path: '/feedback',
            icon: 'question-circle',
          });
        } else {
          menu = [
            {
              title: 'Главная страница',
              path: '/',
              icon: 'home',
            },
            {
              title: 'Помощь',
              path: '/feedback',
              icon: 'question-circle',
            },
          ];
        }
        return menu;
      }
      if (this.extranet) {
        return [];
      }
      return [
        {
          title: 'Главная страница',
          path: '/',
          icon: 'home',
        },
        {
          title: 'Помощь',
          path: '/feedback',
          icon: 'question-circle',
        },
        {
          title: 'Войти',
          path: '/login',
          icon: 'sign-in-alt',
        },
      ];
    },
  },
  methods: {
    UserLogout() {
      this.$store.dispatch('UserLogout');
      this.$router.push('/');
    },
  },
  created() {
    this.$store.dispatch('GetSettings');
    this.$store.commit('SetLoading', false);
    this.isBannersOn && this.$store.dispatch('banners/GetBannersList');
  },
};
