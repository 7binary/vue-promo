<template>
  <v-row no-gutters>
    <v-col>
      <v-row v-if="!paymentFinish" class="payments">
        <v-col class="pt-0">
          <v-card>
            <v-card-title class="primary">
              <h3 class="headline white--text">Перевод на эл.кошельки, телефоны и банковские карты</h3>
            </v-card-title>
            <v-layout column>
              <v-flex xs12 sm6 md4 lg6 mx-1>
                <v-card-title>Метод перевода:</v-card-title>
                <v-layout class="paymentsMemu pt-0" row wrap>
                  <v-flex
                    ma-2
                    v-for="item in enabledPaymentsMethods"
                    :key="item.id"
                    @click="handleChangeMethod(item)"
                    :class="[{paymentsMemuActiveItem: item.type === current.type, paymentsMemuItem: true}]"
                  >
                    <div class="mode" :style="`background-image:url('../static/ico-${item.type}.png')`">
                      <span class="mode-title">{{ item.title }}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 sm6 md8 lg6>
                <v-card-text class="pt-0 pb-0">
                  <v-form
                    autocomplete="off"
                    ref="form"
                    validation
                    v-model="form.valid"
                    class="prizes-form"
                  >
                    <v-text-field
                      v-if="current.type === 'yandex' || current.type === 'webmoney'"
                      type="num" id="value"
                      :label="current.title"
                      v-model="form.value"
                      :rules="[rules.required, rules.purse]"
                    ></v-text-field>
                    <v-text-field
                      v-if="current.type === 'rbs'"
                      type="text" id="value"
                      :label="current.title"
                      v-model="form.value"
                      :rules="[rules.required, rules.number]"
                    ></v-text-field>
                    <v-text-field
                      v-if="current.type === 'phone' || current.type === 'qiwi'"
                      type="text" id="value"
                      :label="current.title"
                      v-model="form.value"
                      v-mask="'+7 (###) ###-####'"
                      :rules="[rules.required, rules.phoneLength]"
                    ></v-text-field>
                    <v-text-field
                      v-if="current.type === 'card'"
                      type="text" id="value"
                      :label="current.title"
                      v-model="form.value"
                      v-mask="'#### #### #### ####'"
                      :rules="[rules.required, rules.cardLength]"
                    ></v-text-field>
                    <v-text-field
                      type="num"
                      label="Сумма"
                      id="amount"
                      v-model="form.amount"
                      :rules="[rules.required, rules.number]"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
              </v-flex>
            </v-layout>
            <v-divider light class="mb-2"></v-divider>
            <v-card-text v-if="this.hasTaxes && !userHasPassport">
              Для переводов необходимо заполнить Анкету НДФЛ и дождаться подтверждения анкеты модератором сайта
            </v-card-text>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn v-if="this.hasTaxes && !userHasPassport" to="/passport">
                <font-awesome-icon icon="clipboard-list" class="size-18 mr-2"/>
                <span>Заполнить</span>
              </v-btn>
              <v-btn class="mt-1" :disabled="!form.valid || (this.hasTaxes && !userHasPassport)" @click="paymentSubmit">Перевести</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <v-card>
            <v-card-title class="primary body-1">Перевод успешно отправлен</v-card-title>
            <v-card-text>Ваш платеж принят в работу. Платеж будет обработан в ближайшее время.</v-card-text>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn class="mt-3" @click="paymentFinish = !paymentFinish">Завершить</v-btn>
              <v-btn class="primary mt-3" to="/purse">Все платежи</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./PrizesPayments.js"></script>
<style src="./PrizesPayments.scss" lang="scss" scoped></style>
