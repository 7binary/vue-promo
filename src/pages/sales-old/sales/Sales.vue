<template>
  <v-row class="sales">
    <!-- TODO доделать страницу как починят бэкенд -->
    <v-col cols="12">
      <v-card class="card">
        <v-card-title class="primary justify-space-between">
          <h3 class="headline white--text">Продажи</h3>
          <v-btn @click="addSale(null)" class="sales__btn-top">
            <font-awesome-icon icon="plus-circle" class="size-18 mr-2"/>
            <span>Регистрация новой продажи</span>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="loading" class="pt-3">
          Список продаж загружается
        </v-card-text>
        <v-card-text v-if="!loading && !sales.length" class="pt-3">
          Список продаж пуст
        </v-card-text>
      </v-card>
    </v-col>

    <template v-if="sales.length">
      <v-col
        cols="12"
        md="6"
        v-for="sale in sales"
        :key="sale.id"
      >
        <v-card class="card ma-3 xs-margin-x0">

          <v-card-title class="secondary py-2 block-chip">
            <v-layout max row wrap>
              <v-flex :class="`${sale.status} justify-space-between display-flex`">
                <span>{{sale.created_at}}</span>
                <span>Номер: {{sale.number}}</span>
                <v-chip :class="`border-${getStatusColor(sale.status)} sale-status`">
                  {{sale.status_label}}
                  <span :class="`bg-${getStatusColor(sale.status)} status-point`"></span>
                </v-chip>
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-text class="py-3">
            <v-data-table
              :headers="tables.headers"
              :items="sale.positions"
              hide-actions
              class="elevation-0"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.product.name }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.bonuses }}</td>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="px-3 sales__btn-bottom">
            <v-layout row wrap>
              <v-flex class="first-btn">
                <v-btn @click="showHistory(sale.id)">
                  <span>История</span>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
              </v-flex>
              <v-flex class="text-xs-right" v-if="sale.status === 'adminReview' || sale.status === 'draft'">
                <v-btn @click="addSale(sale.id)">
                  <font-awesome-icon icon="edit" class="size-18 mr-2"/>
                  <span>Редактировать</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <transition-group class="mt-2">
            <div v-for="item in history" :key="item.id" v-if="showHistoryID && (showHistoryID === sale.id)">
              <v-card-text class="py-2">
                <div class="sale-footer-wrap">
                  <div class="sale-time mr-3">
                    <i class="material-icons">query_builder</i>
                    <span>{{item.created_at}}</span>
                  </div>
                  <div class="sale-note mr-3">
                    <i class="material-icons">autorenew</i>
                    <span>{{item.note}}</span>
                  </div>
                  <div class="sale-comment" v-if="item.comment">
                    <i class="material-icons">chat_bubble_outline</i>
                    <span>{{item.comment}}</span>
                  </div>
                </div>
              </v-card-text>
            </div>
          </transition-group>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script src="./Sales.js"></script>
<style src="./Sales.scss" lang="scss" scoped></style>
