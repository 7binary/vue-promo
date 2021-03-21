<template>
  <v-row class="actions">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Акции</h3>
        </v-card-title>
        <v-card-text v-if="!loading && !actions.length" class="py-3">
          На данный момент акций не найдено.
        </v-card-text>
        <v-card-text v-if="loading" class="py-3">
          Загрузка списка акций...
        </v-card-text>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      v-if="actions.length"
      class="actions__item mb-4"
      v-for="action in actions"
      :key="action.id"
    >
      <v-card class="card">
        <v-card-title class="primary white--text">
          {{ action.title }}
        </v-card-title>
        <v-card-text class="py-3">
          {{ action.short_description }}
        </v-card-text>
        <v-card-actions class="px-3 actions__btn-bottom">
          <v-row>

            <v-col cols="12" sm="12" md="5" class="first-btn">
              <v-btn @click="ShowDesc(action.id)">
                <span>Описание</span>
                <v-icon class="ml-1" medium v-if="showDescID && (showDescID === action.id)">mdi-menu-up</v-icon>
                <v-icon class="ml-1" medium v-else>mdi-menu-down</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12" sm="12" md="7" class="text-md-right">
              <v-btn
                v-if="action.is_confirmed && !action.sale_ids.length"
                @click="AddSale(action.id)"
                class="actions__btn"
              >
                <span v-if="user.role === 'rtt'">Внести продажу</span>
                <span v-else>Внести закупку</span>
                <v-icon class="ml-1" small>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn
                v-else-if="action.is_confirmed && action.sale_ids.length"
                @click="EditSale(+action.sale_ids[0])"
                class="actions__btn"
              >
                <span v-if="user.role === 'rtt'">
                  Редактировать продажу
                </span>
                <span v-else>Редактировать закупку</span>
                <v-icon class="ml-1" small>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn
                v-else
                @click="ConfirmAction(action.id)"
                class="actions__btn actions__btn--confirm"
              >
                <span>Принять участие</span>
                <v-icon class="ml-1" small>mdi-check-circle</v-icon>
              </v-btn>
            </v-col>

          </v-row>
        </v-card-actions>
        <v-card-text
          v-if="showDescID && (showDescID === action.id)"
          class="py-2 actions__description"
          v-html="action.description"
        ></v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./Actions.js"></script>
<style src="./Actions.scss" lang="scss"></style>
