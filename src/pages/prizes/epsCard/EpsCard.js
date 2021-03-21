export default {
  props: ['type'],
  data() {
    return {
      dialogAdded: false,
      qty: 1,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    card() {
      return this.$store.state.eps.card;
    },
    nominals() {
      return this.$store.state.eps.card.nominals_text;
    },
    cardHint() {
      if (!this.card.nominals_text || !this.card.nominals_text.length) {
        return '';
      }
      for (let i = 0; i < this.card.nominals_text.length; i += 1) {
        if (this.card.nominals_text[i].price === parseInt(this.card.nominal, 10)) {
          return `${this.card.nominals_text[i].text}`;
        }
      }
      return '';
    },
  },
  methods: {
    Add(card) {
      const app = this;
      if (card.nominal === undefined || !card.nominal) {
        document.getElementById(`select-card-${card.id}`).click();
        return;
      }
      app.$store.dispatch('eps/AddToCart', { card, qty: app.qty });
      app.dialogAdded = true;
      card.nominal = null;
      app.qty = 1;
    },
    GoToCart() {
      this.dialogAdded = false;
      this.$router.push('/cart');
    },
    ChangeQty(e) {
      if (+e.target.value > 0) {
        this.qty = +e.target.value;
      } else {
        this.qty = 1;
      }
    },
  },
  mounted() {
    const app = this;
    app.$store.dispatch('eps/GetCard', this.type);
    app.$store.dispatch('eps/GetCards');
  },
};
