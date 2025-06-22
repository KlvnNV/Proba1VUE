<template>
  <v-container class="pa-0" fluid>
    <v-app-bar
      app
      class="pa-0"
      elevation="12"
      fixed
      flat
      rounded
    >
      <v-tabs
        v-model="tabs"
        align-tabs="title"
        slider-color="green"
      >
        <v-tab to="/">
          <img alt="Логотип моего приложения" height="50" src="@/assets/logo.png">
        </v-tab>

        <v-tab text="Чемпионат" to="/tables" value="one" />

        <v-tab text="Команды" to="/cardteam" value="two" />

        <v-tab text="Гонщики" to="/driversall" value="three" />
      </v-tabs>
    </v-app-bar>

    <!-- <v-main>
        <v-sheet height="10" />
      </v-main> -->
  </v-container>

</template>
<script>
  import { shallowRef } from 'vue';
  export default {
    setup () {
      const tabs = shallowRef('')
      return {
        tabs,
      };
    },
  }
</script>
