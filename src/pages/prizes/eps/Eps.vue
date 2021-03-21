<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap>

      <v-flex md4 xs12 v-for="card in cards" :key="card.id" class="px-3 mb-4">
        <v-card>
          <v-img :src="card.image" aspect-ratio="1.8"></v-img>
          <v-card-text class="pt-1">
            <h3>{{card.title}}</h3>
            <div v-html="card.description" class="card-description pb-0" data-scrollbar></div>
          </v-card-text>
          <v-card-actions class="px-3 justify-space-between">
            <v-select
                    :items="card.nominals"
                    v-model="card.nominal"
                    label="Номинал"
                    class="mr-3"
                    :id="'select-card-' + card.id"
            ></v-select>
            <v-btn @click="Add(card)" >В корзину</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-dialog v-model="dialogAdded" width="500">
        <v-card>
          <v-card-text>
            <h2>Сертификат добавлен в корзину</h2>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="default" @click="dialogAdded = false;">Продолжить</v-btn>
            <v-btn color="primary" @click="dialogAdded = false; GoToCart();">Оформить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script src="./Eps.js"></script>
<style src="./Eps.scss" lang="scss" scoped></style>
