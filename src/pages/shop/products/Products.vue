<template>
  <v-row class="products">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Товары</h3>
        </v-card-title>
        <v-card-text v-if="loading">
          Список товаров загружается...
        </v-card-text>
        <v-card-text v-if="!loading && !products.length">
          Список товаров пуст
        </v-card-text>
      </v-card>
    </v-col>

    <template v-if="products.length">
      <v-col
        cols="12"
        sm="6"
        lg="4"
        v-for="item in products"
        :key="item.id"
        class="products__item mb-4"
      >
        <v-card class="products__card">
          <v-img
            :src="`${item.picture_url || 'https://dummyimage.com/400x300/bebebe/fff.jpg&text=%D0%9D%D0%95%D0%A2+%D0%A4%D0%9E%D0%A2%D0%9E'}`"
            aspect-ratio="1.8"
            @click="getProduct(item.id)"
            class="products__img bg-color-white"
            contain
          />
          <v-card-text v-if="item.model || item.vendor_code || item.price" class="products__options">
            <div v-if="item.name" class="products__title">{{item.name}}</div>
            <div v-if="item.model" class="products__option products__option--model">
              <span class="products__option-label">Модель:</span>
              <span class="products__option-value">{{ item.model }}</span>
            </div>
            <div v-if="item.vendor_code" class="products__option products__option--article">
              <span class="products__option-label">Артикул:</span>
              <span class="products__option-value">{{item.vendor_code}}</span>
            </div>
            <div v-if="item.price" class="products__option products__option--price">
              <span class="products__option-label">Цена:</span>
              <span class="products__option-value">
                <b>{{item.price.toLocaleString('ru')}}</b> баллов
              </span>
            </div>
          </v-card-text>
          <v-card-actions class="pa-0 ma-0">
            <v-btn block @click="getProduct(item.id)">
              <span>Подробнее</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script src="./Products.js"></script>
<style src="./Products.scss" lang="scss" scoped></style>
