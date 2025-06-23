<template>
  <v-app>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </v-app>
</template>

<script>
  import DefaultLayout from '@/layouts/DefaultLayout.vue'

  export default {
    name: 'App',
    components: { DefaultLayout },
  }
</script>
