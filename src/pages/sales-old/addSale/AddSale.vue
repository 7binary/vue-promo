<template>
  <v-row class="sale">
    <!-- TODO доделать страницу как починят бэкенд -->
    <v-col cols="12" md="10" offset-md="1">
      <v-card class="card">
        <v-card-title class="primary">
          <h3 v-if="saleID === 'null'" class="headline white--text">Регистрация новой продажи</h3>
          <h3 v-else class="headline white--text">Редактировть продажу</h3>
        </v-card-title>
        <v-card-text v-if="products.length" class="py-3">
          <v-data-table
            v-if="productsSelected.length"
            :headers="tables.headers"
            :items="productsSelected"
            hide-actions
            class="elevation-0 table-sales"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left image-td"><img :src="props.item.photoUrl" width="75"></td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-right slide-td">
                <v-layout>
                  <v-flex class="pr-3">
                    <v-slider
                      v-model="props.item.quantity"
                      @change="CalculateSum()"
                      color="#da1018"
                      min="1"
                      max="100"
                      thumb-label=""
                      :thumb-size="24"
                    ></v-slider>
                  </v-flex>
                  <v-flex shrink style="width: 42px">
                    <v-text-field
                      v-model="props.item.quantity"
                      class="mt-0 select-number"
                      hide-details
                      single-line
                      type="number"
                      min="1"
                      max="100"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </td>
              <td class="text-xs-right delete-td">
                <v-icon color="#ed1b24"  class="size-30" @click="DeleteProduct(props.item.listID)">delete_forever</v-icon>
              </td>
            </template>
          </v-data-table>

          <v-form @submit.prevent="FeedbackSubmit" autocomplete="off" ref="feedbackForm" validation v-model="valid">
            <v-layout row wrap col-2 >
              <v-flex xs12 class="mt-2">
                <v-layout row max v-if="documents.length" class="mb-3 wrap">
                  <div v-for="(item, index) in documents" :key="index" class="filePreview flex">
                    <v-icon class="close bg-color-white rounded-50" @click="deleteFile(item, index)">
                      close
                    </v-icon>
                    <span v-if="CheckPDF(item)">
                        <i class="fal fa-file-pdf big-pdf"></i>
                      </span>
                    <div v-else class="imageUpload">
                      <img v-if="GetFilePath(item)" :src="GetFilePath(item)"/>
                    </div>
                  </div>
                </v-layout>
                <div v-if="documents.length < 5">
                  <v-text-field label="Фото или PDF копия чека" @click='PickDocument' v-model='document.name'
                                prepend-icon='attach_file' readonly></v-text-field>
                  <input type="file" style="display: none" ref="document" accept="image/*, application/pdf"
                         @change="OnDocument">
                </div>
              </v-flex>
            </v-layout>
            <v-layout row wrap col-2>
              <v-flex xs12 sm8 class="mt-2">
                <v-select
                  :items="productsList"
                  v-model="product"
                  :menu-props="{ maxHeight: '400' }"
                  label="Выберите продукт"
                  persistent-hint
                ></v-select>
              </v-flex>
              <v-flex xs12 sm4 class="mt-2">
                <v-btn @click="AddProduct()" :disabled="!product.length">Добавить</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap col-2>
              <v-flex xs12 sm4 class="mt-2">
                <v-text-field
                  v-model="soldOn"
                  label="Дата Продажи"
                  hint="дд.мм.гггг"
                  v-mask="'##.##.####'"
                  placeholder="01.01.2018"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 class="mt-2 pr-2">
                <v-text-field
                  type="text"
                  label="Номер"
                  id="number"
                  v-model="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 class="mt-2">
                <v-text-field
                  type="text"
                  label="Стоимость в баллах"
                  disabled
                  id="sum"
                  v-model="sum"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
          <v-card-actions class="pa-0 mb-4">
            <v-layout row wrap class="addsales-btn">
              <v-flex>
                <v-btn v-if="saleID !== 'null'" @click="showHistory = !showHistory">
                  <span>История</span>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
              </v-flex>
              <v-flex class="text-xs-right">
                <v-btn @click="onSubmit()" :disabled="!validation">
                  <span>Отправить на проверку</span>
                  <font-awesome-icon icon="paper-plane" class="size-16 ml-1"/>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-flex v-if="saleID !== 'null' && showHistory" xs12 class="mt-2">
            <transition-group>
              <v-card-text v-for="item in sale.history" :key="item.id" v-show="showHistory" class="pa-0 mb-3">
                <div class="sale-footer-wrap">
                  <div class="sale-time mr-3">
                    <i class="material-icons">query_builder</i>
                    <span>{{item.created_at}}</span>
                  </div>
                  <div class="sale-note mr-3">
                    <i class="material-icons">autorenew</i>
                    <span>{{item.note}}</span>
                  </div>
                  <div class="sale-comment" v-if="item.comment">
                    <i class="material-icons">chat_bubble_outline</i>
                    <span>{{item.comment}}</span>
                  </div>
                </div>
              </v-card-text>
            </transition-group>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./AddSale.js"></script>
<style src="./AddSale.scss" lang="scss" scoped></style>
