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
      <v-btn class="ml-auto" @click="toggleTheme"><v-icon icon="mdi-theme-light-dark" /></v-btn>
    </v-app-bar>
  </v-container>
</template>
<script>
  import { shallowRef } from 'vue';
  import { useTheme } from 'vuetify';
  export default {
    name: 'AppNav',
    setup () {
      const tabs = shallowRef('')
      const theme = useTheme()
      return {
        tabs, theme,
      };
    },
    methods: {
      toggleTheme () {
        this.theme.global.name.value = this.theme.global.current.value.dark ? 'light' : 'dark';
      },
    },
  }
</script>
<style scoped>

@media screen and (max-width: 768px) {
    .v-app-bar {
        width: 400px;
        padding: 0px;
    }
    .v-tab {
        font-size: 10px;
    }
}
</style>
