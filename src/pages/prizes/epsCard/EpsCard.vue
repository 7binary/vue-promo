<template>
  <div>
    <v-row class="eps-card">
      <v-col cols="12" lg="8" offset-lg="2">
        <v-card class="card">
          <v-card-title class="primary">
            <h3 class="headline white--text">
              Подарочный сертифткат: {{card.title}}
            </h3>
          </v-card-title>

          <div class="card-box">
            <v-row class="px-3 pt-3">
              <v-col cols="12" sm="4">
                <v-img :src="card.image" aspect-ratio="1.8" class="card-box-img"></v-img>
              </v-col>
              <v-col cols="12" sm="8">
                <div v-html="card.description"></div>
              </v-col>
            </v-row>
          </div>

          <v-card-actions>
            <v-row>
              <v-col cols="12" sm="5" md="6">
                <v-select
                  :items="nominals"
                  :id="'select-card-' + card.id"
                  :hint="cardHint"
                  v-model="card.nominal"
                  label="Номинал"
                  class="mr-3"
                  item-text="nominal"
                  item-value="price"
                  single-line
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field
                  class="mr-3"
                  type="number"
                  label="Кол-во"
                  placeholder=""
                  required
                  v-model="qty"
                  @click="ChangeQty"
                  @keyup="ChangeQty"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="3" class="eps-card__submit">
                <v-btn class="eps-card__submit-btn" color="primary" @click="Add(card)">
                  <span>В корзину</span>
                  <font-awesome-icon icon="shopping-basket" class="ml-2 size-18"/>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogAdded" max-width="500">
      <v-card>
        <v-card-title class="headline">Сертификат добавлен в корзину</v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" text @click="dialogAdded = false">Продолжить</v-btn>
          <v-btn color="primary" text @click="GoToCart">Оформить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./EpsCard.js"></script>
<style src="./EpsCard.scss" lang="scss" scoped></style>
