<template>
  <div class="push-notification-prompt push-notification-popover">
    <div class="push-notification-prompt-message">
      <div class="push-notification-prompt-message-text">
        <font-awesome-icon icon="bell" class="push-notification-bell-icon size-14"/>
        <div class="push-prompt-text">
          Кликните «Разрешить», чтобы получать уведомления о своих заказах и видеть свежие новости в программе «ПРОМОКАРТС»
        </div>
      </div>
      <div class="push-notification-prompt-buttons">
        <button
          class="push-notification-prompt-btn push-notification-disallow-btn"
          type="button"
          @click="WebpushDecline()"
        >Запретить
        </button>
        <button
          class="push-notification-prompt-btn push-notification-accept-btn"
          type="button"
          @click="WebpushRequestPermission()"
        >Разрешить
        </button>
      </div>
      <span class="close-prompt" @click="WebpushClosePopup()"></span>
    </div>
  </div>
</template>

<script src="./Webpush.js"></script>
<style src="./Webpush.scss" lang="scss" scoped></style>
