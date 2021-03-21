<template>
  <v-row>
    <v-col v-if="results.length" cols="12" md="10" offset-md="1" lg="8" offset-lg="2" class="mb-4">
      <v-card class="card mb-3">
        <v-card-title class="primary">
          <h3 class="headline white--text">{{ results[0].test_title }}</h3>
        </v-card-title>
        <v-card-text class="pt-2">
          Количество бонусов зависит от процента правильных ответов.
          <ul class="py-2">
            <li v-for="(bonus, i) in results[0].bonuses" :key="i">
              {{ bonus.percent_min }} - {{ bonus.percent_max }}% = {{ bonus.bonuses }} баллов
            </li>
          </ul>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pb-2 mt-2">
          <v-btn to="/courses">
            <font-awesome-icon icon="arrow-left" class="color-white mr-2"/>
            <span>Курсы</span>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-for="(item, index) in results" class="card mb-3" :key="index">
        <v-card-title class="secondary justify-space-between">
          <div class="result-title white--text">Результат тестирования №{{item.position}}</div>
          <small class="white--text">{{item.finished_at}}</small>
        </v-card-title>
        <v-card-text class="justify-space-between pt-2">
          <v-layout align-center justify-space-between row fill-height>
            <div class="result">
              Верных ответов: <b>{{item.correct_answers}}</b> из <b>{{item.results.length}}</b>.<br>
              Процент правильных ответов на тест: <b>{{ correctPercent(item.correct_answers, item.wrong_answers, item.results.length) }}%</b>
            </div>
            <div class="progress">
              <v-progress-circular
                :rotate="-90"
                :size="70"
                :width="15"
                :value="correctPercent(item.correct_answers, item.wrong_answers, item.results.length)"
                color="primary"
              >
                <b>{{ correctPercent(item.correct_answers, item.wrong_answers, item.results.length) }}%</b>
              </v-progress-circular>
            </div>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-else cols="12" md="10" offset-md="1" lg="8" offset-lg="2" class="mb-4">
      <v-card class="card">
        <v-card-title class="primary">
          <h3 class="headline mb-0 white--text">Результаты теста №{{id}}</h3>
        </v-card-title>
        <v-card-text class="pt-5 pb-5">
          Для этого теста нет найденных результатов.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pb-2 mt-2">
          <v-spacer></v-spacer>
          <v-btn to="/courses">
            <v-icon>keyboard_arrow_left</v-icon>
            Курсы
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Results.js"></script>
<style src="./Results.scss" lang="scss" scoped></style>
