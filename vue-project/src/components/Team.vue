<template>
  <!-- <Nav /> -->

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

  <v-data-iterator
    :items="posts"
  >
    <template #header>

      <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
        <div class="text-truncate">
          {{ `Состав команды ${teamName}` }}
        </div>

      </h1>
    </template>

    <template #default="{ items }">
      <v-row class="d-flex justify-center align-center">
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
          md="4"
          sm="6"
          xl="4"
        >
          <v-sheet border class="rounded-lg">
            <v-img height="100" :src="getDriverImage(item)" />
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
                  <th>Номер пилота:</th>
                  <td>{{ item.raw.driver.number }}</td>
                </tr>
                <tr align="right" style="cursor: pointer; background-color: rgb(60, 60, 60)" @click="goToTable(valueYear)">
                  <th>Позиция:</th>
                  <td>{{ item.raw.driver.position }}</td>
                </tr>
                <tr align="right">
                  <th>Победы:</th>
                  <td>{{ item.raw.driver.wins }}</td>
                </tr>
                <tr align="right" style="cursor: pointer; background-color: rgb(60, 60, 60)" @click="goToDriver(item.raw.driver.driverId, item.raw.driver.surname, valueYear)">
                  <th>Очки:</th>
                  <td>{{ item.raw.driver.points }}</td>
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
  import { useRoute } from 'vue-router';

  export default {
    setup () {
      const route = useRoute();
      // const teamId = route.query.id;
      // const teamName = route.query.name;
      const teamYear = route.query.year;

      const valueYear = ref(teamYear);
      const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
      const tabs = shallowRef(null)
      return {
        valueYear, years, tabs, //teamId, teamName, teamYear,
      };
    },
    data () {
      return {
        posts: [], errorMessage: '',
        teamId: '', teamName: '', teamYear: '',
      }
    },

    watch: {
      async valueYear (newValue) {
        await this.fetchData(newValue);
      },
    },
    mounted () {
      const route = useRoute();
      this.teamId = route.query.id;
      this.teamName = route.query.name;
      // this.teamYear = route.query.year;

      this.fetchData(this.valueYear);
    },

    methods: {
      async fetchData (year) {
        try {
          const response = await axios.get(`/api/${year}/teams/${this.teamId}/drivers`);
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

      goToTable (tabyear) {
        this.$router.push({ path: '/tables/', query: { year: tabyear } });
      },

      getDriverImage (item) {
        switch (item.raw.driver.driverId) {
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
  };

</script>
