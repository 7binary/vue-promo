<template>
  <div class="dashboard">
    <v-row align="center" justify="center">
      <!-- Carousel block -->
      <v-col class="py-0 mb-5">
        <Carousel v-if="isBannersOn" :items="banners"/>
      </v-col>
      <!-- /Carousel block -->

      <!-- Blocked alert block -->
      <v-col
        v-if="user && isAuthenticated && isBlocked"
        cols="12"
        class="px-0"
      >
        <v-alert type="info">
          Ваша учетная запись ожидает проверки администратором
        </v-alert>
      </v-col>
      <!-- /Blocked alert block -->
    </v-row>

    <v-row
      v-if="user && isAuthenticated && !isBlocked"
      align="center"
      justify="center"
    >
      <v-col cols="12" sm="6" lg="4" align-self="stretch">
        <v-card class="dashboard__card" height="100%">
          <v-card-title
            class="secondary white--text dashboard__card-title"
          >Личные данные
          </v-card-title>
          <v-card-text
            class="dashboard__card-text pt-3"
          >
            <div>{{user.last_name}} {{user.first_name}} {{user.middle_name}}</div>
            <div>{{user.phone_mobile}}</div>
            <div>{{user.email}}</div>
          </v-card-text>
          <v-card-actions
            class="pa-3 dashboard__card-actions"
          >
            <v-btn color="default" to="/profile">
              <font-awesome-icon icon="user-edit" class="mr-2 size-18"/>
              <span>Изменить</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4" align-self="stretch">
        <v-card class="dashboard__card" height="100%">
          <v-card-title class="secondary white--text dashboard__card-title">
            Кошелёк
          </v-card-title>
          <v-card-text class="dashboard__card-text pt-3">
            Баланс: <b>{{user.balance}}</b>
          </v-card-text>
          <v-card-actions class="pa-3 dashboard__card-actions" bottom>
            <v-btn color="default" to="/purse">
              <font-awesome-icon icon="ruble-sign" class="mr-2 size-18"/>
              <span>Движения баллов</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="taxes" cols="12" sm="6" lg="4" align-self="stretch">
        <v-card class="dashboard__card" height="100%">
          <v-card-title class="secondary white--text dashboard__card-title">
            Налоговая анкета
          </v-card-title>
          <v-card-text class="block-chip dashboard__card-text pt-3">
            <div>Статус:
              <v-chip v-if="account" :class="`border-color-${account.status} sale-status`">
                {{account.status_label}}
                <span :class="`bg-color-${account.status} status-point`"></span>
              </v-chip>
              <v-chip v-else class="border-color-red sale-status">
                не заполнена
                <span class="bg-color-red status-point"></span>
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions
            class="pa-3 dashboard__card-actions"
            v-show="!account || account.status !== 'approved'"
          >
            <v-btn color="default" to="/passport">
              <font-awesome-icon icon="address-card" class="mr-2 size-18"/>
              <span>Заполнить анкету</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="requirePers && user" cols="12" sm="6" lg="4" align-self="stretch">
        <v-card class="dashboard__card" height="100%" v-show="pagePers">
          <v-card-title class="secondary white--text">
            Персональные данные
          </v-card-title>
          <v-card-text class="dashboard__card-text pt-3">
            <small>Просим Вас ознакомиться с соглашением по сбору Ваших персональных данных.
              Это нам необходимо для сдачи налоговой информации.
            </small>
            <v-checkbox
              label="Согласие на обработку персональных данных"
              readonly
              v-model="user.pers_at"
              @click="dialogPers=true"></v-checkbox>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="text-center">
        <v-dialog
          v-if="isAuthenticated && hasSurvey"
          v-model="$store.state.dialogs.surveys"
          class="elevation-0"
          hide-overlay
          transition="dialog-bottom-transition"
          max-width="800px"
        >
          <!-- Sueveys component-->
          <Surveys/>
          <!-- /Sueveys component-->
        </v-dialog>

        <v-dialog
          v-if="isAuthenticated && hasNotifications"
          v-model="$store.state.dialogs.notifications"
          class="elevation-0"
          hide-overlay
          transition="dialog-bottom-transition"
          max-width="800px"
        >
          <!-- Notifucations component -->
          <Notifications/>
          <!-- /Notifucations component -->
        </v-dialog>

        <v-dialog v-model="dialogPers" width="500" v-if="requirePers && pagePers">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title v-html="pagePers.title"></v-card-title>
            <v-card-text v-html="pagePers.content"></v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialogPers = false;">Отклонить</v-btn>
              <v-btn @click="dialogPers = false; ConfirmPers();">Принять</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </div>
</template>

<script src="./Dashboard.js"></script>
<style src="./Dashboard.scss" lang="scss" scoped></style>
