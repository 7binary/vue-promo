export default {
  props: ['id'],
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
      showHistory: false,
      productsList: [],
      productsSelected: [],
      product: '',
      soldOn: '',
      number: '',
      sum: 0,
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
  computed: {
    user() {
      return this.$store.state.user;
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
    products() {
      return this.$store.state.sales.products;
    },
    validation() {
      return this.valid && this.documents.length;
    },
  },
  methods: {
    /** Получить timestamp. */
    setUniqueId() {
      return (new Date()).getTime();
    },
    /** Устанавливаем список продуктов. */
    SetProducts() {
      this.productsList = this.products.map(item => item.name);
    },
    /** Добавляем продукт в список */
    AddProduct() {
      const arr = this.products.filter(item => item.name === this.product);
      this.productsSelected.push({
        listID: this.setUniqueId(),
        id: arr[0].id,
        bonuses_formula: +arr[0].bonuses_formula,
        photoUrl: arr[0].photo_url,
        name: arr[0].name,
        quantity: 1,
      });
      this.CalculateSum();
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
    /**
     * Подсчет суммы баллов за добавленные продукты.
     */
    CalculateSum() {
      this.sum = 0;
      let sum = 0;
      if (this.productsSelected.length) {
        for (let i = 0; i < this.productsSelected.length; i += 1) {
          sum += (this.productsSelected[i].bonuses_formula * this.productsSelected[i].quantity);
        }
      }
      this.sum = sum;
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
        this.soldOn = this.sale.sold_on_local;
        this.number = this.sale.number;
        this.productsSelected = this.sale.positions.map(item => (
          {
            bonuses_formula: +item.product.bonuses_formula,
            id: item.product.id,
            listID: this.setUniqueId() + item.product.id,
            name: item.product.name,
            photoUrl: item.product.photo_url,
            quantity: item.quantity,
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
          sold_on_local: app.soldOn,
          positions: app.productsSelected.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        };

        if (app.saleID !== 'null') {
          restURL = 'sales/api/sale/update';
          sale.sale_id = app.sale.id;
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
            app.$store.dispatch('ShowInfo', 'Регистрация продажи отправлена на проверку');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      }
    },
  },
  created() {
    !this.products.length && this.$store.dispatch('sales/GetProductsList');
  },
  mounted() {
    this.SetProducts();
    this.saleID && this.setDataPreload();
  },
};
