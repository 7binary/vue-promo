<template>
  <v-row>
    <v-col cols="12">
      <v-card class="bell">
        <v-card-title class="bell__title primary white--text">
          <h3 class="headline mb-0">Уведомления</h3>
        </v-card-title>

        <v-card-text class="bell__text pa-0" v-if="hasNotifications">
          <v-list class="bell__list py-0" three-line>
            <template v-for="item in notifications">
              <v-list-item
                class="bell__list-item"
                :class="`${item.readed ? 'readed' : ''}`"
              >
                <v-list-item-avatar class="bell__list-avatar">
                  <font-awesome-icon
                    :icon="item.fa"
                    :class="`${!item.readed ? 'red--text' : 'secondary--text'}`"
                  />
                </v-list-item-avatar>

                <v-list-item-content class="bell__list-content">
                  <v-list-item-title
                    v-html="item.title"
                    class="bell__list-title"
                  ></v-list-item-title>
                  <v-list-item-subtitle v-html="item.body"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="bell__list-action">
                  <v-list-item-action-text class="bell__list-date">
                    {{ item.created_at }}
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          Уведомления отсутствуют
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./MobileNotifications.js"></script>
<style src="./MobileNotifications.scss" lang="scss" scoped></style>
