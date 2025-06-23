<template>
  <!-- <Nav /> -->
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
  <!-- class="background-image" в нижний-->
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
    <!-- </v-card>

    <v-card> -->
    <v-data-iterator
      :items="posts"
      :items-per-page="6"
      :search="search"
    >
      <template #header>
        <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
          <div class="text-truncate">
            Список команд
          </div>

        </h1>

        <v-toolbar border class="px-2">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details="auto"
            placeholder="Поиск по названию команды"
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
              :key="item.teamId"
              cols="4"
              md="4"
              style="min-width: 260px"
            >
              <v-card
                border
                class="pb-3"
                color="grey-darken-3"
                flat
              >
                <v-img height="100" :src="getTeamImage(item)" />

                <v-list-item class="mb-2" :subtitle="item.raw.firstAppeareance ? `В чемпионате с ${item.raw.firstAppeareance}` : 'Нет данныx'">
                  <template #title>
                    <strong class="text-h6 mb-2">{{ item.raw.teamName }}</strong>
                  </template>
                </v-list-item>

                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-google-maps" start />

                    <div class="text-truncate">{{ item.raw.teamNationality }}</div>
                  </div>

                  <v-btn
                    border
                    class="text-none"
                    size="small"
                    text="Состав команды"
                    variant="flat"
                    @click="goToTeam(item.raw.teamId, item.raw.teamName, valueYear)"
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
      const tabs = shallowRef(null)
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
    // watch: {
    //   async valueYear (newValue) {
    //     await this.fetchData(newValue);
    //   },
    // },
    watch: {
      valueYear: {
        async handler (newValue) {
          await this.fetchData(newValue);
        },
        immediate: true,
      },
    },
    // mounted () {
    //   this.fetchData(this.valueYear);
    // },
    methods: {
      async fetchData (year) {
        try {
          const response = await axios.get(`/api/${year}/teams`);
          this.posts = response.data.teams || [];
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
      goToTeam (teamId, tname, tyear) {
        this.$router.push({ path: '/team/', query: { id: teamId, name: tname, year: tyear } });
      },
      getTeamImage (item) {
        switch (item.raw.teamId) {
          case 'ferrari':
            return '/src/assets/teams/ferrari.jpg';
          case 'mercedes':
            return '/src/assets/teams/mersedes.jpg';
          case 'mclaren':
            return '/src/assets/teams/mclaren.jpg';
          case 'red_bull':
            return '/src/assets/teams/redbull.jpg';
          case 'rb':
            return '/src/assets/teams/rb.jpg';
          case 'haas':
            return '/src/assets/teams/haas.jpg';
          case 'sauber':
            return '/src/assets/teams/sauber.jpg';
          case 'aston_martin':
            return '/src/assets/teams/aston.jpg';
          case 'alpine':
            return '/src/assets/teams/alpine.jpg';
          case 'williams':
            return '/src/assets/teams/williams.jpg';

          default:
            return '/src/assets/teams/defteam.png'
        }
      },

    },
  }
</script>
<style scoped>
.background-image {
  width: 100%;
  height: 100vh; /* высота окна просмотра */
  background-image: url("/src/assets/race.jpg");
  background-size: cover;  /*масштабирует изображение до полного заполнения */
  background-position: center; /* центрует изображение */
  background-repeat: no-repeat;
}
</style>
