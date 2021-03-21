<template>
  <v-row no-gutters class="orders">
    <v-col cols="12" md="10" offset-md="1">
      <v-tabs
        fixed-tabs
        class="orders__tabs"
      >
        <v-tab class="orders__tab-link">Сертификаты</v-tab>
        <v-tab-item>
          <v-card
            v-for="order in epsOrders"
            :key="order.ms_order_id"
            class="mt-4"
          >
            <v-card-title class="secondary white--text">
              Заказ №{{order.ms_order_id}} от {{order.created_at}}
            </v-card-title>
            <v-card-text class="certificate-list pa-0">
              <div v-if="order.delivery_address && order.delivery_address.length">
                <b>Адрес доставки</b>: {{order.delivery_address}}
              </div>
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="certificate-list--wrap px-3"
              >
                <v-divider v-if="index"></v-divider>
                <v-row>
                  <v-col cols="12" sm="2">
                    <v-img
                      :src="getPrizeByID(item.card).image"
                      aspect-ratio="1.8"
                      class="eps__img"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <small class="sert-label">Сертификат</small>
                    <div class="sert-title">{{item.card_title}}</div>
                  </v-col>
                  <v-col cols="4" sm="2" class="text-center">
                    <small class="sert-label">Номинал</small>
                    <div class="sert-title">{{item.nominal}}</div>
                  </v-col>
                  <v-col cols="4" sm="3" lg="2" class="text-center">
                    <small class="sert-label">Количество</small>
                    <div class="sert-title">{{item.qty}}</div>
                  </v-col>
                  <v-col cols="4" sm="3" lg="2" class="text-center">
                    <small class="sert-label">Сумма</small>
                    <div class="sert-title">{{item.nominal*item.qty}}</div>
                  </v-col>
                  <v-col cols="12" lg="2" class="text-right">
                    <div v-if="item.cards && item.cards.length">
                      <font-awesome-icon
                        v-for="card in item.cards"
                        :key="card.ms_card_id"
                        @click="DownloadCard(order, card)"
                        icon="cloud-download-alt"
                        class="icon-download"
                      />
                    </div>

                    <div class="block-chip" v-else>
                      <v-chip class="border-color-orange sale-status bg-color-white">
                        Заказ не готов
                        <span class="bg-color-orange status-point"></span>
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab class="orders__tab-link">Платежи</v-tab>
        <v-tab-item class="orders__tab-item">
          <v-card
            v-for="payment in payments"
            :key="payment.ms_payment_id"
            v-if="paymentsInfo"
            class="mt-4"
          >
            <v-card-title class="secondary justify-space-between block-chip white--text">
              Платеж №{{payment.ms_payment_id}}
              <v-chip v-if="payment.status === 'paid'" class="border-color-green sale-status">
                Обработан
                <span class="bg-color-green status-point"></span>
              </v-chip>
              <v-chip v-else class="border-color-orange sale-status bg-color-white-rgba-9">
                В обработке
                <span class="bg-color-orange status-point"></span>
              </v-chip>
            </v-card-title>
            <v-card-text class="payments-list pa-0">
              <v-row>
                <v-col cols="12" sm="1" class="text-center payments-list__icon">
                  <font-awesome-icon
                    :icon="getPaymentIcon(payment.type)"
                    class="payment-icon"
                  />
                </v-col>
                <v-col cols="12" sm="4" class="text-center payments-list__target">
                  <small class="pay-label">
                    {{getPaymentByType(payment.type) ? getPaymentByType(payment.type).title : ''}}
                  </small>
                  <div class="pay-title">
                    {{payment.parameters.phone_mobile}}
                  </div>
                </v-col>
                <v-col cols="12" sm="4" class="text-center payments-list__date">
                  <small class="pay-label">
                    Дата платежа
                  </small>
                  <div class="date pay-title">
                    {{payment.created_at}}
                  </div>
                </v-col>
                <v-col cols="12" sm="3" class="text-center payments-list__sum">
                  <small class="pay-label">Сумма</small>
                  <div class="date pay-title">{{payment.amount}}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab class="orders__tab-link">Товары</v-tab>
        <v-tab-item class="orders__tab-item">
          <v-card v-for="order in products" :key="order.order_id" class="mt-4">
            <v-card-title class="secondary white--text">
              Заказ №{{order.order_id}} от {{order.created}}
            </v-card-title>
            <v-card-text class="certificate-list pa-0">
              <div v-if="order.delivery_address && order.delivery_address.length" class="px-3">
                <b>Адрес доставки</b>: {{order.delivery_address}}
              </div>
              <div v-for="item in order.items" :key="item.id" class="certificate-list--wrap">
                <v-row>
                  <v-col cols="12" sm="2">
                    <v-img
                      :src="item.product.picture_url"
                      aspect-ratio="1.8"
                      class="eps__img"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <small class="sert-label">Товар</small>
                    <div class="sert-title">{{item.product.name}}</div>
                  </v-col>
                  <v-col cols="4" sm="2" class="text-center">
                    <small class="sert-label">Модель</small>
                    <div class="sert-title">{{item.product.model}}</div>
                  </v-col>
                  <v-col cols="4" sm="3" lg="2" class="text-center">
                    <small class="sert-label">Количество</small>
                    <div class="sert-title">{{item.qty}}</div>
                  </v-col>
                  <v-col cols="4" sm="3" lg="2" class="text-center">
                    <small class="sert-label">Сумма</small>
                    <div class="sert-title">{{item.product.price*item.qty}}</div>
                  </v-col>
                  <v-col cols="12" lg="2" class="text-right">
                    <div v-if="item.cards && item.cards.length">
                      <v-icon class="icon-download" v-for="card in item.cards" :key="card.ms_card_id"
                              @click="DownloadCard(order, card)">
                        cloud_download
                      </v-icon>
                    </div>

                    <div class="block-chip" v-else>
                      <v-chip class="sale-status bg-color-white"
                              :class="`border-color-${getProductsOrderStatus(order.status).color}`">
                        {{ getProductsOrderStatus(order.status).text }}
                        <span class="status-point"
                              :class="`bg-color-${getProductsOrderStatus(order.status).color}}`"></span>
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <v-card v-if="!epsOrders.length && !products.length" class="mt-4">
        <v-card-title>
          Заказы отсутствуют
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Orders.js"></script>
<style src="./Orders.scss" lang="scss"></style>
