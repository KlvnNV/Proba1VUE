<template>
  <Nav />
  <!-- <v-card>
    <v-layout>
      <v-app-bar
        absolute
        :elevation="24"
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

      <v-main>
        <v-sheet height="10" />
      </v-main>
    </v-layout>
  </v-card> -->

  <v-card>
    <v-container
      class="pl-0 pr-0 pb-0"
      fluid
    >
      <v-row class="justify-center align-center">
        <v-col cols="2">
          <v-select
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

  <v-card>
    <v-data-iterator
      :items="posts"
      :items-per-page="6"
      :search="search"
    >
      <template #header>
        <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
          <div class="text-truncate">
            Список гонщиков
          </div>

        </h1>

        <v-toolbar class="px-2">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details="auto"
            placeholder="Поиск по имени пилота"
            prepend-inner-icon="mdi-magnify"
            :rules="validationRules"
            style="max-width: 300px;"
            variant="solo"
          />
        </v-toolbar>
      </template>

      <template #default="{ items }">
        <v-container class="pa-2">
          <v-row dense>
            <v-col
              v-for="item in items"
              :key="item.driverId"
              cols="4"
              md="4"
              style="min-width: 200px"
            >
              <v-card
                border
                class="pb-3"
                color="grey-darken-3"
                flat
              >
                <v-img height="100" :src="getDriverImage(item)" />

                <v-list-item class="mb-2" :subtitle="item.raw.surname">
                  <template #title>
                    <strong class="text-h6 mb-2">{{ item.raw.name }}</strong>
                  </template>
                </v-list-item>

                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-car-sports" start />

                    <div class="text-truncate">Номер: {{ item.raw.number }}</div>
                  </div>

                  <v-btn
                    border
                    class="text-none"
                    size="small"
                    text="Подробнее"
                    variant="flat"
                    @click="goToDriver(item.raw.driverId, item.raw.surname, valueYear)"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template #footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            density="comfortable"
            :disabled="page === 1"
            icon="mdi-arrow-left"
            rounded
            variant="tonal"
            @click="prevPage"
          />

          <div class="mx-2 text-caption">
            Страница {{ page }} из {{ pageCount }}
          </div>

          <v-btn
            density="comfortable"
            :disabled="page >= pageCount"
            icon="mdi-arrow-right"
            rounded
            variant="tonal"
            @click="nextPage"
          />
        </div>
      </template>
    </v-data-iterator>
  </v-card>
</template>
<script>
  import axios from 'axios';
  import { ref, shallowRef } from 'vue';
  export default {
    setup () {
      const search = shallowRef('');
      const valueYear = ref('2025');
      const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
      const tabs = shallowRef(null);
      return {
        search, valueYear, years, tabs,
      };
    },
    data () {
      return {
        posts: [], errorMessage: '',
        validationRules: [
          v => /^[a-zA-Z\s]*$/.test(v) || ('Используйте английские буквы.'),
        ],

      }
    },
    watch: {
      async valueYear (newValue) {
        await this.fetchData(newValue);
      },
    },
    mounted () {
      this.fetchData(this.valueYear);

    },
    methods: {
      async fetchData (year) {
        try {
          const response = await axios.get(`/api/${year}/drivers`);
          this.posts = response.data.drivers || [];
          this.errorMessage = '';
        }
        catch(error) {
          if (error.response) { // Сервер вернул ошибку с статусом
            this.errorMessage = `${error.response.status}: ${error.response.data.message}`; }
          else if (error.request) { // Ошибка на уровне сетевого соединения
            this.errorMessage = 'Ошибка подключения к серверу.'; }
          else { // Другая ошибка
            this.errorMessage = 'Что-то пошло не так.';
          }
        }
      },
      goToDriver (driverId, gname, gyear) {
        this.$router.push({ path: '/driverResult/', query: { id: driverId, name: gname, year: gyear } });
      },
      getDriverImage (item) {
        switch (item.raw.driverId) {
          case 'hamilton':
            return '/src/assets/pilots/hamilton.jpg';
          case 'albon':
            return '/src/assets/pilots/albon.jpg';
          case 'alonso':
            return '/src/assets/pilots/alonso.jpg';
          case 'antonelli':
            return '/src/assets/pilots/antonelli.jpg';
          case 'bearman':
            return '/src/assets/pilots/berman.jpg';
          case 'bortoleto':
            return '/src/assets/pilots/bortoleto.jpg';
          case 'colapinto':
            return '/src/assets/pilots/colapinto.jpg';
          case 'doohan':
            return '/src/assets/pilots/doohan.jpg';
          case 'leclerc':
            return '/src/assets/pilots/leclerc.jpg';
          case 'gasly':
            return '/src/assets/pilots/gasly.jpg';
          case 'hadjar':
            return '/src/assets/pilots/hadjar.jpg';
          case 'hulkenberg':
            return '/src/assets/pilots/hulk.jpg';
          case 'lawson':
            return '/src/assets/pilots/lawson.jpg';
          case 'norris':
            return '/src/assets/pilots/norris.jpg';
          case 'ocon':
            return '/src/assets/pilots/ocon.jpg';
          case 'piastri':
            return '/src/assets/pilots/piastri.jpg';
          case 'russell':
            return '/src/assets/pilots/russell.jpg';
          case 'sainz':
            return '/src/assets/pilots/sainz.jpg';
          case 'stroll':
            return '/src/assets/pilots/stroll.jpg';
          case 'tsunoda':
            return '/src/assets/pilots/tsunoda.jpg';
          case 'max_verstappen':
            return '/src/assets/pilots/verstappen.jpg';
          default:
            return '/src/assets/pilots/defaultpilot.png'
        }
      },
    },

  }
</script>
