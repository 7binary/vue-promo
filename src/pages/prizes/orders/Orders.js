export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    requirePers() {
      return this.$store.state.settings.profile_pers === true && !this.$store.state.user.pers_at;
    },
    epsOrders() {
      return this.$store.state.eps.orders;
    },
    cards() {
      return this.$store.state.eps.cards;
    },
    payments() {
      return this.$store.state.payments.payments;
    },
    products() {
      return this.$store.state.shop.orders;
    },
    paymentsInfo() {
      return this.$store.state.paymentsInfo;
    },
    hasEps() {
      return this.$store.state.settings.eps === true;
    },
    hasPayments() {
      return this.$store.state.settings.payments === true;
    },
    hasShop() {
      return this.$store.state.settings.shop === true;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    DownloadCard(order, card) {
      this.$store.dispatch('DownloadFile', {
        url: '/catalog/api-v3/cards/download-blob',
        data: {
          profile_id: this.user.profile_id,
          ms_order_id: order.ms_order_id,
          ms_card_id: card.ms_card_id,
        },
        filename: `${card.type}_${card.nominal}.pdf`,
      });
    },
    getPaymentByType(type) {
      if (this.paymentsInfo && this.paymentsInfo.methods && this.paymentsInfo.methods.length) {
        const arr = this.paymentsInfo.methods.filter(item => item.type === type);
        return arr[0];
      }
      return null;
    },
    getPaymentIcon(type) {
      switch (type) {
        case 'phone':
          return 'mobile-alt';
        case 'yandex':
          return 'yandex';
        case 'webmoney':
          return 'file-invoice-dollar';
        case 'qiwi':
          return 'kiwi-bird';
        case 'card':
          return 'credit-card';
        case 'rbs':
          return 'file-invoice-dollar';
        default:
          return 'file-invoice-dollar';
      }
    },
    getPrizeByID(type) {
      const arr = this.cards.filter(item => item.type === type);
      return arr[0] || false;
    },
    getProductsOrderStatus(status) {
      switch (status) {
        case 'new': return { text: 'Новый заказ', color: 'orange' };
        case 'delivery': return { text: 'Доставляется', color: 'orange' };
        case 'completed': return { text: 'Обработан', color: 'green' };
        case 'rollback': return { text: 'Откат покупки', color: 'red' };
        default: return { text: 'Новый заказ', color: 'orange' };
      }
    },
  },
  async created() {
    const app = this;
    if (app.user) {
      if (app.hasEps) {
        await app.$store.dispatch('eps/GetOrders', app.user.profile_id);
        await app.$store.dispatch('payments/GetPayments', app.user.profile_id);
        await app.$store.dispatch('GetPaymentsSettings');
      }
      await app.$store.dispatch('shop/GerOrders', app.user.profile_id)
        .then(() => app.$forceUpdate());
      if (app.requirePers) {
        app.$router.push('/dashboard', () => {
          setTimeout(() => {
            app.$store.dispatch('ShowError', 'Для раздела "Заказы" необходимо согласие на обработку персональных данных!');
          }, 500);
        });
      }
    }
  },
};
