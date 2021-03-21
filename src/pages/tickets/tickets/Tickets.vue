<template>
  <v-row class="tickets">
    <v-col cols="12">
      <v-card class="border">
        <v-card-title class="primary">
          <h3 class="headline white--text">Обращения</h3>
        </v-card-title>
      </v-card>

      <v-layout xs12 id="tickets-list" class="tickets__list white">

        <!--Блок с темами тикетов-->
        <v-flex
          class="tickets__list-item tickets__list-item--themes"
          :class="{'hide': fullChat}"
        >
          <div class="tickets__list-item-wrap tickets__list-item-wrap--themes">
            <div class="tickets__new-ticket bordered-b pa-2">
              <v-btn class="primary" @click="OpenNewTicketForm">
                Новое обращение
                <font-awesome-icon icon="paper-plane" class="size-16 ml-2"/>
              </v-btn>
              <v-btn class="primary" @click="ShowFullChat">
                Чат
              </v-btn>
            </div>
            <div class="tickets__themes-list">
              <v-list>
                <v-list-item
                  v-for="item in tickets"
                  @click="OpenTicket(item)"
                  class="tickets__themes-item bordered-b hovered"
                  :class="{'red lighten-4 active': (ticket && ticket.id === item.id)}"
                  :key="item.id"
                >
                  <v-list-item-avatar class="tickets__themes-item-avatar">
                    <div class="chat-icon">
                      <div class="chat-icon__counter">
                        {{ item.messages.length }}
                      </div>
                    </div>
                    <div v-if="GetNewMessagesCounter(item.messages)" class="chat-icon__bage">
                      {{ GetNewMessagesCounter(item.messages) }}
                    </div>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      <v-chip
                        v-if="item.lastMessage"
                        class="tickets__item-title-bage"
                        :class="{'white--text':(ticket && ticket.id === item.id)}"
                        label
                        :color="(ticket && ticket.id === item.id) ? 'red lighten-2' : 'grey lighten-2'"
                      >{{ item.lastMessage.created }}
                      </v-chip>
                      <span
                        class="tickets__item-title-text"
                      >{{ item.title }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="item.lastMessage">{{ item.lastMessage.message }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-flex>
        <!--Блок с сообщениями тикетов-->
        <v-flex
          class="tickets__list-item tickets__list-item--dialog"
          :class="{ 'tickets__dialog--empty': (ticket === null), 'full': fullChat }"
        >
          <div class="tickets__list-item-wrap tickets__list-item-wrap--dialog">
            <div v-if="ticket === null || ticket === undefined"
                 class="tickets__dialog-list tickets__dialog-list--empty">
              <div class="tickets__dialog-empty-icon">
                <font-awesome-icon class="tickets__dialog-empty-icon-fa" icon="comments"/>
              </div>
              <div class="tickets__dialog-empty-text">
                Пожалуйста, выберите диалог или
                <v-btn @click="OpenNewTicketForm" text small color="primary">Создайте новый</v-btn>
              </div>
            </div>

            <div v-if="ticket" class="tickets__dialog-list">
              <div class="tickets__dialog-title pa-2 text-xs-center">
                {{ ticket.title }}
              </div>
              <div
                class="tickets__item-wrap"
                :class="{'admin': message.admin_id}"
                v-for="message in ticket.messages"
                :key="message.id"
              >
                <div class="tickets__item pa-2 d-flex justify-space-between">
                  <div class="tickets__item-content" :class="{ 'tickets__item-content--full': !message.file_url}">
                    <div class="tickets__item-date">
                      <span>{{ message.created }}</span>
                    </div>
                    <div class="tickets__item-desc">
                      {{ message.message }}
                    </div>
                  </div>
                  <div v-if="message.file_url" class="tickets__item-file">
                    <a v-if="CheckPDF(message.file_url)" :href="message.file_url" target="_blank">
                      <font-awesome-icon icon="file-pdf" class="big-pdf pa-1"/>
                    </a>
                    <img v-else @click="OpenFile(message.file_url)" class="tickets__item-file" :src="message.file_url"/>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="ticket" class="tickets__item-form bordered-t px-3">
              <v-layout row wrap class="justify-space-between">
                <v-flex xs12 px-2>
                  <v-textarea filled v-model="message" placeholder="Сообщение" class="mx-2 mt-2" rows="3"></v-textarea>
                </v-flex>

                <v-flex xs12 sm6 class="pr-2">
                  <div class="file-preview flex xs6 md3 mr-2" v-if="document.base64">
                    <v-icon
                      @click="DeleteDocument"
                      small
                      color="primary"
                      class="tickets__preview-close"
                    >mdi-close-circle-outline</v-icon>
                    <span v-if="CheckPDF(document.base64)">
                        <font-awesome-icon icon="file-pdf" class="big-pdf pa-1"/>
                      </span>
                    <div v-else class="file">
                      <img v-if="document.base64" :src="document.base64"/>
                    </div>
                  </div>

                  <div class="tickets__uploader uploader">
                    <image-uploader
                      :debug="1"
                      :maxWidth="1280"
                      :quality="0.7"
                      :autoRotate=true
                      outputFormat="verbose"
                      :preview="false"
                      :className="['fileinput', { 'fileinput--loaded' : document.name }]"
                      :capture="false"
                      accept="image/*, application/pdf"
                      doNotResize="['gif', 'svg', 'pdf']"
                      @input="setImage"
                      @onUpload="startImageResize"
                      @onComplete="endImageResize"
                    >
                      <label for="fileInput" slot="upload-label">
                        <div class="tickets__img-uploader mb-3">
                          <v-icon
                            v-if="document.name"
                            large
                            color="primary"
                            class="tickets__img-uploader-icon"
                          >mdi-reload</v-icon>
                          <v-icon
                            v-else
                            large
                            color="primary"
                            class="tickets__img-uploader-icon"
                          >mdi-camera</v-icon>
                          <span class="tickets__img-uploader-label ml-2">
                            {{ document.name ? 'Изменить файл' : 'Загрузить файл' }}
                          </span>
                        </div>
                      </label>
                    </image-uploader>
                  </div>
                </v-flex>

                <v-flex xs12 sm6 class="align-self-end text-right mb-3 pr-2">
                  <v-btn class="primary" @click="PostMessage()" :disabled="!document.base64 && !message">
                    Отправить
                    <font-awesome-icon icon="paper-plane" class="size-16 ml-2"/>
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex>

        <div class="formmaskview">
          <div class="formmaskview__loading-indicator"></div>
          <div class="formmaskview__child"></div>
        </div>

      </v-layout>
      <!-- File dialog -->
      <v-dialog
        class="tickets__popup-dialog"
        v-model="openFileDialog"
        persistent hide-overlay max-width="980px"
        content-class="tickets-dialog"
      >
        <v-card class="tickets__popup-card pa-0 transparent elevation-0">
          <v-btn
            color="primary"
            class="tickets__popup-close"
            @click="openFileDialog = false"
            fab
            x-small
            dark
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-img
            class="tickets__popup-file"
            :src="fileURL" aspect-ratio="2.75"
            height="80vh"
            contain
          ></v-img>
        </v-card>
      </v-dialog>

      <!-- New ticket dialog -->
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card color="white">
          <v-card-title>
            <span class="headline">Новое обращение</span>
            <v-spacer></v-spacer>
            <font-awesome-icon @click="CloseNewTicketForm" icon="times" class="size-25 close-icon"/>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="AddNewTicket" autocomplete="off">
              <v-layout row wrap>
                <v-flex xs12 class="mt-2">
                  <v-select
                    :items="themes"
                    :value="theme"
                    @change="SetTopicID"
                    :menu-props="{ maxHeight: '400' }"
                    label="Тема обращения"
                    persistent-hint
                    :rules="[rules.required]" required
                  ></v-select>
                </v-flex>
                <v-flex xs12 class="mt-2">
                  <v-select
                    :items="contact_options"
                    :value="contact"
                    @change="SetContact"
                    :menu-props="{ maxHeight: '400' }"
                    label="Предпочтительный вид связи"
                    persistent-hint
                    :rules="[rules.required]" required
                  ></v-select>
                </v-flex>
                <v-flex xs12 class="mt-2 pr-2">
                  <v-text-field
                    type="text"
                    label="Название сообщения"
                    v-model="newTicket.title"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="mt-2 pr-1">
                  <v-textarea
                    name="comment"
                    label="Текст сообщения"
                    v-model="newTicket.comment"
                    :rules="[rules.required]"
                    required
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
            <small class="red--text">*Все поля обязательны к заполнению</small>
          </v-card-text>
          <v-card-actions class="pa-3">
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="AddNewTicket()" :disabled="!validation">
              Отправить
              <font-awesome-icon icon="paper-plane" class="size-16 ml-2"/>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script src="./Tickets.js"></script>
<style src="./Tickets.scss" lang="scss"></style>
