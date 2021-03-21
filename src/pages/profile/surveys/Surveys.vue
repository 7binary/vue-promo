<template>
  <v-card class="survey">
    <v-img v-if="survey.image_url" :aspect-ratio="16/9" :src="survey.image_url">
      <v-row class="survey__header">
        <v-col cols="12" class="survey__desc py-0">
          <div class="subheading survey__desc-bonuses pa-3">
            <span class="white--text">За прохождение опроса</span>
            <v-chip
              class="survey__bonuses"
              color="primary"
              text-color="white"
            >+{{ survey.bonuses }}
            </v-chip>
            <span class="white--text">баллов!</span>
          </div>
        </v-col>
        <v-col cols="12" class="survey__title pb-0">
          <v-card-title class="headline survey__title-text white--text">{{ survey.title }}</v-card-title>
        </v-col>
      </v-row>
    </v-img>
    <v-card-text class="survey__content pb-0 pt-3" v-html="survey.content"></v-card-text>

    <v-stepper v-if="questions.length" v-model="step" vertical>
      <template v-for="(item, index) in questions">
        <v-stepper-step :complete="step > (index + 1)" :step="index + 1">
          {{ item.title }}
          <small v-if="item.multiple">Можно указать несколько ответов</small>
          <small v-else>Можно выбрать только один ответ</small>
        </v-stepper-step>
        <v-stepper-content :step="index + 1">
          <v-card color="elevation-0" class="mb-3">
            <v-row>
              <v-col cols="12" class="pl-5">
                <div v-if="item.multiple && item.answers.length">
                  <v-checkbox
                    v-for="(answer, index) in item.answers"
                    :key="index"
                    v-model="item.answer.checked"
                    :value="answer.id"
                    color="#3e4c66"
                    hide-details
                    :label="answer.title"
                  ></v-checkbox>
                </div>
                <v-radio-group v-else-if="!item.multiple && item.answers.length" v-model="item.answer.checked">
                  <v-radio
                    v-for="(answer, index) in item.answers"
                    :key="index"
                    :value="answer.id"
                    color="#3e4c66"
                    :label="answer.title"
                  ></v-radio>
                </v-radio-group>
                <v-textarea
                  v-if="item.custom && checkUserComment(item)"
                  v-model="item.answer.user_comment"
                  pa-5
                  background-color="white"
                  :rules="[rules.required]"
                  label="Свой вариант ответа"
                  rows="3"
                ></v-textarea>
                <v-textarea
                  v-else-if="item.custom && !checkUserComment(item)"
                  v-model="item.answer.user_comment"
                  pa-5
                  background-color="white"
                  label="Свой вариант ответа"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn v-if="step > 1" @click="prevStep">Назад</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="(questions.length - 1) === index"
                color="primary"
                @click="submit"
                :disabled="!questionValidate(item) && !checkAllValidate"
              >Отправить
              </v-btn>
              <v-btn
                v-else
                color="primary"
                @click="nextStep"
                :disabled="!questionValidate(item)"
              >Продолжить
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-stepper-content>
      </template>
    </v-stepper>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="btn-blue" @click="submitLater">Пройти позже</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./Surveys.js"></script>
<style src="./Surveys.scss" lang="scss" scoped></style>
