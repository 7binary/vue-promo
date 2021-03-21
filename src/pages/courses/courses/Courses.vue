<template>
  <v-row class="courses">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary white--text">
          <h3 class="headline">Обучение</h3>
        </v-card-title>
      </v-card>
    </v-col>

    <v-col
      cols="12" sm="6" lg="4"
      class="mb-4"
      v-for="item in courses"
      :key="item.id"
    >
      <v-card class="courses__card">
        <v-img
          :src="item.file_preview_url ? item.file_preview_url : 'https://dummyimage.com/600x450/bebebe/fff.jpg&text=%D0%9D%D0%95%D0%A2+%D0%A4%D0%9E%D0%A2%D0%9E'"
          aspect-ratio="1.33"
          class="courses__card-img"
          @click="goToCourse(item.id)"
        >
          <v-row class="courses__card-content">
            <v-col
              cols="12"
              class="courses__card-header py-0"
            >
              <div class="courses__card-title white--text pa-2">
                {{item.title}}
              </div>
            </v-col>
            <v-col
              cols="12"
              v-if="item.bonuses"
              class="courses__card-footer py-0"
            >
              <div class="courses__bonuses pa-2">
                <v-chip
                  class="courses__bonuses-chip"
                  color="secondary"
                >+{{ item.bonuses }}</v-chip>
                <span class="white--text">
                  баллов за прохождение теста
                </span>
              </div>
            </v-col>
          </v-row>
        </v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Courses.js"></script>
<style src="./Courses.scss" lang="scss"></style>
