<template>
  <v-row v-if="user" class="bonuses">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Количество&nbsp;баллов:&nbsp;{{user.balance}}</h3>
        </v-card-title>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="4"
      class="bonuses__item px-3 pb-3 mb-2"
      v-for="item in bonusesList"
      :key="item.external_id"
    >
      <v-card>
        <v-card-title class="secondary py-1 bonuses__head">
          <v-layout align-center justify-space-between>
            <div>
              <v-icon class="mx-0" right color="green">arrow_upward</v-icon>
              <span>{{item.bonuses}}</span>
            </div>
            <div>
              <small class="bonuses__date">{{item.date}}</small>
            </div>
          </v-layout>
        </v-card-title>
        <v-card-text class="bonuses__text">
          <v-icon class="bonuses__text-icon" large color="blue-grey darken-2">money</v-icon>
          <span class="bonuses__text-summ">
            Сумма продаж: <b>{{ item.sales_summary.toLocaleString('ru') }}</b> баллов
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./ProfileBonuses.js"></script>
<style src="./ProfileBonuses.scss" lang="scss" scoped></style>
