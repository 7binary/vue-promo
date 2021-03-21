<template>
  <v-row class="sale">
    <v-col cols="12">
      <v-card v-if="action" class="card">
        <v-card-title class="primary">
          <h3 v-if="saleID === 'null'" class="headline mb-0 white--text">
            Регистрация новой {{ user.role === 'rtt' ? 'продажи: ' : 'закупки: ' }} &laquo;{{ action.title }}&raquo;
          </h3>
          <h3 v-else class="headline mb-0 white--text">
            Редактировать {{ user.role === 'rtt' ? 'продажу: ' : 'закупку: ' }} &laquo;{{ sale.action.title }}&raquo;
          </h3>
        </v-card-title>

        <v-card-text v-if="products.length" class="py-3">

          <div v-if="productsSelected.length" class="h-table">
            <div class="h-table__thead sale__products-table">
              <div class="h-table__tr sale__products-header">
                <div class="h-table__th  sale__products-img-th"></div>
                <div class="h-table__th">Название</div>
                <div class="h-table__th">Кол-во</div>
                <div v-if="action.show_price" class="h-table__th  sale__products-sum-th">Стоимость</div>
                <div class="h-table__th"></div>
              </div>
            </div>
            <div class="h-table__tbody sale__products-body">
              <div
                class="h-table__tr sale__products-row"
                v-for="item in productsSelected"
                :key="item.id"
              >
                <div class="h-table__td sale__products-img-cell">
                  <img
                    v-if="item.photoUrl"
                    :src="item.photoUrl"
                    width="75"
                  >
                  <div v-else class="no-photo">
                    Фото
                  </div>
                </div>
                <div class="h-table__td sale__products-name-cell">
                  {{ item.name }}
                </div>
                <div
                  class="h-table__td sale__products-qty-cell"
                  :class="{withSum: action.show_price}"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.number="item.quantity"
                        label="Количество"
                        type="number"
                        min="1"
                        max="10000"
                        @change="CalculateSum"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="action.show_price" class="h-table__td sale__products-sum-cell px-2">
                  <v-row>
                    <v-col cols="12" class="pr-3">
                      <v-text-field
                        :value="`${item.price * item.quantity} р.`"
                        label="Сумма"
                        type="text"
                        disabled=""
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div class="h-table__td sale__products-del-cell">
                  <v-icon
                    color="#ed1b24"
                    class="size-30"
                    @click="DeleteProduct(item.listID)"
                  >mdi-delete</v-icon>
                </div>
              </div>
            </div>
          </div>

          <v-form @submit.prevent="FeedbackSubmit" autocomplete="off" ref="feedbackForm" validation v-model="valid">
            <v-row>
              <v-col cols="12" sm="9" class="mt-2">
                <v-select
                  :items="productsList"
                  v-model="product"
                  :menu-props="{ maxHeight: '400' }"
                  label="Выберите продукт"
                  persistent-hint
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3" class="mt-2 pr-3 d-flex justify-center align-center">
                <v-btn
                  @click="AddProduct()"
                  :disabled="!product.length"
                  class="mb-3"
                >Добавить</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="mt-2">
                <v-text-field
                  type="text"
                  label="Комментарий"
                  id="number"
                  v-model="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-3">
                <div v-if="documents.length < 15">
                  <v-text-field label="Фото или PDF копия чека" @click='PickDocument' v-model='document.name'
                                prepend-icon='mdi-attachment' readonly></v-text-field>
                  <input type="file" style="display: none" ref="document" accept="image/*, application/pdf"
                         @change="OnDocument">
                </div>
              </v-col>
              <v-col cols="12" md="6" v-if="bonuses.plan" class="py-3">
                План/факт: <b>{{bonuses.plan}}/{{bonuses.fact}} {{bonuses.unit}}</b>
              </v-col>
              <v-col cols="12" class="py-3" :md="bonuses.plan ? 6 : 12">
                Бонусы по акции: <b>{{bonuses.total}}</b>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions class="pa-0 mb-4">
            <v-row class="addsales-btn">
              <v-col cols="12" sm="6" class="text-xs-center text-sm-left pb-2">
                <v-btn v-if="saleID !== 'null'" @click="showHistory = !showHistory">
                  <span>История</span>
                  <v-icon v-if="saleID !== 'null' && showHistory">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="text-xs-center text-sm-right pb-2">
                <v-btn @click="onSubmit()" :disabled="loading || !validation">
                    <span>
                        Сохранить
                    </span>
                  <font-awesome-icon icon="paper-plane" class="size-16 ml-1"/>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-row v-if="saleID !== 'null' && showHistory">
            <v-col cols="12" class="mt-2">
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
            </v-col>
          </v-row>

          <v-row v-if="documents.length">
            <v-col
              cols="12"
              sm="4"
              md="3"
              v-for="(item, index) in documents"
              :key="index"
              class="filePreview"
            >
              <v-icon
                class="close"
                dense
                color="red"
                @click="deleteFile(item, index)"
              >mdi-close-box-outline</v-icon>
              <span v-if="CheckPDF(item)">
                <i class="fal fa-file-pdf big-pdf"></i>
              </span>
              <div v-else class="imageUpload">
                <img v-if="GetFilePath(item)" :src="GetFilePath(item)"/>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script src="./AddSale.js"></script>
<style src="./AddSale.scss" lang="scss"></style>
