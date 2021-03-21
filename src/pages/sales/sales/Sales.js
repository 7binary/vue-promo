export default {
  data() {
    return {
      tables: {
        headers: [
          { text: 'Название', value: 'product.name', sortable: false, align: 'left' },
          { text: 'Кол-во', value: 'quantity', sortable: false, align: 'right' },
          { text: 'Бонусы', value: 'bonuses', sortable: false, align: 'right' },
        ],
      },
      history: [],
      showHistoryID: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    sales() {
      return this.$store.state.sales.sales;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    getSaleQuantity(id) {
      const sale = this.sales.filter(item => item.id === id);
      let quantity = 0;
      if (sale[0].positions) {
        quantity = sale[0].positions.reduce((acc1, d1) => {
          acc1 += d1.quantity;
          return acc1;
        }, 0);
      }
      return quantity;
    },
    getSaleBonuses(id) {
      const sale = this.sales.filter(item => item.id === id);
      let bonuses = 0;
      if (sale[0].positions) {
        bonuses = sale[0].positions.reduce((acc1, d1) => {
          acc1 += d1.bonuses;
          return acc1;
        }, 0);
      }
      return bonuses;
    },
    addSale(id) {
      this.$store.dispatch('sales/GetSale', id);
      this.$router.push(`/sale/null/${id}`);
    },
    showHistory(id) {
      const sale = this.sales.filter(item => item.id === id);
      this.history = sale.length ? sale[0].history : [];
      this.showHistoryID = (this.showHistoryID !== id) ? id : false;
    },
    getStatusColor(status) {
      switch (status) {
        case 'adminReview': return 'color-orange';
        case 'draft': return 'color-orange';
        case 'declined': return 'color-red';
        case 'paid': return 'color-green';
        case 'approved': return 'color-green';
        default: return '';
      }
    },
  },
  mounted() {
    this.$store.dispatch('sales/GetSalesList', { profile_id: this.user.profile_id });
    this.$store.dispatch('sales/GetProductsList');
  },
};
