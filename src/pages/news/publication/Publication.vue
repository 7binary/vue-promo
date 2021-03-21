<template>
  <v-row class="publication">
    <v-col cols="12" lg="8" offset-lg="2">
      <v-card v-if="publication">
        <v-img v-if="publication.image_preview_url" :src="publication.image_preview_url" aspect-ratio="1.8" class="publication__img" />
        <v-card-text class="dark-text">
          <div class="publication__title">{{publication.title}}</div>
          <div class="publication__date">{{publication.created_at}}</div>
          <div v-if="publication.content" v-html="publication.content"></div>
          <div v-else>Текст новости не добавлен</div>
        </v-card-text>
        <v-card-actions class="pa-0 ma-0">
          <v-btn block to="/news/">
            <font-awesome-icon icon="arrow-left" class="size-18 mr-2"/>
            <span>Назад</span>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else>
        <v-card-title class="secondary publication__head">
          <div class="publication__title">Публикация</div>
        </v-card-title>
        <v-card-text class="dark-text">
          <div>Новость не нейдена</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Publication.js"></script>
<style src="./Publication.scss" lang="scss" scoped></style>
