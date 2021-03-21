<template>
  <v-row class="news">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Новости</h3>
        </v-card-title>
        <v-card-text v-if="!loading && !news.length" class="py-3">
          Список новостей пуст
        </v-card-text>
        <v-card-text v-if="loading" class="py-3">
          Список новостей загружается
        </v-card-text>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="4"
      v-if="news.length"
      class="news__item mb-4"
      v-for="item in news"
      :key="item.id"
      :class="item.readed ? 'readed' : 'noread'"
    >
      <v-card class="news__card">
        <v-img
          :src="`${item.image_preview_url ? item.image_preview_url : 'https://dummyimage.com/600x450/bebebe/fff.jpg&text=%D0%9D%D0%95%D0%A2+%D0%A4%D0%9E%D0%A2%D0%9E'}`"
          aspect-ratio="1.8"
          @click="getPublication(item.id)"
          class="news__img"
        />
        <v-card-text>
          <div class="news__title">{{item.title}}</div>
          <div class="news__date">{{item.created_at}}</div>
          <div v-if="item.anons" class="news__deacription">{{item.anons}}</div>
        </v-card-text>
        <v-card-actions class="pa-0 ma-0">
          <v-btn block @click="getPublication(item.id)">
            <span>Читать</span>
            <font-awesome-icon icon="book-open" class="size-18 ml-2"/>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./News.js"></script>
<style src="./News.scss" lang="scss" scoped></style>
