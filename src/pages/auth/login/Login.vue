<template>
  <v-container fluid fill-height class="login">
    <v-layout row wrap max>
      <v-flex lg4 offset-lg4 md8 offset-md2 xs12>
        <v-card>
          <v-card-title class="primary">
            Вход в программу
          </v-card-title>
          <v-card-text>
            <form autocomplete="off">
              <v-text-field
                type="text"
                label="Номер телефона"
                id="login"
                v-model="login"
                placeholder=""
                v-mask="'+7 (###) ###-####'"
                autofocus
                required
                :rules="loginRules"
              ></v-text-field>
              <v-text-field
                label="Пароль"
                v-model="password"
                placeholder=""
                required
                autocomplete="new-password"
                :append-icon="!hidePw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="hidePw = !hidePw"
                :type="hidePw ? 'password' : 'text'"
                counter
              ></v-text-field>
            </form>
          </v-card-text>
          <v-card-actions class="pa-3 justify-space-between">
            <v-btn
              type="submit"
              :disabled="loading"
              @click="Login"
            >Войти</v-btn>
            <v-btn to="/remind">Забыли пароль</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script src="./Login.js"></script>
<style src="./Login.scss" lang="scss" scoped></style>
