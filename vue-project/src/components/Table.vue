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
        Личный зачет
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
    <template #[`item.driver.surname`]="{ item }">
      <span>{{ item.driver.surname }}
        <img
          v-if="item.driver.surname === 'Hamilton'"
          alt="{{ item.driver.surname }}"
          height="20"
          src="https://c.f1news.ru/userfiles/ham-photo.jpg"
          width="20"
        >
      </span>
    </template>
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
      const response = await axios.get('https://f1api.dev/api/2025/drivers-championship')
      posts.value = response.data.drivers_championship
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }
  // Метод fetchData для загрузки данных при монтировании компонента
  onMounted(() => {
    fetchData()
  })


  //   const desserts = [
  //     {
  //       name: 'Frozen Yogurt',
  //       calories: 159,
  //       fat: 6,
  //       carbs: 24,
  //       protein: 4,
  //       iron: '1',
  //     },
  //     {
  //       name: 'Jelly bean',
  //       calories: 375,
  //       fat: 0,
  //       carbs: 94,
  //       protein: 0,
  //       iron: '0',
  //     },
  //     {
  //       name: 'KitKat',
  //       calories: 518,
  //       fat: 26,
  //       carbs: 65,
  //       protein: 7,
  //       iron: '6',
  //     },
  //     {
  //       name: 'Eclair',
  //       calories: 262,
  //       fat: 16,
  //       carbs: 23,
  //       protein: 6,
  //       iron: '7',
  //     },
  //     {
  //       name: 'Gingerbread',
  //       calories: 356,
  //       fat: 16,
  //       carbs: 49,
  //       protein: 3.9,
  //       iron: '16',
  //     },
  //     {
  //       name: 'Ice cream sandwich',
  //       calories: 237,
  //       fat: 9,
  //       carbs: 37,
  //       protein: 4.3,
  //       iron: '1',
  //     },
  //     {
  //       name: 'Lollipop',
  //       calories: 392,
  //       fat: 0.2,
  //       carbs: 98,
  //       protein: 0,
  //       iron: '2',
  //     },
  //     {
  //       name: 'Cupcake',
  //       calories: 305,
  //       fat: 3.7,
  //       carbs: 67,
  //       protein: 4.3,
  //       iron: '8',
  //     },
  //     {
  //       name: 'Honeycomb',
  //       calories: 408,
  //       fat: 3.2,
  //       carbs: 87,
  //       protein: 6.5,
  //       iron: '45',
  //     },
  //     {
  //       name: 'Donut',
  //       calories: 452,
  //       fat: 25,
  //       carbs: 51,
  //       protein: 4.9,
  //       iron: '22',
  //     },
  //   ]
  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = posts.value.slice().filter(item => {
            if (search.value && !item.driver.surname.toLowerCase().includes(search.value.toLowerCase())
              && !item.driver.name.toLowerCase().includes(search.value.toLowerCase())) {
              return false
            }
            return true
          })
          //   if (sortBy.length) {
          //     const sortKey = sortBy[0].key
          //     const sortOrder = sortBy[0].order
          //     items.value.sort((a, b) => {
          //       const aValue = a[sortKey]
          //       const bValue = b[sortKey]
          //       return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          //     })
          //   }
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
  const itemsPerPage = ref(5)
  const headers = ref([
    {
      title: 'Позиция',
      align: 'start',
      sortable: false,
      key: 'position',
    },
    { title: 'First Name', key: 'driver.name', sortable: false },
    { title: 'Last Name', key: 'driver.surname' },
    { title: 'team', key: 'team.teamName' },
    { title: 'points', key: 'points' },


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
