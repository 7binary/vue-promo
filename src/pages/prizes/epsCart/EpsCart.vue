<template>
  <div class="cart">
    <v-row>
      <v-col cols="12" sm="12" md="7">
        <v-card>
          <v-card-title class="secondary white--text">
            Корзина сертификатов
          </v-card-title>
          <v-card-text class="px-3 pb-0">
            <div v-for="(card, cardType) in cart" :key="cardType">
              <v-row
                v-for="(qty, nominal) in card"
                v-if="nominal !== 'card'"
                :key="nominal"
                align="center"
                class="cart__item"
              >
                <v-col
                  cols="12"
                  sm="12"
                  md="7"
                  class="py-0 cart__item-name"
                >
                  {{GetCardTitle(nominal, cardType)}}
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                  class="py-0 cart__item-qty"
                >
                  <v-text-field
                    type="number"
                    label="Кол-во"
                    required
                    v-model="cart[cardType][nominal]"
                    @click="ChangeQty(cardType, nominal, cart[cardType][nominal])"
                    @keyup="ChangeQty(cardType, nominal, cart[cardType][nominal])"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  sm="5"
                  md="2"
                  class="text-center py-0 cart__item-sum"
                >
                  <div class="cart__item-label mb-1">Итого</div>
                  <div class="order-page--name">{{(nominal * qty).toLocaleString('ru')}}</div>
                </v-col>

                <v-col
                  cols="12"
                  sm="1"
                  md="1"
                  class="text-center py-0 cart__item-del"
                >
                  <font-awesome-icon
                    size="lg"
                    class="cart__item-del-icon red--text"
                    @click="RemoveCard(cardType, nominal)"
                    icon="trash-alt"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions v-if="cartLength" class="grey lighten-3">
            <div class="opf">
              Мой баланс:
              <big><b>{{balance.toLocaleString('ru')}}</b></big>
              баллов
            </div>
            <v-spacer></v-spacer>
            <div class="opf text-right">
              Общая сумма:
              <big><b>{{cartSummary.toLocaleString('ru')}}</b></big>
              баллов
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="5">
        <v-card>
          <v-card-title class="secondary white--text">
            Оформление заказа
          </v-card-title>
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
                <v-text-field
                  type="text"
                  label="Эл. почта для получения сертификата"
                  v-model="form.delivery_email"
                  required
                ></v-text-field>

                <div v-if="hasPlastic" class="v-input v-text-field theme--light cart__address">
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-text-field__slot">
                        <label aria-hidden="true" class="v-label v-label--active theme--light"
                               style="left: 0px; right: auto; position: absolute;">Адрес доставки</label>
                        <el-autocomplete
                          v-model="form.delivery_address"
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
                <v-row>
                  <v-col cols="1">
                    <v-checkbox
                      @change="checkbox = !checkbox"
                      class="mt-0 align-start"
                      id="cart-allow-cancel"
                      v-model="form.is_allow_cancel"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="11">
                    <label for="cart-allow-cancel" class="sm-label">
                      Я уверен в своем заказе и хочу сразу отправить его на обработку. <br>
                      Я понимаю, что его нельзя будет отменить.
                      (Вы&nbsp;получите данный заказ быстрее)
                    </label>
                  </v-col>
                </v-row>

                <v-card-actions class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn v-if="!checkbox" type="submit" :disabled="loading">Заказать</v-btn>
                  <v-btn v-else type="submit" :disabled="loading">Заказать</v-btn>
                </v-card-actions>
              </form>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogOrdered" width="500">
      <v-card>
        <v-card-text>
          <h2>Заказ оформлен!</h2>
          <div>В течение 5 дней сертификаты придут на указанную почту</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="GoToOrders">Продолжить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./EpsCart.js"></script>
<style src="./EpsCart.scss" lang="scss"></style>
