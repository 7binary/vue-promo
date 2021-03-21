<template>
  <v-app
    :class="`app ${layout}`"
    :style="`background-image: url('${bgUrl}')`"
  >
    <!-- Left menu -->
    <Drawer :menuItems="leftMenuItems"/>
    <!-- /Left menu -->

    <!-- Header -->
    <Header :menuItems="topMenuItems"/>
    <!-- /Header -->

    <!-- Loader -->
    <v-progress-linear
      v-show="loading"
      :indeterminate="true"
      class="page-loader"
      color="primary"
    ></v-progress-linear>
    <!-- /Loader -->

    <!-- Main -->
    <v-main class="main">
      <v-container class="main__container py-0">
        <v-row class="main__row" no-gutters>
          <v-col class="main__col">
            <transition name="fade" mode="out-in">
              <router-view class="view"></router-view>
            </transition>

            <notifications
              group="error"
              position="bottom center"
              width="500px"
              animation-type="velocity"
              class="notifications notifications--error"
            />
            <notifications
              group="info"
              position="bottom center"
              width="500px"
              animation-type="velocity"
              class="notifications notifications--info"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- /Main -->

    <!-- Webpush -->
    <Webpush v-show="showWebpushPopup"/>
    <!-- /Webpush -->

    <!-- Footer -->
    <Footer/>
    <!-- /Footer -->
  </v-app>
</template>

<script src="./App.js"></script>
<style src="./App.scss" lang="scss"></style>
