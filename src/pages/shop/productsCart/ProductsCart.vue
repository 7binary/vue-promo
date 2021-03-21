<template>
  <div class="prod-cart">
    <v-row>
      <v-col cols="12" sm="12" md="7">
        <v-card>
          <v-card-title class="secondary white--text">
            Корзина товаров
          </v-card-title>
          <v-card-text class="px-3 pb-0">
            <div v-for="product in cart.products" :key="product.id">
              <v-row
                align="center"
                class="prod-cart__item"
              >
                <v-col
                  cols="12"
                  sm="12"
                  md="7"
                  class="py-0 prod-cart__item-name"
                >
                  {{ product.name }}
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                  class="py-0 prod-cart__item-qty"
                >
                  <v-text-field
                    type="number"
                    label="Кол-во"
                    required
                    v-model.number="product.qty"
                    @click="ChangeQty(product)"
                    @keyup="ChangeQty(product)"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  sm="5"
                  md="2"
                  class="text-center py-0 prod-cart__item-sum"
                >
                  <div class="prod-cart__item-label mb-1">Итого</div>
                  <div class="order-page--name">{{(product.price * product.qty).toLocaleString('ru')}}</div>
                </v-col>

                <v-col
                  cols="12"
                  sm="1"
                  md="1"
                  class="text-center py-0 prod-cart__item-del"
                >
                  <font-awesome-icon
                    size="lg"
                    class="prod-cart__item-del-icon red--text"
                    @click="RemoveProduct(product.id)"
                    icon="trash-alt"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>

          <v-card-actions v-if="cart.cartLength" class="grey lighten-3">
            <div class="opf">
              Мой баланс:
              <big><b>{{balance.toLocaleString('ru')}}</b></big>
              баллов
            </div>
            <v-spacer></v-spacer>
            <div class="opf text-right">
              Общая сумма:
              <big><b>{{cart.cartSummary.toLocaleString('ru')}}</b></big>
              баллов
            </div>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="5" pl-2>
        <v-card>
          <v-card-title class="secondary">Оформление заказа</v-card-title>
          <v-card-text>
            <div v-if="this.$store.state.settings.taxes === true && !userHasPassport">
              <div class="mb-3">Для заказа призов необходимо заполнить Анкету НДФЛ и дождаться подтверждения анкеты
                модератором сайта
              </div>
              <v-btn to="/passport" class="mx-0">
                <font-awesome-icon icon="clipboard-list" class="size-18 mr-2"/>
                <span>Заполнить</span>
              </v-btn>
            </div>
            <div v-else>
              <form @submit.prevent="SendOrder" autocomplete="off">
                <div class="v-input v-text-field theme--light prod-cart__address">
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-text-field__slot">
                        <label aria-hidden="true" class="v-label v-label--active theme--light"
                               style="left: 0px; right: auto; position: absolute;">Адрес доставки</label>
                        <el-autocomplete
                          v-model="delivery_address"
                          :fetch-suggestions="AutocompleteSearch"
                          @select="AutocompleteSelect"
                          placeholder="Москва, Тверской б-р, д 9"
                          :trigger-on-focus="false"
                          id="delivery-address"
                          required
                        ></el-autocomplete>
                      </div>
                    </div>
                    <div class="v-text-field__details">
                      <div class="v-messages theme--light">
                        <div class="v-messages__wrapper"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <v-card-actions class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn type="submit" :disabled="loading">Заказать</v-btn>
                </v-card-actions>
              </form>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./ProductsCart.js"></script>
<style src="./ProductsCart.scss" lang="scss"></style>
