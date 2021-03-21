<template>
  <v-row class="course">
    <v-col cols="12">
      <v-card>
        <v-card-title class="primary mb-3 white--text">
          <h3 class="headline" v-if="course.title">{{course.title}}</h3>
          <h3 class="headline" v-else>Обучение</h3>
        </v-card-title>
      </v-card>
    </v-col>

    <v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2">
      <v-card>
        <v-card-text class="pa-0">
          <div v-html="course.video_1_frame" class="video pa-0"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pb-2 mt-2">
          <v-btn v-if="course.file_url" @click="showPDF(course.file_url)">
            <font-awesome-icon icon="file-pdf" class="size-18 mr-2"/>
            <span>Файл 1</span>
          </v-btn>
          <v-btn v-if="course.document_url" :href="course.document_url">
            <v-icon>insert_drive_file</v-icon>
            Файл 2
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="startTest">
            <span>Пройти тест</span>
            <font-awesome-icon icon="clipboard-check" class="size-18 ml-2"/>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="dialog.active" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog.active = false">
              <v-icon color="white">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <div v-html="dialog.content"></div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>

</template>

<script src="./Course.js"></script>
<style src="./Course.scss" lang="scss" scoped></style>
