<template>
  <v-row>
    <v-col cols="12" md="8" offset-md="2" lg="6" offset-lg="3">
      <v-card>
        <v-card-title class="primary">
          <font-awesome-icon
            @click="Back"
            icon="arrow-left"
            class="icon icon--hovered mr-2"
          />
          <h3 class="headline text-center">Сменить пароль</h3>
        </v-card-title>
        <v-card-text class="pt-4">
          <div v-show="!sentCode && !token">
            <v-text-field
              type="text"
              label="Номер телефона"
              id="remindPhone"
              v-model="user.phone"
              placeholder=""
              v-mask="'+7 (###) ###-####'"
              autofocus
              required
              :rules="phoneRules"
            ></v-text-field>
            <v-card-actions class="pa-0 justify-space-between">
              <v-btn :disabled="loading" @click="SendCode">Отправить код</v-btn>
            </v-card-actions>
          </div>

          <h3 v-show="sentCode || token">{{user.phone}}</h3>

          <div v-show="sentCode && !token">
            <v-text-field
              label="Проверочный код"
              id="remindCode"
              v-model="code"
              placeholder=""
              v-mask="'#####'"
              required
              :rules="codeRules"
            ></v-text-field>
            <v-card-actions class="pa-0 justify-space-between">
              <v-btn :disabled="loading" @click="CheckCode">Проверить код</v-btn>
            </v-card-actions>
          </div>

          <div v-show="token">
            <form @submit.prevent="Remind" autocomplete="off">
              <v-text-field
                label="Пароль"
                v-model="user.password"
                id="remindPassword"
                placeholder=""
                required
                :append-icon="!hidePw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="hidePw = !hidePw"
                :type="hidePw ? 'password' : 'text'"
                counter
                :rules="passwordRules"
                autocomplete="new-password"
              ></v-text-field>
              <v-text-field
                label="Повтор пароля"
                v-model="user.passwordConfirm"
                placeholder=""
                required
                :append-icon="!hidePw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="hidePw = !hidePw"
                :type="hidePw ? 'password' : 'text'"
                counter
                :rules="[comparePasswords]"

                autocomplete="new-password"
              ></v-text-field>
              <v-card-actions class="pa-0 justify-space-between">
                <v-btn type="submit" :disabled="loading">Задать пароль</v-btn>
              </v-card-actions>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./RemindPassword.js"></script>
<style src="./RemindPassword.scss" lang="scss" scoped></style>
