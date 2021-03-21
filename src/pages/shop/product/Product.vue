<template>
  <v-row class="product">
    <v-col v-if="loading" cols="12" md="8" offset-md="2">
      <v-card>
        <v-card-title class="secondary">
          <div class="white--text">Товар</div>
        </v-card-title>
        <v-card-text class="pt-3">
          Товар загружается...
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="!loading && !product" cols="12" md="8" offset-md="2">
      <v-card>
        <v-card-title class="secondary">
          <div class="white--text">Товар</div>
        </v-card-title>
        <v-card-text class="pt-3">
          Товар не найден
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="product" cols="12" md="8" offset-md="2">
      <v-card>
        <v-card-title v-if="product.name" class="secondary product__head">
          <div class="product__title white--text">{{product.name}}</div>
        </v-card-title>
        <v-img v-if="product.picture_url" :src="product.picture_url" aspect-ratio="1.8" class="product__img bg-color-white" contain/>
        <v-card-text class="dark-text">
          <div v-if="product.vendor_code" class="product__article">
            Артикул: <span class="po-title">{{ product.vendor_code }}</span>
          </div>
          <div v-if="product.model" class="product__model">
            Модель: <span class="po-title">{{ product.model }}</span>
          </div>
          <div v-if="product.price" class="product__price">
            Цена: <span class="po-title">{{ product.price.toLocaleString('ru') }}</span> баллов
          </div>
          <div v-if="product.url" class="product__link">
            <a :href="product.url" target="_blank">Перейти на страницу товара</a>
          </div>
          <v-row>
            <v-col cols="6" md="2">
              <v-text-field
                class="mr-3"
                type="number"
                label="Кол-во"
                required
                v-model.number="qty"
                @click="ChangeQty"
                @keyup="ChangeQty"
              ></v-text-field>
            </v-col>
          </v-row>
          <div v-if="product.description" v-html="product.description"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/shop/">
            <font-awesome-icon icon="arrow-left" class="size-18 mr-2"/>
            <span>Назад</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!product.price"
            @click="AddToCart(product)"
            color="primary"
          >
            <span>В корзину</span>
            <font-awesome-icon icon="shopping-cart" class="size-18 ml-2"/>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Товар успешно добавлен в корзину</v-card-title>
        <v-card-text>Товар успешно добавлен в корзину</v-card-text>
        <v-card-actions>
          <v-btn color="secondary" text @click="dialog = false">Продолжить</v-btn>
          <v-spacer></v-spacer>
          <v-btn to="/cart/" color="primary" text @click="dialog = false">Оформить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script src="./Product.js"></script>
<style src="./Product.scss" lang="scss" scoped></style>
