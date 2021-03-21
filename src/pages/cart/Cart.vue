<template>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Корзина</h3>
        </v-card-title>

        <v-card-text
          class="px-3 py-2 bg-color-white"
          v-if="(!epsCartLength && !productsCartLength)"
        >Корзина пуста</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <!-- Prizes cart -->
      <EpsCart v-if="epsCartLength" class="eps-cart"/>
      <!-- /Prizes cart -->

      <!-- Products cart -->
      <ProductsCart v-if="productsCartLength" class="products-cart"/>
      <!-- /Products cart -->
    </v-col>
  </v-row>
</template>

<script src="./Cart.js"></script>
<style src="./Cart.scss" lang="scss" scoped></style>
