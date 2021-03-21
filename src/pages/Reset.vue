<template>
  <v-container fluid fill-height>
    <v-layout row wrap max>

    </v-layout>
  </v-container>
</template>

<script>
  export default {
    mounted() {
      this.$store.dispatch('eps/ClearCart');
      this.$store.dispatch('UserLogout');
      localStorage.clear();
      this.$store.dispatch('GetSettings');
      this.$router.push('/');
    },
  };
</script>
