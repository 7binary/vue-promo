export default {
  name: 'Tickets',
  data() {
    return {
      message: null,
      dialog: false,
      openFileDialog: false,
      fileURL: '',
      document: {
        base64: '',
        name: '',
        filename: '',
        url: '',
      },
      errors: [],
      newTicket: {
        topic_id: '',
        title: '',
        comment: '',
        contact: 'chat',
      },
      themes: [],
      theme: '',
      contact_options: ['Чат', 'E-mail', 'Звонок'],
      contact: '',
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
      },
      fullChat: false,
      hasImage: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    tickets() {
      return this.$store.state.tickets.tickets;
    },
    ticket() {
      return this.$store.state.tickets.ticket;
    },
    topic_options() {
      return this.$store.state.tickets.topic_options;
    },
    validation() {
      return this.newTicket.topic_id && this.newTicket.title
        && this.newTicket.contact && this.newTicket.comment;
    },
  },
  methods: {
    /** Показать скрыть полный чат */
    ShowFullChat() {
      this.fullChat = !this.fullChat;
    },
    /** Получение списка тикетов */
    getTickets() {
      this.$store.dispatch('tickets/GetTickets', this.user.profile_id);
    },
    /** Открыть файл в тикете */
    OpenFile(file) {
      this.openFileDialog = true;
      this.fileURL = file;
    },
    /** проверка на тип файла прикрепленного к тикету */
    CheckPDF(file) {
      return (file.indexOf('/pdf;') !== -1 || file.indexOf('.pdf') !== -1);
    },
    /** Счетчик непрочтенных сообщений */
    GetNewMessagesCounter(messages) {
      const newMessages = messages.filter(item => item.admin_id && !item.readed);
      return newMessages.length ? newMessages.length : '';
    },
    /** Открыть сообщения тикета в левой части */
    OpenTicket(ticket) {
      const payload = {
        ticket_id: ticket.id,
        profile_id: this.user.profile_id,
      };
      this.$store.dispatch('tickets/SetTicket', payload);
    },
    setImage(e) {
      if (e && e.dataUrl) {
        this.document = { id: null, name: e.info ? e.info.name : '', base64: e.dataUrl, filename: '', url: '' };
      } else {
        this.document = { filename: '', base64: '', name: '', url: '', id: null };
      }
    },
    startImageResize() {
      this.$store.dispatch('SetLoading', true);
    },
    endImageResize() {
      this.$store.dispatch('SetLoading', false);
    },
    /** Открыть форму добавления обращения */
    OpenNewTicketForm() {
      this.dialog = true;
    },
    /** Скрыть форму добавления обращения */
    CloseNewTicketForm() {
      this.newTicket = {
        topic_id: '',
        title: '',
        comment: '',
        contact: 'chat',
      };
      this.dialog = false;
    },
    /** Удаление документа из списка прикрепленных файлов. */
    DeleteDocument() {
      this.document = { filename: '', base64: '', name: '', url: '' };
    },
    /** Добавить сообщение в тикет */
    PostMessage() {
      const app = this;
      const data = {
        message: app.message,
        file: app.document.base64,
        profile_id: app.user.profile_id,
        ticket_id: app.ticket.id,
      };
      app.$store.getters.axl.post('tickets/api/messages/add', data)
        .then((response) => {
          app.AddMessage(response.data.message);
          app.document.base64 && app.DeleteDocument();
          app.message = '';
          app.OpenTicket(app.ticket);
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
    AddMessage(message, incomming) {
      const app = this;
      incomming = incomming || null;
      app.ticket.messages.push(message);
      if (incomming) {
        app.ChatReaded(incomming);
        app.PublishChatReaded();
      }
    },
    /** Отправить признак прочитанности сообщения */
    PublishChatReaded() {
      const payload = {
        profile_id: this.user.profile_id,
        ticket_id: this.ticket.id,
      };
      this.$store.getters.ax.post('tickets/api/messages/readed-by-profile', payload);
    },
    /** Добавление нового тикета */
    SetTopicID(e) {
      const topicID = this.topic_options.filter(item => (
        (e === item.name) ? item.id : null
      ));
      this.newTicket.topic_id = (topicID[0] !== null) ? topicID[0].id : '';
    },
    /** Установка типа обратной связи */
    SetContact(e) {
      switch (e) {
        case 'E-mail': this.newTicket.contact = 'email'; break;
        case 'Звонок': this.newTicket.contact = 'phone'; break;
        default: this.newTicket.contact = 'chat';
      }
    },
    /** Добавить новый тикет-обращение */
    AddNewTicket() {
      const app = this;
      const payload = {
        ...app.newTicket,
        profile_id: this.user.profile_id,
      };

      app.$store.getters.axl.post('tickets/api/tickets/send-ticket', payload)
        .then((response) => {
          app.$store.dispatch('ShowInfo', 'Обращение отправлено! Ожидайте ответ в ближайшее время');
          console.log('AddNewTicket', response.data.ticket);
          app.OpenTicket(response.data.ticket);
          app.CloseNewTicketForm();
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  },
  created() {
    this.user && this.getTickets();
    this.$store.dispatch('tickets/UnsetTicket');
    this.user && this.ticket && this.PublishChatReaded();
  },
  mounted() {
    this.themes = this.topic_options.length && this.topic_options.map(item => item.name);
  },
};
