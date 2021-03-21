<template>
  <v-row class="instructions">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Презентации</h3>
        </v-card-title>
        <v-card-text v-if="!loading && !instructions.length" class="py-3">
          Список презентаций пуст
        </v-card-text>
        <v-card-text v-if="loading" class="py-3">
          Список презентаций загружается...
        </v-card-text>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="4"
      v-if="instructions.length"
      class="instructions__item mb-4"
      v-for="item in instructions"
      :key="item.id"
      :class="item.readed ? 'readed' : 'noread'"
    >
      <v-card class="instructions__card">
        <v-img
          :src="`${item.image_preview_url ? item.image_preview_url : 'https://dummyimage.com/600x450/bebebe/fff.jpg&text=%D0%9D%D0%95%D0%A2+%D0%A4%D0%9E%D0%A2%D0%9E'}`"
          aspect-ratio="1.8"
          class="instructions__img"
          @click="getPublication(item.id)"
        />
        <v-card-text>
          <div class="instructions__title">{{item.title}}</div>
          <div class="instructions__date">{{item.created_at}}</div>
          <div v-if="item.anons" class="instructions__deacription">{{item.anons}}</div>
        </v-card-text>
        <v-card-actions class="pa-0 ma-0">
          <v-btn block @click="getPublication(item.id)">
            <span>Подробнее</span>
            <font-awesome-icon icon="book-open" class="size-18 ml-2"/>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Instructions.js"></script>
<style src="./Instructions.scss" lang="scss" scoped></style>
