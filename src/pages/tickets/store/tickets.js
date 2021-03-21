import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    tickets: [],
    ticket: null,
    counter_profile: 0,
    topic_options: [],
    scroll_chat: 0,
  },
  actions: {
    GetTickets({ commit, rootGetters, dispatch, state }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.axl.post('tickets/api/no-log/get-my-tickets', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'tickets', value: response.data.tickets });
              commit('setField', { name: 'counter_profile', value: response.data.counter_profile });
              commit('setField', { name: 'topic_options', value: response.data.topic_options });
              // если тикет открыт, то обновляем его и помечаем прочитанным
              if (state.ticket) {
                for (let i = 0; i < response.data.tickets.length; i += 1) {
                  if (state.ticket.id === response.data.tickets[i].id) {
                    commit('setField', { name: 'ticket', value: response.data.tickets[i] });
                    dispatch('ReadedTicket', { profile_id: id, ticket_id: state.ticket.id });
                    commit('TicketReaded');
                    break;
                  }
                }
              }
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            dispatch('HandleError', error, { root: true });
            reject(error);
          });
      });
    },
    SetTicket({ commit, dispatch, state }, payload) {
      return new Promise((resolve, reject) => {
        dispatch('GetTickets', payload.profile_id)
          .then(() => {
            const ticket = state.tickets.find(item => item.id === payload.ticket_id);
            ticket && commit('setField', { name: 'ticket', value: ticket });
            ticket && dispatch('ReadedTicket', ticket.id);
            resolve(ticket);
          })
          .catch(err => reject(err));
      });
    },
    UnsetTicket({ commit }) {
      commit('setField', { name: 'ticket', value: null });
    },
    IncomingAdminMessage({ commit, state, dispatch }, message) {
      // входящее сообщение от администратора
      if (state.ticket && state.ticket.id === message.ticket_id) {
        // если текущий тикет открыт, мы оповещаем прочитанный статус
        dispatch('ReadedTicket', state.ticket.id);
      }
      commit('AddMessage', message);
    },
    IncomingAdminTicket({ commit, state }, ticket) {
      // входящий тикет от администратора
      let hasTicket = false;
      for (let i = 0; i < state.tickets.length; i += 1) {
        if (state.tickets[i].id === ticket.id) {
          hasTicket = true;
        }
      }
      // добавляем, если еще его нету в списке
      if (hasTicket === false) {
        commit('AddTicket', ticket);
      }
    },
    ReadedTicket({ rootGetters, state }, payload) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('tickets/api/tickets/readed-by-profile', payload)
          .then((response) => {
            // у всех сообщений этого тикета от админа выставляем статус прочитанных
            for (let i = 0; i < state.tickets.length; i += 1) {
              if (state.tickets[i].id === payload.ticket_id) {
                for (let j = 0; j < state.tickets[i].messages.length; j += 1) {
                  if (state.tickets[i].messages[j].admin_id) {
                    state.tickets[i].messages[j].readed = true;
                  }
                }
              }
            }
            // у всех сообщений текущего тикета от админа выставляем статус прочитанных
            if (state.ticket && state.ticket.id === payload.ticket_id) {
              for (let j = 0; j < state.ticket.messages.length; j += 1) {
                if (state.ticket.messages[j].admin_id) {
                  state.ticket.messages[j].readed = true;
                }
              }
            }
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateTicketCounter({ commit, rootGetters }, id) {
      return new Promise((resolve, reject) => {
        rootGetters.ax.post('tickets/api/no-log/get-counter-profile', { profile_id: id })
          .then((response) => {
            if (response && response.data) {
              commit('setField', { name: 'counter_profile', value: response.data.counter_profile });
              resolve(response.data);
            }
            reject(new Error('no response data'));
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    InitialStoreTickets({ commit }) {
      commit('setField', { name: 'tickets', value: [] });
      commit('setField', { name: 'ticket', value: null });
      commit('setField', { name: 'counter_profile', value: 0 });
      commit('setField', { name: 'topic_options', value: [] });
      commit('setField', { name: 'scroll_chat', value: 0 });
    },
  },
  mutations: {
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
    AddMessage(state, message) {
      // добавляем новое сообщение в tickets
      for (let i = 0; i < state.tickets.length; i += 1) {
        if (state.tickets[i].id === message.ticket_id) {
          // проверка, что сообщение не было добавлено
          for (let j = 0; j < state.tickets[i].messages.length; j += 1) {
            if (state.tickets[i].messages[j].id === message.id) {
              return;
            }
          }
          state.tickets[i].messages.push(message);
          Vue.set(state.tickets[i], 'messages', state.tickets[i].messages);
          Vue.set(state.tickets[i], 'lastMessage', message);
          if (state.ticket == null || state.ticket.id !== message.ticket_id) {
            Vue.set(state.tickets[i], 'counter_profile', state.tickets[i].counter_profile + 1);
            state.counter_profile += 1;
          }
        }
      }
    },
    AddTicket(state, ticket) {
      // проверка, что тикет не был добавлено
      for (let i = 0; i < state.tickets.length; i += 1) {
        if (state.tickets[i].id === ticket.id) {
          return;
        }
      }
      state.tickets.unshift(ticket);
    },
    TicketReaded(state) {
      if (state.ticket) {
        Vue.set(state.ticket, 'counter_profile', 0);
      }
    },
  },
};
