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
          <v-tab text="Чемпионат" value="one" />

          <v-tab text="Команда" value="two" />

          <v-tab text="Гонщик" value="three" />
        </v-tabs>
      </v-app-bar>

      <v-main>
        <v-sheet height="150" />
      </v-main>
    </v-layout>
  </v-card>

  <v-card>
    <v-container fluid>
      <v-row class="justify-center">
        <v-col cols="2">
          <v-combobox
            v-model="valueYear"
            density="comfortable"
            :items="years"
            label="ГОД"
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
        <v-toolbar class="px-2">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            placeholder="Search name team"
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
              :key="item.teamId"
              cols="auto"
              md="4"
            >
              <v-card border class="pb-3" flat>
                <v-img
                  v-if="item.raw.teamId === 'ferrari'"
                  height="100"
                  src="https://i.pinimg.com/736x/f5/7a/cd/f57acd525c15fa16d7b23d29637847f6.jpg"
                />
                <v-img
                  v-else
                  height="100"
                  src="https://cdn-icons-png.freepik.com/256/16000/16000950.png?semt=ais_hybrid"
                />

                <v-list-item class="mb-2" :subtitle="item.raw.teamId">
                  <template #title>
                    <strong class="text-h6 mb-2">{{ item.raw.teamName }}</strong>
                  </template>
                </v-list-item>

                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-clock" start />

                    <div class="text-truncate">{{ item.raw.teamNationality }}</div>
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
  import { shallowRef } from 'vue';
  export default {
    setup () {
      const search = shallowRef('');
      const valueYear = '2025';
      const years = ['2025', '2024', '2023', '2022'];
      const tabs = shallowRef(null)
      return {
        search, valueYear, years, tabs,
      };
    },
    data () {
      return {
        posts: [],
      }
    },
    mounted () {
      axios.get('https://f1api.dev/api/2025/teams')
        .then(response => {
          this.posts = response.data.teams
          // console.log(response.data.teams)
        })
    },
  }
  // const search = shallowRef('')
  // const games = [
  //   {
  //     img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png',
  //     title: 'The Sci-Fi Shooter Experience',
  //     subtitle: 'Dive into a futuristic world of intense battles and alien encounters.',
  //     advanced: false,
  //     duration: '8 minutes',
  //   },
  // ]
</script>
