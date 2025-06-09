<template>
  <v-card>
    <v-layout>
      <v-app-bar absolute :elevation="24" flat rounded>
        <v-tabs v-model="tabs" align-tabs="title" slider-color="green">
          <v-tab to="/">
            <img alt="Логотип моего приложения" height="50" src="@/assets/logo.png">
          </v-tab>

          <v-tab text="Чемпионат" to="/tables" value="one" />

          <v-tab text="Команда" to="/team" value="two" />

          <v-tab text="Гонщик" to="/driverResult" value="three" />
        </v-tabs>
      </v-app-bar>

      <v-main>
        <v-sheet height="40" />
      </v-main>
    </v-layout>
  </v-card>

  <v-card>
    <v-container fluid>
      <v-row class="justify-center ">
        <v-col cols="2">
          <v-combobox
            v-model="valueYear"
            density="comfortable"
            :items="years"
            label="ГОД"
            style="min-width: 120px"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
  import { ref, shallowRef } from 'vue';
  export default {
    name: 'MyNav',
    setup () {
      const valueYear = ref('2025');
      const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
      const tabs = shallowRef(null)
      return {
        valueYear, years, tabs,
      };
    },

    watch: {
      async valueYear (newValue) {
        await this.fetchData(newValue);
      },
    },
    mounted () {
      this.fetchData(this.valueYear);
    },
  }

</script>
