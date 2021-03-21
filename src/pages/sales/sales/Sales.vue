<template>
  <v-row class="sales">

    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Продажи</h3>
        </v-card-title>
        <v-card-text v-if="!loading && !sales.length" class="py-3">
          Список продаж пуст
        </v-card-text>
        <v-card-text v-if="loading" class="py-3">
          Список продаж загружается
        </v-card-text>
      </v-card>
    </v-col>

    <template v-if="sales.length">
      <v-row>
        <v-col cols="12" md="6" v-for="sale in sales" :key="sale.id">
          <v-card class="card ma-3 xs-margin-x0">
            <v-card-title class="secondary py-2 block-chip white--text">
              <v-row>
                <v-col cols="12" :class="`${sale.status} justify-space-between d-flex`">
                  <span>{{ sale.action.title }}</span>
                  <v-chip :class="`border-${getStatusColor(sale.status)} sale-status`">
                    {{ sale.status_label }}
                    <span :class="`bg-${getStatusColor(sale.status)} status-point`"></span>
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="py-3">
              <v-data-table
                :headers="tables.headers"
                :items="sale.positions"
                hide-default-footer
                hide-actions
                class="elevation-0"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-sm-left">{{ props.item.product.name }}</td>
                  <td class="text-sm-right">{{ props.item.quantity }}</td>
                  <td class="text-sm-right">{{ props.item.bonuses }}</td>
                </template>
              </v-data-table>
              <v-divider/>
              <div class="sales__bonuses-sum mt-3">
                <div class="sales__bonuses-sum-label">Итого</div>
                <div class="sales__bonuses-sum-value">{{ getSaleQuantity(sale.id) }}</div>
              </div>
              <div class="sales__bonuses-sum">
                <div class="sales__bonuses-sum-label">Начислено бонусов</div>
                <div class="sales__bonuses-sum-value">{{ sale.bonuses }}</div>
              </div>
            </v-card-text>
            <v-card-actions class="px-3 sales__btn-bottom">
              <v-row>
                <v-col cols="12" sm="6" class="first-btn">
                  <v-btn @click="showHistory(sale.id)">
                    <span>История</span>
                    <v-icon v-if="showHistoryID && (showHistoryID === sale.id)">mdi-chevron-up</v-icon>
                    <v-icon v-else>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="text-sm-right" v-if="sale.status === 'adminReview' || sale.status === 'draft'">
                  <v-btn
                    @click="addSale(sale.id)"
                    v-if="sale.action && sale.action.is_actual"
                  >
                    <font-awesome-icon icon="edit" class="size-18 mr-2"/>
                    <span>Редактировать</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <transition-group class="mt-2">
              <div v-for="item in history" :key="item.id" v-if="showHistoryID && (showHistoryID === sale.id)">
                <v-card-text class="py-2">
                  <div class="sale-footer-wrap">
                    <div class="sale-time mr-3">
                      <i class="material-icons">query_builder</i>
                      <span>{{ item.created_at }}</span>
                    </div>
                    <div class="sale-note mr-3">
                      <i class="material-icons">autorenew</i>
                      <span>{{ item.note }}</span>
                    </div>
                    <div class="sale-comment" v-if="item.comment">
                      <i class="material-icons">chat_bubble_outline</i>
                      <span>{{ item.comment }}</span>
                    </div>
                  </div>
                </v-card-text>
              </div>
            </transition-group>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-row>
</template>

<script src="./Sales.js"></script>
<style src="./Sales.scss" lang="scss" scoped></style>
