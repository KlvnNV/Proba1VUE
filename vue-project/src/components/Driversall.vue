<template>
  <v-card>
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
            hide-details
            placeholder="Search name driver"
            prepend-inner-icon="mdi-magnify"
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
              cols="auto"
              md="4"
            >
              <v-card border class="pb-3" flat>
                <v-img
                  v-if="item.raw.driverId === 'hamilton'"
                  height="100"
                  src="https://c.f1news.ru/userfiles/ham-photo.jpg"
                />
                <v-img
                  v-else
                  height="100"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-m4D7gaOaHMGxxheIp_xF_OSzrba6G7MIA&s"
                />

                <v-list-item class="mb-2" :subtitle="item.raw.surname">
                  <template #title>
                    <strong class="text-h6 mb-2">{{ item.raw.name }}</strong>
                  </template>
                </v-list-item>

                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-clock" start />

                    <div class="text-truncate">{{ item.raw.teamId }}</div>
                  </div>

                  <v-btn
                    border
                    class="text-none"
                    size="small"
                    text="Далее"
                    variant="flat"
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
            Page {{ page }} of {{ pageCount }}
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
          const response = await axios.get(`https://f1api.dev/api/${year}/drivers`);
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
    },

    // mounted () {
    //   axios.get('https://f1api.dev/api/2025/drivers')
    //     .then(response => {
    //       this.posts = response.data.drivers
    //     })
    // },
  }
</script>
