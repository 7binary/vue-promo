<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary mb-3">
          <h3 class="headline" v-if="course.title">{{course.title}}</h3>
        </v-card-title>
      </v-card>
    </v-col>

    <v-col cols="12" md="8" offset-md="2">
      <v-card v-if="showTest()" class="test">
        <v-stepper v-model="step" vertical>
          <template v-for="(item, index) in questions">
            <v-stepper-step :complete="step > (index + 1)" :step="index + 1">
              <div class="test-title text-purple" v-html="item.title"></div>
              <small v-if="!item.isSingleAnswer">Можно указать несколько ответов</small>
              <small v-else>Можно выбрать только один ответ</small>
            </v-stepper-step>
            <v-stepper-content :step="index + 1">
              <v-card color="grey lighten-4 elevation-0" class="mb-3">
                <v-row class="test-body">
                  <v-col cols="12">
                    <div v-if="!item.isSingleAnswer && item.answers.length">
                      <v-checkbox
                        v-for="(answer, index) in item.answers"
                        v-model="item.answer.checked"
                        :label="answer.title"
                        :value="answer.id"
                        :key="index"
                        color="#231446"
                        hide-details
                      ></v-checkbox>
                    </div>
                    <v-radio-group
                      v-else-if="item.isSingleAnswer && item.answers.length"
                      v-model="item.answer.checked"
                    >
                      <v-radio
                        v-for="(answer, index) in item.answers"
                        :label="answer.title"
                        :value="answer.id"
                        :key="index"
                        color="#333"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn :disabled="!questionValidate(item)" @click="nextStep(item.id, item.answer.checked)">
                <span>{{((questions.length - 1) === index) && 'Отправить' || 'Дальше'}}</span>
                <font-awesome-icon
                  :icon="`${((questions.length - 1) === index) && 'paper-plane' || 'angle-double-down'}`"
                  class="size-18 ml-2"
                />
              </v-btn>
            </v-stepper-content>
          </template>
        </v-stepper>
        <v-card-actions class="test-footer secondary align-start px-3">
          <v-btn :to="`/courses/${course.id}`">
            <font-awesome-icon icon="arrow-left" class="mr-2"/>
            <span>Назад</span>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="primary">
          <h3 id="video" class="headline mb-0">{{course.title}}</h3>
        </v-card-title>
        <v-card-text class="pt-5 pb-5">
          Вы исчерпали лимит прохождений теста.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :to="`/courses/${test.id}`">Назад</v-btn>
          <v-btn class="primary" :to="`/results/${test.id}`">Результаты</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Test.js"></script>
<style src="./Test.scss" lang="scss" scoped></style>
