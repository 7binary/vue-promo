<template>
  <v-container fluid fill-height>
    <v-layout row wrap max>
      <v-flex xs12 text-xs-center v-if="this.$store.state.settings.extranet !== true">
        <h2 class="white--text">Добро пожаловать!</h2>
        <v-flex text-xs-center mt-3>
          <v-btn to="/login">Войти</v-btn>
          <v-btn color="primary" @click="showRegTypes = !showRegTypes">
            <span v-if="showRegTypes">Отмена</span>
            <span v-else>Регистрация</span>
          </v-btn>
        </v-flex>
        <v-flex v-show="showRegTypes" text-xs-center mt-3>
          <div class="select-register">
            <v-btn flat to="/register/rtt" class="select-register--choise">
              <img src="@/assets/images/ico-saler.png" alt="">
              <div class="choice-wrap">
                <span class="big-text">Сотрудник</span>
                <span>дистрибьютора</span>
              </div>
            </v-btn>
            <v-btn flat to="/register/dealer" class="select-register--choise">
              <img src="@/assets/images/ico-user.png" alt="">
              <div class="choice-wrap">
                <span class="big-text">Сотрудник</span>
                <span>розничной сети</span>
              </div>
            </v-btn>
          </div>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        showRegTypes: false,
      };
    },
  };
</script>
