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
        <v-sheet height="10" />
      </v-main>
    </v-layout>
  </v-card>

  <v-card>
    <v-container fluid>
      <v-row class="justify-center">
        <v-col cols="2">
          <v-select
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
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        Личный зачет
      </div>
    </h1>
  </v-card>

  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    class="text-h8"
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
          width=""
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
  <Table2 :user="userP" />
</template>
<script setup>
  import { onMounted, ref, shallowRef, watch } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router';
  const route = useRoute();

  // Инициализация реактивных данных
  const posts = ref([])
  const errors = ref([])
  const tableYear = route.query.year;
  const valueYear = ref(tableYear ? tableYear : '2025')
  const years = ['2025', '2024', '2023', '2022', '2021', '2020']
  const tabs = shallowRef(null)

  const userP = {
    nameJJ: valueYear,
  }
  // const tabs = ref(null)

  async function fetchData (year) {
    try {
      const response = await axios.get(`https://f1api.dev/api/${year}/drivers-championship`)
      posts.value = response.data.drivers_championship || []
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }

  // function goToTab2 (tabyear) {
  //   console.log('Год изменился:', tabyear);
  //   route.push(`/table2/?id=${tabyear}`);
  //   route.push({ path: '/table2/', query: { year: tabyear } });
  // }

  // Метод fetchData для загрузки данных при монтировании компонента
  onMounted(() => {
    fetchData(valueYear.value)
  })

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

  watch(valueYear, async newValue => {
    console.log('Год изменился:', newValue);
    await fetchData(newValue);
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: false });
    // goToTab2(newValue);
  }, { immediate: true });

  watch(name, () => {
    search.value = String(Date.now())
  })
</script>
