<template>
  <v-card class="notifications">
    <v-img v-if="notification.image_url" :src="notification.image_url" :aspect-ratio="16/9">
      <v-layout column fill-height class="lightbox white--text">
        <v-flex v-if="notification.bonuses" pa-2 shrink class="notification__desc">
          <div class="subheading text-xs-center">За прохождение опроса
            <v-chip class="notification__bonuses" color="primary" text-color="white">+{{ notification.bonuses }}</v-chip>
            баллов!
          </div>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex pa-2 shrink class="notification__desc">
          <v-card-title class="headline notification__title">{{ notification.title }}</v-card-title>
        </v-flex>
      </v-layout>
    </v-img>
    <v-card-title v-else class="primary">{{ notification.title }}</v-card-title>
    <v-card-text v-html="notification.content"></v-card-text>
    <v-btn v-if="notification.url" :to="notification.url">Подробнее</v-btn>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="submitLater">Закрыть</v-btn>
      <v-btn @click="submit">Согласен</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./Notifications.js"></script>
<style src="./Notifications.scss" lang="scss" scoped></style>
