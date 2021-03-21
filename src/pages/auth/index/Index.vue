<template>
  <v-row
    v-if="this.$store.state.settings.extranet !== true"
    class="index"
    no-gutters
  >
    <v-col>
      <v-row class="index__block">
        <v-col cols="12" class="text-center">
          <h2 class="py-5 my-5">Добро пожаловать!</h2>
          <div class="index__actions">
            <v-btn
              to="/login"
              class="index__btn"
            >Войти</v-btn>
            <v-btn
              color="primary"
              class="index__btn"
              @click="showRegTypes = !showRegTypes"
            >
              <span v-if="showRegTypes">Отмена</span>
              <span v-else>Регистрация</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row v-show="showRegTypes" class="index__select">
        <v-col cols="12" md="6" class="text-center">
          <v-btn to="/register/rtt" class="index__select-btn">
            <img
              src="@/assets/images/ico-saler.png"
              alt="register"
              class="index__select-img"
            >
            <div class="choice-wrap">
              <span class="big-text">Сотрудник</span>
              <span>дистрибьютора</span>
            </div>
          </v-btn>
        </v-col>
        <v-col cols="12" md="6" class="text-center">
          <v-btn to="/register/dealer" class="index__select-btn">
            <img
              src="@/assets/images/ico-user.png"
              alt="register"
              class="index__select-img"
            >
            <div class="choice-wrap">
              <span class="big-text">Сотрудник</span>
              <span>розничной сети</span>
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./Index.js"></script>
<style src="./Index.scss" lang="scss"></style>
