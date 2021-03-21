<template>
  <div class="header">
    <v-toolbar
      :class="`${isAuthenticated ? '' : 'noauth'} tool-logo`"
      text-md-center
      dense
      class="header__menu"
      height="60px"
    >
      <!-- Menu hamburger icon-->
      <v-tooltip bottom color="#4DB6AC">
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon
            @click="SetSidebar(!sidebar)"
            class="rusich hidden-lg-and-up"
            v-on="on"
          >
            <font-awesome-icon icon="bars" class="header__icon"/>
          </v-app-bar-nav-icon>
        </template>
        <span>Меню</span>
      </v-tooltip>
      <!-- /Menu hamburger icon-->

      <!-- Logo -->
      <router-link
        :to="isAuthenticated ? '/dashboard' : '/'"
        tag="a"
        class="header__logo"
      >
        <img
          :src="logoUrl || '/static/logo.png'"
          class="header__logo-img header__logo-img--full d-none d-md-inline"
        />
        <img
          :src="logoUrl || '/static/logo_mini.png'"
          class="header__logo-img header__logo-img--mini d-md-none"
        />
      </router-link>
      <!-- /Logo -->

      <!-- Top menu -->
      <v-toolbar-items class="hidden-md-and-down menu px-5">
        <router-link
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :class="`${item.optionalClass ? item.optionalClass : ''} menu__link`"
        >
          <span
            v-if="item.showIcon"
            class="menu__link-icon"
          >
            <font-awesome-icon :icon="item.icon"/>
          </span>
          <span
            v-if="item.showTitle"
            class="menu__link-title"
          >{{ item.title }}</span>
        </router-link>
      </v-toolbar-items>
      <!-- /Top menu -->

      <v-spacer></v-spacer>

      <!-- User info -->
      <div v-if="isAuthenticated" class="header__user hidden-xs-only">
        <div class="header__user-icon-wrap">
          <div class="header__user-icon">

          </div>
        </div>
        <div class="header__user-name-wrap">
          <v-list class="pa-0" v-if="user">

            <v-list-item>
              <v-list-item-avatar>
                <v-img v-if="user.avatar_url" :src="user.avatar_url"></v-img>
                <div v-else class="user-initials">{{ userAvatar }}</div>
              </v-list-item-avatar>

              <v-list-item-content class="header__user-name">
                <v-list-item-title>
                  <span class="ava-name">{{user.last_name}}<br />{{user.first_name}}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div
          class="header__user-cart-wrap pl-3"
          v-if="isAuthenticated && (epsCartLength || productsCartLength)"
        >
          <v-tooltip bottom color="#4DB6AC">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                to="/cart"
                v-on="on"
                class="header__right-icons"
              >
                <v-badge right>
                  <span slot="badge">
                    {{epsCartLength + productsCartLength}}
                  </span>
                </v-badge>
                <font-awesome-icon icon="shopping-basket" class="header__icon"/>
              </v-btn>
            </template>
            <span v-if="epsCartLength">
              Сертификаты в корзине на сумму: {{epsCartSummary}}
            </span>
            <span v-if="productsCartLength">
              Товары в корзине на сумму: {{productsCartSummary}}
            </span>
          </v-tooltip>
        </div>
      </div>
      <!-- /User info -->

      <!-- Right icons block -->
      <!-- Feedback btn -->
      <v-tooltip bottom color="#4DB6AC">
        <template v-slot:activator="{ on }">
          <v-btn
            class="header__right-icons"
            :to="(isAuthenticated && !isBlocked) ? '/tickets' : '/feedback'"
            v-on="on"
            icon
          >
            <font-awesome-icon icon="question-circle" class="header__icon"/>
          </v-btn>
        </template>
        <span>Помощь</span>
      </v-tooltip>
      <!-- /Feedback btn -->

      <!-- Notify btn -->
      <v-tooltip v-if="isAuthenticated" bottom color="#4DB6AC">
        <template v-slot:activator="{ on }">
          <v-btn
            class="header__right-icons"
            to="/notifications"
            v-on="on"
            icon
          >
            <v-badge v-if="newMobileNotifications.length" right>
              <span slot="badge">
                {{newMobileNotifications.length}}
              </span>
            </v-badge>
            <font-awesome-icon icon="bell" class="header__icon"/>
          </v-btn>
        </template>
        <span>Уведомления</span>
      </v-tooltip>
      <!-- /Notify btn -->

      <!-- Login/Logout btn -->
      <v-tooltip v-if="isAuthenticated" bottom color="#4DB6AC">
        <template v-slot:activator="{ on }">
          <v-btn
            class="header__right-icons"
            @click="UserLogout"
            v-on="on"
            icon
          >
            <font-awesome-icon icon="sign-out-alt" class="header__icon"/>
          </v-btn>
        </template>
        <span>Вход</span>
      </v-tooltip>
      <v-tooltip v-else bottom color="#4DB6AC">
        <template v-slot:activator="{ on }">
          <v-btn
            class="header__right-icons"
            to="/login"
            v-on="on"
            icon
          >
            <font-awesome-icon icon="sign-in-alt" class="header__icon"/>
          </v-btn>
        </template>
        <span>Вход</span>
      </v-tooltip>
      <!-- /Login/Logout btn -->
      <!-- /Right icons block -->
    </v-toolbar>
  </div>
</template>

<script src="./Header.js"></script>
<style src="./Header.scss" lang="scss"></style>
