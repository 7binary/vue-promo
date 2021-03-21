<template>
  <v-row class="feedback">
    <v-col v-if="faq.length" cols="12" lg="6">
      <v-card>
        <v-card-title class="primary">Часто задаваемые вопросы</v-card-title>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in faq" :key="i">
            <div slot="header">{{item.question}}</div>
            <v-card>
              <v-card-text v-html="item.answer"></v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      :lg="faq.length ? '4' : '6'"
      :offset-lg="faq.length ? '1' : '3'"
    >
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Обратная связь</h3>
        </v-card-title>
        <v-card-text>
          <v-form
            @submit.prevent="FeedbackSubmit"
            autocomplete="off"
            ref="feedbackForm"
            validation
            v-model="valid"
          >
            <v-text-field
              type="text"
              label="Имя"
              id="name"
              v-model="name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              type="text"
              label="E-mail"
              id="email"
              v-model="email"
              :rules="[rules.required, rules.email]"
              required
            ></v-text-field>
            <v-text-field
              type="text"
              label="Телефон"
              id="phone"
              v-model="phone"
              v-mask="'+7 (###) ###-####'"
              required
              :rules="[rules.required, rules.phoneLength]"
            ></v-text-field>
            <v-select
              v-if="categories_options.length"
              :items="categories_options"
              v-model="category"
              label="Категории вопросов"
              :disabled="categories_options.length === 1"
            ></v-select>
            <v-textarea
              class="message"
              v-model="message"
              pa-5
              background-color="white"
              :rules="[rules.required]"
              label="Сообщение"
              rows="3"
              autofocus
            ></v-textarea>
            <v-row>
              <v-col cols="12">
                <v-row v-if="documents.length">
                  <v-col
                    cols="6"
                    sm="3"
                    lg="4"
                    v-for="(item, index) in documents"
                    :key="index"
                  >
                    <div class="filePreview">
                      <font-awesome-icon
                        @click="HandleDeleteFile(item, index)"
                        icon="times"
                        size="lg"
                        class="close"
                      />
                      <span v-if="CheckPDF(item)">
                          <font-awesome-icon icon="file-pdf" class="middle-pdf pa-1"/>
                        </span>
                      <div v-else class="file">
                        <img
                          v-if="GetFilePath(item)"
                          :src="GetFilePath(item)"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <div v-if="documents.length < 5">
                  <v-text-field
                    label="Изображение или PDF файл"
                    @click='PickDocument'
                    v-model='document.name'
                    prepend-icon='mdi-paperclip'
                    readonly
                  ></v-text-field>
                  <input
                    type="file"
                    style="display: none"
                    ref="document"
                    accept="image/*, application/pdf"
                    @change="OnDocument"
                  >
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-3 justify-space-between">
          <v-btn type="submit" :disabled="loading || !valid" @click="FeedbackSubmit">
            <span>Отправить</span>
            <font-awesome-icon icon="paper-plane" class="size-16 ml-1"/>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Feedback.js"></script>
<style src="./Feedback.scss" lang="scss" scoped></style>
