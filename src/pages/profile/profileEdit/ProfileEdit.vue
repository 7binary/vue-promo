<!--suppress ALL -->
<template>
  <v-row>
    <v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2">
      <v-card>
        <v-card-title class="primary white--text">
          <h3 class="headline mb-0">Редактировать профиль</h3>
        </v-card-title>
        <v-card-text>
          <v-form
            autocomplete="off"
            v-model="valid"
            lazy-validation
            ref="form"
          >
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  type="text"
                  v-model="profile.last_name"
                  autofocus
                  label="Фамилия"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  type="text"
                  v-model="profile.first_name"
                  autofocus
                  label="Имя"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  type="text"
                  v-model="profile.middle_name"
                  autofocus
                  label="Отчество"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="settings.register_specialty" cols="12" sm="6">
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
              <v-col cols="12" sm="6">
                <v-text-field
                  type="text"
                  v-model="profile.email"
                  label="E-mail"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="settings.register_birthday" cols="12" sm="6">
                <v-text-field
                  v-model="profile.birthday_on"
                  label="Дата рождения"
                  hint="дд.мм.гггг"
                  v-mask="'##.##.####'"
                  placeholder="01.01.1970"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="settings.register_dealer" cols="12">
                <v-autocomplete
                  v-model="profile.dealer_id"
                  :items="dealers"
                  :search-input.sync="searchDealer"
                  clearable
                  hide-details
                  no-data-text="Список пуст"
                  item-text="name"
                  item-value="id"
                  label="Точка продаж"
                  class="plcolor"
                  disabled
                >
                  <template v-slot:selection="data">
                    <strong>{{data.item.name}}</strong>: {{data.item.address}}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col v-if="settings.register_role" cols="12" sm="6">
                <v-text-field
                  v-if="settings.register_role"
                  v-model="profile.role"
                  type="text"
                  label="Роль"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="settings.register_gender" cols="12" sm="6">
                <div slot="label">Пол</div>
                <v-radio-group v-model="profile.gender" class="mt-0" :rules="[rules.required]" row>
                  <v-radio value="male" label="Мужской" color="primary"></v-radio>
                  <v-radio value="female" label="Женский" color="primary"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col v-if="settings.register_city" cols="12">
                <v-autocomplete
                  v-model="profile.city_local"
                  :placeholder="profile.city_local"
                  :items="cities"
                  :search-input.sync="search"
                  :clearable="true"
                  :open-on-clear="true"
                  hide-details
                  hide-no-data
                  label="Город"
                  class="plcolor"
                  :rules="[rules.required]"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-3 justify-space-between">
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            :disabled="loading || !valid"
            @click="profileSubmit"
            color="primary"
          >
            Сохранить
            <font-awesome-icon icon="save" class="size-18 ml-2"/>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./ProfileEdit.js"></script>
<style src="./ProfileEdit.scss" lang="scss" scoped></style>
