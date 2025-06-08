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
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        Результаты гонщика
      </div>
    </h1>
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

  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    item-value="name"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <!-- <template #[`item.driver.surname`]="{ item }">
      <span>{{ item.driver.surname }}
        <img
          v-if="item.driver.surname === 'Hamilton'"
          alt="{{ item.driver.surname }}"
          height="20"
          src="https://c.f1news.ru/userfiles/ham-photo.jpg"
          width="20"
        >
      </span>
    </template> -->
    <template #tfoot>
      <tr>
        <td>
          <v-text-field
            v-model="search"
            class="mx-auto"
            clearable
            density="compact"
            hide-details
            placeholder="Search name..."
          />
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue'
  import axios from 'axios'

  // Инициализация реактивных данных
  const posts = ref([])
  const errors = ref([])
  const valueYear = ref('2025')
  const years = ['2025', '2024', '2023', '2022']


  const tabs = ref(null)

  async function fetchData () {
    try {
      const response = await axios.get('https://f1api.dev/api/2024/drivers/alonso')
      posts.value = response.data.results
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }
  // Метод fetchData для загрузки данных при монтировании компонента
  onMounted(() => {
    fetchData()
  })

  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = posts.value.slice().filter(item => {
            if (search.value && !item.race.name.toLowerCase().includes(search.value.toLowerCase())
              && !item.race.circuit.country.toLowerCase().includes(search.value.toLowerCase())) {
              return false
            }
            return true
          })
          // Если включена сортировка
          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order

            // Глубокая сортировка по вложенным ключам
            items.sort((a, b) => {
              let aValue = a
              let bValue = b

              for (const part of sortKey.split('.')) {
                aValue = aValue[part]
                bValue = bValue[part]
              }

              if (sortOrder === 'desc') {
                return bValue.localeCompare(aValue)
              } else {
                return aValue.localeCompare(bValue)
              }
            })
          }
          const paginated = items.slice(start, end === -1 ? undefined : end)
          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }
  const itemsPerPage = ref(10)
  const headers = ref([
    {
      title: 'Дата',
      align: 'start',
      sortable: false,
      key: 'race.date',
    },
    { title: 'Name race', key: 'race.name', sortable: false },
    { title: 'country', key: 'race.circuit.country', sortable: false },
    { title: 'finishingPosition', key: 'result.finishingPosition', sortable: false },
    { title: 'points', key: 'result.pointsObtained', sortable: false },

  ])
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  const name = ref('')
  const search = ref('')
  function loadItems ({ page, itemsPerPage, sortBy }) {
    loading.value = true
    FakeAPI.fetch({ page, itemsPerPage, sortBy, search: { value: search.value } }).then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
    })
  }
  watch(name, () => {
    search.value = String(Date.now())
  })
</script>
