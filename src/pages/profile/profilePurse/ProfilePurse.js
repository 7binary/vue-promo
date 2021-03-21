export default {
  data() {
    return {
      headers: [
        { text: 'Тип', align: 'left', value: 'type' },
        { text: 'Дата создания', align: 'right', value: 'created_at' },
        { text: 'Сумма', align: 'right', value: 'amount' },
        { text: 'Название', align: 'right', value: 'title' },
      ],
      rowsPerPageItems: [
        50, 100, 250, { text: 'Весь список', value: -1 },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    transactions() {
      return this.$store.state.userTransactions;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    getTypeLabel(type) {
      return type === 'in'
        ? { label: 'Входящая', color: 'green' }
        : { label: 'Исходящая', color: 'red' };
    },
  },
  mounted() {
    this.$store.dispatch('GetProfile');
    this.$store.dispatch('GetTransactions');
  },
};
