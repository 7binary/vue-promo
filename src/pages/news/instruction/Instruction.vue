<template>
  <v-row class="instruction">
    <v-col cols="12" lg="8" offset-lg="2">
      <v-card v-if="instruction">
        <v-img
          v-if="instruction.image_preview_url"
          :src="instruction.image_preview_url"
          aspect-ratio="1.8"
          class="instruction__img"
        />
        <v-card-text class="dark-text">
          <div class="instruction__title">{{instruction.title}}</div>
          <div class="instruction__date">{{instruction.created_at}}</div>
          <div v-html="instruction.content"></div>
        </v-card-text>
        <v-card-actions class="justify-space-between instructions__button">
          <v-btn to="/instructions/">
            <font-awesome-icon icon="arrow-left" class="size-18 mr-2"/>
            <span>Назад</span>
          </v-btn>
          <v-btn v-if="instruction.pdf_file_url" :href="instruction.pdf_file_url" target="_blank">
            <font-awesome-icon icon="file-pdf" class="size-18 mr-2"/>
            <span>Скачать инструкцию</span>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else>
        <v-card-title class="secondary white--text">
          <div class="instruction__title">Публикация</div>
        </v-card-title>
        <v-card-text class="dark-text">
          <div>Публикация не нейдена</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Instruction.js"></script>
<style src="./Instruction.scss" lang="scss" scoped></style>
