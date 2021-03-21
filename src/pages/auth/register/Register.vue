<template>
  <v-row class="registration">
    <v-col cols="12" md="8" offset-md="2">
      <v-card>
        <v-card-title class="primary white--text">
          <font-awesome-icon
            v-show="sentCode || token"
            @click="Reset"
            icon="arrow-left"
            class="icon icon--hovered mr-2"
          />
          Регистрация
        </v-card-title>
        <v-card-text>
          <div v-show="!sentCode && !token">
            <v-text-field
              type="text"
              label="Номер телефона"
              id="regPhone"
              v-model="user.phone"
              placeholder=""
              v-mask="'+7 (###) ###-####'"
              autofocus
              required
              :rules="[rules.phone]"
            ></v-text-field>
            <v-card-actions class="pa-0 justify-space-between">
              <v-btn :disabled="loading" @click="SendCode">Отправить код</v-btn>
            </v-card-actions>
          </div>

          <h3
            v-show="sentCode || token"
            class="user-phone pt-3"
          >{{user.phone}}</h3>

          <div v-show="sentCode && !token">
            <v-text-field
              type="text"
              label="Проверочный код"
              id="regCode"
              v-model="code"
              placeholder=""
              v-mask="'#####'"
              required
              :rules="[rules.code]"
            ></v-text-field>
            <v-card-actions class="pa-0 justify-space-between">
              <v-btn :disabled="loading" @click="CheckCode">Проверить код</v-btn>
            </v-card-actions>
          </div>

          <div v-show="token">
            <v-form
              @submit.prevent="Register"
              autocomplete="off"
              v-model="valid"
              lazy-validation
              ref="form"
            >
              <v-container>
                <v-row>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      type="text"
                      label="Фамилия"
                      id="regLastName"
                      v-model="user.last_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      type="text"
                      label="Имя"
                      v-model="user.first_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      type="text"
                      label="Отчество"
                      v-model="user.middle_name"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      type="email"
                      label="E-mail адрес"
                      v-model="user.email"
                      :rules="[rules.required, rules.email]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-select
                      v-model="profile.specialty"
                      :items="specialties"
                      label="Специальность"
                      item-text="title"
                      item-value="value"
                      :rules="[rules.required]"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-autocomplete
                      v-model="profile.dealer_id"
                      :items="dealers"
                      :search-input.sync="searchDealer"
                      clearable
                      hide-details
                      no-data-text="Начните вводить название точки продаж"
                      item-text="name"
                      item-value="id"
                      label="Точка продаж"
                      class="plcolor"
                      :rules="[rules.required]"
                      required
                    >
                      <template v-slot:selection="data">
                        <strong>{{data.item.name}}</strong>: {{data.item.address}}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="settings.register_birthday">
                    <v-text-field
                      v-model="profile.birthday"
                      label="Дата рождения"
                      hint="дд.мм.гггг"
                      v-mask="'##.##.####'"
                      placeholder="01.01.1970"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="settings.register_role">
                    <v-text-field
                      v-if="settings.register_role"
                      v-model="profile.role"
                      type="text"
                      label="Роль"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="settings.register_gender">
                    <div slot="label">Пол</div>
                    <v-radio-group
                      v-model="profile.gender"
                      class="mt-0"
                      :rules="[rules.required]"
                      required
                      row
                    >
                      <v-radio value="male" label="Мужской" color="primary"></v-radio>
                      <v-radio value="female" label="Женский" color="primary"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="settings.register_city">
                    <v-autocomplete
                      v-model="profile.city_local"
                      :placeholder="profile.city_local"
                      :items="cities"
                      :search-input.sync="search"
                      clearable
                      hide-details
                      hide-no-data
                      label="Город"
                      class="plcolor"
                      :rules="[rules.required]"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      label="Пароль"
                      v-model="user.password"
                      autocomplete="new-password"
                      :append-icon="!hidePw ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hidePw = !hidePw"
                      :type="hidePw ? 'password' : 'text'"
                      counter
                      class="z10"
                      :rules="[rules.password]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <v-text-field
                      label="Повтор пароля"
                      v-model="user.passwordConfirm"
                      autocomplete="new-password"
                      :append-icon="!hidePw ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hidePw = !hidePw"
                      :type="hidePw ? 'password' : 'text'"
                      counter
                      :rules="[comparePasswords]"
                      class="z10"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="requireRules">
                    <v-checkbox
                      label="Согласие с правилами программы"
                      readonly
                      v-model="user.checkedRules"
                      @click="dialogRules=true"
                      required
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0" v-if="requirePers">
                    <v-checkbox
                      label="Согласие на обработку персональных данных"
                      readonly
                      v-model="user.checkedPers"
                      @click="dialogPers=true"
                      required
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>

              <v-card-actions class="pa-0">
                <v-btn type="submit" :disabled="loading || !valid">Регистрация</v-btn>
              </v-card-actions>
            </v-form>
          </div>
        </v-card-text>
      </v-card>

      <!-- Rules dialog-->
      <v-dialog v-model="dialogRules" width="500" v-if="requireRules && pageRules">
        <v-card>
          <v-card-title class="headline primary" primary-title v-html="pageRules.title"></v-card-title>
          <v-card-text v-html="pageRules.content"></v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="default" @click="dialogRules = false; user.checkedRules = false">Отклонить</v-btn>
            <v-btn @click="dialogRules = false; user.checkedRules = true">Принять</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- /Rules dialog-->

      <!-- Pers dialog-->
      <v-dialog v-model="dialogPers" width="500" v-if="requirePers && pagePers">
        <v-card>
          <v-card-title class="headline primary" primary-title v-html="pagePers.title"></v-card-title>
          <v-card-text v-html="pagePers.content"></v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="default" @click="dialogPers = false; user.checkedPers = false">Отклонить</v-btn>
            <v-btn color="primary" @click="dialogPers = false; user.checkedPers = true">Принять</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- /Pers dialog-->
    </v-col>
  </v-row>
</template>

<script src="./Register.js"></script>
<style src="./Register.scss" lang="scss" scoped></style>
