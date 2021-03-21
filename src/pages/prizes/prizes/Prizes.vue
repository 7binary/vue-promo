<template>
  <v-row class="prizes">
    <v-col cols="12" lg="10" offset-lg="1">

      <!-- Payments component-->
      <Payments v-if="hasPayments"/>
      <!-- /Payments component-->

      <v-row v-if="hasShop">
        <v-col class="text-center">
          <v-btn to="/shop/" class="all-products mb-4">Перейти к товарам</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          class="prizes__item"
          v-for="card in cards"
          :key="card.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            max-height="500"
            elevation="0"
            class="prizes__card"
            @click="GetDetails(card.type)"
          >
            <v-img
              :src="card.image"
              :alt="card.title"
              @click="GetDetails(card.type)"
              class="white--text align-end"
              max-height="200"
              contain
            ></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./Prizes.js"></script>
<style src="./Prizes.scss" lang="scss"></style>
