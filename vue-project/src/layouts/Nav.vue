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
        align-tabs="center"
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
.v-app-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 60px !important;
  padding-left: 10px;
  padding-right: 10px;
}

.v-tab {
  font-size: 14px !important;
  min-width: auto !important;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

.v-tabs-slider-wrapper {
  background-color: green !important;
}

/* Aдаптация для мобильных устройств (например, iPhone 5) */
@media only screen and (max-width: 640px) {
  .v-app-bar {
    width: 100%;
    overflow-x: hidden;
    max-height: 50px !important;
  }

  img {
    height: 30px !important;
  }

  .v-tab {
    font-size: 12px !important;
  }
}

/* Планшеты (iPad) */
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .v-app-bar {
    padding-left: 20px;
    padding-right: 20px;
  }

  .v-tab {
    font-size: 14px !important;
  }
}

/* Настольные компьютеры */
@media only screen and (min-width: 1366px) {
  .v-app-bar {
    padding-left: 30px;
    padding-right: 30px;
  }

  .v-tab {
    font-size: 16px !important;
  }
}

/* Широкий монитор (Full HD и больше) */
@media only screen and (min-width: 1920px) {
  .v-app-bar {
    padding-left: 40px;
    padding-right: 40px;
  }

  .v-tab {
    font-size: 18px !important;
  }
}
</style>
