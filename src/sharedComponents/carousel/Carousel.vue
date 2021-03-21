<template>
  <v-carousel
    class="carousel"
    interval="4000"
    height="360"
    cycle
    light
  >
    <v-carousel-item
      v-for="item in $props.items"
      :key="item.id"
      :src="item.banner_url"
      reverse-transition="fade-transition"
      transition="fade-transition"
      class="carousel__item"
    >
      <div v-if="item.link" class="carousel__content">
        <v-btn
          class="carousel__content-btn"
          v-if="IsRemoteUrl(item.link)"
          :href="item.link"
        >Подробнее</v-btn>
        <v-btn
          class="carousel__content-btn"
          v-else
          :to="item.link"
        >Подробнее</v-btn>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
  export default {
    props: ['items'],
    methods: {
      IsRemoteUrl(url) {
        return (url.indexOf('://') !== -1);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables';

  .carousel {
    background: $carousel-bg-color;

    &__content {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 60px;
    }
  }
</style>
