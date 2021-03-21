<template>
  <v-row v-if="user" class="purse">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary">
          <h3 class="headline white--text">Количество&nbsp;баллов:&nbsp;{{user.balance}}</h3>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-data-table
            :headers="headers"
            :items="transactions"
            :loading="loading"
            no-data-text="Список движения баллов пуст"
            no-results-text="Данных подходящих под фильтр не найдено"
            :items-per-page="50"
            :footer-props="{
              ['items-per-page-options']: [50, 100, 250, -1],
              ['items-per-page-all-text']: 'Все транзакции',
              ['items-per-page-text']: 'Кол-во на странице',
              ['page-text']: `Всего: ${transactions.length} транз.`,
            }"
            class="elevation-1"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                >
                  <td>
                    <v-chip label small :color="getTypeLabel(item.type).color" text-color="white">
                      {{getTypeLabel(item.type).label}}
                    </v-chip>
                  </td>
                  <td class="text-right">{{ item.created_at }}</td>
                  <td class="text-right" :class="`${getTypeLabel(item.type).color}--text`">
                    <b>{{ item.amount }}</b>
                  </td>
                  <td class="text-right">{{ item.title }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./ProfilePurse.js"></script>
<style src="./ProfilePurse.scss" lang="scss" scoped></style>
