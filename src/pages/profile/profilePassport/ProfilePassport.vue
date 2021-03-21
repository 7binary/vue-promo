<template>
  <v-row class="passport">
    <v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2">
      <v-row class="passport__form-block">
        <v-col>
          <v-card>
            <v-card-title class="primary">
              <h3 class="headline white--text">Налоговая анкета</h3>
            </v-card-title>
            <v-card-text class="pt-4">
              <v-alert type="info">
                Для заказа подарка необходимо заполнить все поля. Это нужно, чтобы мы заплатили за Вас налог на доходы физических лиц в соответствии с законодательством Российской Федерации
              </v-alert>
              <form
                @submit.prevent="SavePassport"
                autocomplete="off"
                lazy-validation
                ref="form"
              >
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Фамилия"
                      v-model="form.last_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Имя"
                      v-model="form.first_name"
                      :value="form.first_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Отчество"
                      v-model="form.middle_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Дата рождения (дд.мм.гггг)"
                      v-model="form.birthday_on_local"
                      placeholder="14.01.1987"
                      v-mask="'##.##.####'"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Серия и номер паспорта"
                      v-model="form.document_series_and_number"
                      placeholder="1234 567890"
                      v-mask="'#### ######'"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="text"
                      label="Идентификационный номер налогоплательщика"
                      v-model="form.inn"
                      placeholder="ИНН"
                      v-mask="'############'"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="12">
                    <div class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot">
                          <div class="v-text-field__slot">
                            <label aria-hidden="true" class="v-label v-label--active theme--light"
                                   style="left: 0px; right: auto; position: absolute;">Адрес места жительства в РФ</label>

                            <el-autocomplete
                              v-model="form.address"
                              :fetch-suggestions="AutocompleteSearch"
                              @select="AutocompleteSelect"
                              placeholder="Москва, Тверской б-р, д 9"
                              :trigger-on-focus="false"
                              id="form-address"
                            ></el-autocomplete>
                          </div>
                        </div>
                        <div class="v-text-field__details">
                          <div class="v-messages theme--light">
                            <div class="v-messages__wrapper"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="12" v-if="form && form.address_data" id="address-suggestion">
                    <div class="adress-table">
                      <div class="at-wrap">
                        <div class="atw-title">Почтовый индекс</div>
                        <div class="atw-data">{{form.address_data.postal_code}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Код региона</div>
                        <div class="atw-data">{{form.address_data.region_kladr_id}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Регион</div>
                        <div class="atw-data">{{form.address_data.region_with_type}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Город</div>
                        <div class="atw-data">{{form.address_data.city_with_type}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Улица</div>
                        <div class="atw-data">{{form.address_data.street_with_type}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Номер дома</div>
                        <div class="atw-data">{{form.address_data.house}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Корпус</div>
                        <div class="atw-data">{{form.address_data.block}}</div>
                      </div>
                      <div class="at-wrap">
                        <div class="atw-title">Номер квартиры</div>
                        <div class="atw-data">{{form.address_data.flat}}</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    align-self="stretch"
                    v-if="form && form.document1_api"
                    class="passport__img-block"
                  >
                    <div v-if="('url' in form.document1_api
                      && form.document1_api.url
                      && form.document1_api.url.indexOf('/pdf;') !== -1)
                      || ('file' in form.document1_api
                      && form.document1_api.file
                      && form.document1_api.file.indexOf('/pdf;') !== -1)"
                    >
                  <span style="color:darkred">
                    <v-icon style="color:darkred">insert_drive_file</v-icon> PDF
                  </span>
                    </div>
                    <div v-else>
                      <img
                        class="passport__img"
                        v-if="'url' in form.document1_api || 'file' in form.document1_api"
                        :src="'url' in form.document1_api ? form.document1_api.url : form.document1_api.file"
                      />
                    </div>
                    <v-text-field
                      class="passport__img-input"
                      label="Разворот паспорта"
                      @click='PickDocument1'
                      v-model='form.document1_api.name'
                      prepend-icon='mdi-paperclip'
                      readonly
                    ></v-text-field>
                    <input
                      type="file"
                      style="display: none"
                      ref="document1"
                      accept="image/*, application/pdf"
                      @change="OnDocument1"
                    >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    align-self="stretch"
                    v-if="form && form.document2_api"
                    class="passport__img-block"
                  >
                    <div v-if="('url' in form.document2_api
                      && form.document2_api.url
                      && form.document2_api.url.indexOf('/pdf;') !== -1)
                      || ('file' in form.document2_api
                      && form.document2_api.file
                      && form.document2_api.file.indexOf('/pdf;') !== -1)"
                    >
                  <span style="color:darkred">
                    <v-icon style="color:darkred">insert_drive_file</v-icon> PDF
                  </span>
                    </div>
                    <div v-else>
                      <img
                        class="passport__img"
                        v-if="'url' in form.document2_api || 'file' in form.document2_api"
                        :src="'url' in form.document2_api ? form.document2_api.url : form.document2_api.file"
                      />
                    </div>
                    <v-text-field
                      class="passport__img-input"
                      label="Страница регистрации"
                      @click='PickDocument2'
                      v-model='form.document2_api.name'
                      prepend-icon='mdi-paperclip'
                      readonly
                    ></v-text-field>
                    <input
                      type="file"
                      style="display: none"
                      ref="document2"
                      accept="image/*,application/pdf"
                      @change="OnDocument2"
                    >
                  </v-col>
                </v-row>

                <v-card-actions class="pa-0 justify-space-between">
                  <v-spacer></v-spacer>
                  <v-btn type="submit" :disabled="loading">
                    <span>Отправить</span>
                    <font-awesome-icon icon="paper-plane" class="size-16 ml-1"/>
                  </v-btn>
                </v-card-actions>

              </form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="passport__comments-block" v-if="form.comments && form.comments.length">
        <v-col>
          <v-card>
            <v-card-text class="pb-0">
              <h3 class="mb-3">История анкеты и комментарии</h3>
              <div v-for="comment in form.comments" class="taxes-comment">
                <div class="taxes-time">{{comment.created_at}}</div>
                <div>
                  {{comment.note}}
                  <span v-show="comment.comment && comment.comment.length > 0">с комментарием:</span>
                </div>
                <div v-show="comment.comment && comment.comment.length > 0" v-html="comment.comment"
                     class="taxes-note"></div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./ProfilePassport.js"></script>
<style src="./ProfilePassport.scss" lang="scss"></style>
