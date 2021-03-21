export default {
  props: ['action_id', 'id'],
  data() {
    return {
      tables: {
        headers: [
          { text: 'Фото', value: 'photoUrl', sortable: false, align: 'left' },
          { text: 'Название', value: 'name', sortable: false, align: 'left' },
          { text: 'Кол-во', value: 'quantity', sortable: false, align: 'center' },
          { text: '', value: '', sortable: false, align: '' },
        ],
      },
      saleID: this.$props.id,
      actionID: this.$props.action_id,
      showHistory: false,
      // productsList: [],
      productsSelected: [],
      product: '',
      number: '',
      dateModal: false,
      bonuses: {
        total: 0,
        plan: null,
        fact: 0,
        unit: '',
      },
      documents: [],
      document: {
        base64: '',
        name: '',
        filename: '',
        url: '',
      },
      valid: false,
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
      },
    };
  },
  watch: {
    soldOn(val) {
      this.soldOnFormatted = this.FormatDate(val);
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    action() {
      return this.$store.state.sales.action;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    loading() {
      return this.$store.state.loading;
    },
    isEnabled() {
      return !!this.name && !!this.email && !!this.phone && !!this.message;
    },
    sale() {
      return this.$store.state.sales.sale;
    },
    groups() {
      return this.$store.state.sales.groups;
    },
    productsList() {
      return this.action && this.action.products.length
      && this.action.products.map(item => item.name);
    },
    products() {
      const { action } = this.$store.state.sales;
      if (action !== null) {
        return action.products;
      }
      return [];
    },
    bonuses_formula() {
      if (this.$store.state.sales.action != null) {
        return this.$store.state.sales.action.bonuses_formula;
      }
      return 1;
    },
    validation() {
      if (this.saleID !== 'null' && this.sale) {
        return !!(this.sale.action.is_actual
          && (this.sale.status === 'adminReview'
            || this.sale.status === 'draft')
        );
      }
      if (this.saleID === 'null' && this.actionID !== 'null') {
        return !!(
          this.valid && this.productsSelected.length
        );
      }
      return false;
    },
    isEditable() {
      return !!(
        this.sale && this.sale.action.is_actual
        && (this.sale.status === 'adminReview'
          || this.sale.status === 'draft')
      );
    },
  },
  methods: {
    /** Получить timestamp. */
    setUniqueId() {
      return (new Date()).getTime();
    },
    /** Добавляем продукт в список */
    AddProduct() {
      // debugger;
      const newProduct = this.products.find(item => item.name === this.product);
      const doubleProduct = this.productsSelected
        .find(item => item.id === newProduct.id);
      if (doubleProduct === undefined) {
        this.productsSelected.push({
          listID: this.setUniqueId(),
          id: newProduct.id,
          bonuses_formula: this.bonuses_formula,
          photoUrl: newProduct.photo_url,
          name: newProduct.name,
          price: +newProduct.price,
          quantity: 1,
        });
        this.CalculateSum();
      } else {
        this.$store.dispatch('ShowErrorMessage', 'Продукт уже добавлен. Увеличте количество');
      }
    },
    /**
     * Удалить продукт из списка.
     * @param id Идентификатор элемента в списке продуктов.
     * @constructor
     */
    DeleteProduct(id) {
      this.productsSelected = this.productsSelected.filter(item => item.listID !== id);
      this.CalculateSum();
    },
    /** Подсчет суммы баллов за добавленные продукты (на клиенте). */
    /* CalculateSumOld() {
      this.sum = 0;
      let sum = 0;
      if (this.productsSelected.length) {
        for (let i = 0; i < this.productsSelected.length; i += 1) {
          sum += (this.productsSelected[i].bonuses_formula * this.productsSelected[i].quantity);
        }
      }
      this.sum = sum;
    }, */
    /** Подсчет суммы баллов за добавленные продукты (с помощью бэкенд обработки данных). */
    CalculateSum() {
      console.log('recalculate');
      const app = this;
      const sale = {
        profile_id: app.user.profile_id,
        action_id: app.actionID,
        positions: app.productsSelected.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      if (app.saleID !== 'null') {
        sale.sale_id = app.sale.id;
        sale.action_id = app.sale.action_id;
      }

      app.$store.getters.axl.post('sales/api/bonus/calculate', sale)
        .then((response) => {
          this.bonuses = response.data.bonuses;
        })
        .catch(error => app.$store.dispatch('HandleError', error));
    },
    /**
     * Проверка типа документа.
     * @param item {Object} объект документа.
     * @returns {*|boolean}
     */
    CheckPDF(item) {
      if (item.base64) {
        return (item.base64.indexOf('/pdf;') !== -1);
      }
      if (item.url) {
        return (item.url.indexOf('.pdf') !== -1);
      }
      return false;
    },
    /**
     * Получение пути до файла.
     * @param item объект документа.
     * @returns {*}
     */
    GetFilePath(item) {
      if (item.base64 || item.url) {
        return item.url ? item.url : item.base64;
      }
      return '';
    },
    /** Прикрепить документ. */
    PickDocument() {
      this.$refs.document.click();
    },
    OnDocument(e) {
      this.OnFilePicked(e);
    },
    /**
     * Добавление документа к продаже.
     * @param e эвент
     */
    OnFilePicked(e) {
      const app = this;
      const { files } = e.target;
      if (files[0] !== undefined) {
        const [file] = files;
        if (file.name.lastIndexOf('.') <= 0) {
          return;
        }
        app.document.name = file.name;

        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener('load', () => {
          app.document.filename = null;
          app.document.id = null;
          app.document.base64 = fr.result;
          app.documents.push(app.document);
          app.document = { filename: '', base64: '', name: '', url: '', id: null };
          app.$forceUpdate();
        });
      } else {
        app.document = { filename: '', base64: '', name: '', url: '', id: null };
      }
    },
    /**
     * Удаление документа из списка прикрепленных файлов.
     * @param item объект прикрепленного файла.
     * @param index номер в списке документов.
     */
    deleteFile(item, index) {
      item.name === this.documents[index].name && this.documents.splice(index, 1);
    },
    /**
     * Установка предзагруженных значений при редактировании продажи.
     */
    setDataPreload() {
      if (this.sale) {
        this.number = this.sale.number;
        this.productsSelected = this.sale.positions.map(item => (
          {
            bonuses_formula: this.sale.action.bonuses_formula,
            id: item.product.id,
            listID: this.setUniqueId() + item.product.id,
            name: item.product.name,
            photoUrl: item.product.photo_url,
            quantity: item.quantity,
            price: item.product.price,
            bonuses: item.bonuses_formula * item.quantity,
          }
        ));
        this.documents = this.sale.documents.map(item => (
          {
            id: item.id,
            base64: '',
            filename: null,
            name: item.name,
            url: item.url,
          }
        ));
        this.CalculateSum();
      }
    },
    /** Выводим текущую дату в нужном формате */
    getDate() {
      const addZero = num => ((num >= 0 && num <= 9) ? `0${num}` : num);
      const date = new Date();
      return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${addZero(date.getFullYear())}`;
    },
    /**
     * Метод добавления новой продажи.
     */
    onSubmit() {
      const app = this;
      let restURL = 'sales/api/sale/create';

      if (app.valid) {
        const sale = {
          profile_id: app.user.profile_id,
          number: app.number,
          sold_on_local: app.getDate(),
          action_id: app.actionID,
          positions: app.productsSelected.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            bonuses: item.bonuses_formula * item.quantity,
          })),
        };


        if (app.saleID !== 'null') {
          restURL = 'sales/api/sale/update';
          sale.sale_id = app.sale.id;
          sale.action_id = app.sale.action_id;
          sale.documents = app.documents.map((item) => {
            const doc = { name: item.name };
            if (item.id) {
              doc.id = item.id;
              doc.url = item.url;
            } else {
              doc.base64 = item.base64;
            }
            return doc;
          });
        } else {
          sale.documents = app.documents.map(item => ({
            name: item.name,
            base64: item.base64,
          }));
        }

        app.$store.getters.axl.post(restURL, sale)
          .then(() => {
            app.$router.push('/sales/');
            app.$store.dispatch('ShowInfo', 'Продажа(закупка) отправлена на проверку');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      }
    },
  },
  created() {
    if (this.actionID !== 'null') {
      this.$store.dispatch('sales/GetAction', {
        action_id: +this.actionID,
      });
    }
    if (this.saleID !== 'null') {
      this.$store.dispatch('sales/GetSale', +this.saleID)
        .then((res) => {
          this.$store.dispatch('sales/GetAction', {
            action_id: res.action.id,
            noClearSale: true,
          });
        });
    }
  },
  mounted() {
    this.saleID !== 'null' && this.setDataPreload();
  },
};
