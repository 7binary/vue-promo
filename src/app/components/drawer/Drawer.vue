<template>
  <v-navigation-drawer
    :value="sidebar"
    @input="CloseDrawerOutline($event)"
    clipped
    class="drawer"
    temporary
    fixed
    width="300"
  >
    <v-list class="pa-0" dense>
      <!-- Drawer user info -->
      <v-list-item v-if="user" link class="drawer__header">
        <v-list-item-avatar @click="$router.push('/profile')">
          <v-img v-if="user.avatar_url" :src="user.avatar_url"></v-img>
          <div v-else class="user-initials">{{ userAvatar }}</div>
        </v-list-item-avatar>

        <v-list-item-content class="drawer__header-name">
          <v-list-item-title
            @click="$router.push('/profile')"
            class="drawer__user-name"
          >
            <span class="ava-name">{{user.last_name}}<br/>{{user.first_name}}</span>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
            @click="CloseDrawer"
            icon
            class="drawer__header-close"
            color="white"
          >
            <font-awesome-icon
              icon="times"
              class="drawer__header-icon"
            />
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <!-- /Drawer user info -->

      <v-divider></v-divider>

      <!-- Drawer menu -->
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        :class="`${item.optionalClass ? item.optionalClass : ''} drawer__link drawer__link--bordered`"
        link
      >
        <v-list-item-action>
          <font-awesome-icon :icon="item.icon" class="drawer__link-icon"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="drawer__link-text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Drawer menu -->

      <!-- Drawer cart -->
      <v-list-item
        v-if="showCart"
        to="/cart"
        class="drawer__link drawer__link--bordered"
        link
      >
        <v-list-item-action>
          <v-badge right>
            <span slot="badge">{{epsCartLength + productsCartLength}}</span>
            <font-awesome-icon icon="shopping-basket" class="drawer__link-icon"/>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="drawer__link-text">
            Корзина
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- /Drawer cart -->

      <!-- Drawer notification -->
      <v-list-item
        to="/notifications"
        class="drawer__link drawer__link--bordered"
        link
      >
        <v-list-item-action>
          <v-badge right v-if="showNotification">
            <span slot="badge">{{newMobileNotifications.length}}</span>
            <font-awesome-icon icon="bell" class="drawer__link-icon"/>
          </v-badge>
          <font-awesome-icon v-else icon="bell" class="drawer__link-icon"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="drawer__link-text">
            Уведомления
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- /Drawer notification -->

      <!-- Drawer exit -->
      <v-list-item
        v-if="isAuthenticated"
        @click="UserLogout"
        class="drawer__link"
        link
      >
        <v-list-item-action>
          <font-awesome-icon icon="sign-out-alt" class="drawer__link-icon"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="drawer__link-text">
            Выход
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- /Drawer exit -->

    </v-list>
  </v-navigation-drawer>
</template>

<script src="./Drawer.js"></script>
<style src="./Drawer.scss" lang="scss"></style>
