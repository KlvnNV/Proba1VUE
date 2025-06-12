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
          <!-- <v-tab
            color="surface-variant"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            to="/"
          /> -->
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

  <v-data-iterator
    :items="posts"
  >
    <template #header>

      <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
        <div class="text-truncate">
          Состав команды
        </div>

      </h1>
    </template>

    <template #default="{ items }">
      <v-row>
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
          sm="6"
          xl="3"
        >
          <v-sheet border>
            <v-img height="100" :src="getDriverImage(item)" />
            <!-- <v-img
              v-if="item.raw.driver.driverId === 'hamilton'"
              height="100"
              src="https://c.f1news.ru/userfiles/ham-photo.jpg"
            />
            <v-img
              v-if="item.raw.driver.driverId === 'leclerc'"
              height="100"
              src="https://c.f1news.ru/userfiles/port-leclerc-2024.jpg"
            />

            <v-img
              v-else
              height="100"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-m4D7gaOaHMGxxheIp_xF_OSzrba6G7MIA&s"
            /> -->
            <!-- cover  <-from v-img -->
            <v-list-item
              density="comfortable"
              lines="two"
              :subtitle="item.raw.driver.surname"
              :title="item.raw.driver.name"
            >
              <template #title>
                <strong class="text-h6">
                  {{ item.raw.driver.name }}
                </strong>
              </template>
            </v-list-item>

            <v-table class="text-caption" density="compact">
              <tbody>
                <tr align="right">
                  <th>number:</th>

                  <td>{{ item.raw.driver.number }}</td>
                </tr>

                <tr align="right">
                  <th>points:</th>

                  <td>{{ item.raw.driver.points }}</td>
                </tr>

                <tr align="right">
                  <th>position:</th>

                  <td>{{ item.raw.driver.position }}</td>
                </tr>

                <tr align="right">
                  <th>wins:</th>

                  <td>{{ item.raw.driver.wins }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </v-col>
      </v-row>
    </template>

  </v-data-iterator>
</template>
<script>
  import axios from 'axios';
  import { ref, shallowRef } from 'vue';
  export default {
    setup () {
      const valueYear = ref('2025');
      const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
      const tabs = shallowRef(null)
      return {
        valueYear, years, tabs,
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
        try {const teamId = this.$route.query.id;
             const response = await axios.get(`https://f1api.dev/api/${year}/teams/${teamId}/drivers`);
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

      getDriverImage (item) {
        switch (item.raw.driver.driverId) {
          case 'hamilton':
            return 'https://c.f1news.ru/userfiles/ham-photo.jpg'
          case 'leclerc':
            return 'https://c.f1news.ru/userfiles/port-leclerc-2024.jpg'
          default:
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-m4D7gaOaHMGxxheIp_xF_OSzrba6G7MIA&s'
        }
      },
    },
  };

</script>
