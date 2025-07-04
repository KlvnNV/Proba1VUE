<template>
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
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        Личный зачет
      </div>
    </h1>
  </v-card>

  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    class="custom-class"
    :headers="headers"
    item-value="name"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <template #[`item.driver.name`]="{ item }">
      <span class="d-flex flex-row align-center">
        <v-btn class="px-0 py-0" color="rgb(50, 50, 50)" @click="goToDriver(item.driverId, item.driver.surname, valueYear)">
          <img height="30" :src="getDriverImage(item)">
        </v-btn>
        {{ item.driver.name }}
      </span>
    </template>

    <template #tfoot>
      <tr>
        <td />
        <td colspan="2">
          <v-text-field
            v-model="search"
            class="w-100 mx-auto"
            clearable
            density="compact"
            hide-details="auto"
            placeholder="Поиск по имени"
            :rules="validationRules"
          />
        </td>
      </tr>
    </template>
  </v-data-table-server>
  <Table2 :user="userP" />
  <Caldar :user="userP" />
</template>
<script setup>
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router';
  const route = useRoute();
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const posts = ref([])
  const errors = ref([])
  const tableYear = route.query.year;
  const valueYear = ref(tableYear ? tableYear : '2025')
  const years = ['2025', '2024', '2023', '2022', '2021', '2020']
  const validationRules= [v => /^[a-zA-Z\s]*$/.test(v) || ('Используйте английские буквы.')];

  const userP = {
    nameJJ: valueYear,
  }

  async function fetchData (year) {
    try {
      const response = await axios.get(`/api/${year}/drivers-championship`)
      posts.value = response.data.drivers_championship || []
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }

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
    { title: 'Имя', key: 'driver.name', sortable: false },
    { title: 'Фамилия', key: 'driver.surname', sortable: false },
    { title: 'Команда', key: 'team.teamName', sortable: false },
    { title: 'Очки', key: 'points', sortable: false },

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

  function goToDriver (driverId, gname, gyear) {
    router.push({ path: '/driverResult/', query: { id: driverId, name: gname, year: gyear } });
  }

  watch(valueYear, async newValue => {
    console.log('Год изменился:', newValue);
    await fetchData(newValue);
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: false });
  }, { immediate: true });

  watch(name, () => {
    search.value = String(Date.now())
  })

  function getDriverImage (item) {
    switch (item.driverId) {
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
  }

</script>
<style scoped>

.custom-class {
  font-size: 14px;
  font-weight: 300;
}
/* Aдаптация для мобильных устройств */
@media only screen and (min-width: 640px) {
.custom-class {
    font-size: 14px !important;
  }
}

/* Планшеты */
@media only screen and (min-width: 768px) {
.custom-class {
    font-size: 16px !important;
  }
}

@media only screen and (min-width: 1024px) {
.custom-class {
    font-size: 18px !important;
  }
}

/* Настольные компьютеры */
@media only screen and (min-width: 1366px) {
.custom-class {
    font-size: 20px !important;
  }
}

/* Широкий монитор (Full HD и больше) */
@media only screen and (min-width: 1920px) {
.custom-class {
    font-size: 22px !important;
  }
}
</style>
