<template>
  <Nav />
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

  <v-card>
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-2 align-center">
      <div class="text-truncate">
        {{ `Результаты гонщика ${driverName}` }}
      </div>
    </h1>
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
    <template #[`item.result.pointsObtained`]="{ item }">
      <v-btn class="d-flex justify-center" @click="goToTable(valueYear)">{{ item.result.pointsObtained }}
      </v-btn>
    </template>

    <template #[`item.race.date`]="{ item }">
      {{ new Date(item.race.date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric' }) }}
    </template>

    <template #tfoot>
      <tr>
        <td />
        <td>
          <v-text-field
            v-model="search"
            class="mx-auto"
            clearable
            density="compact"
            hide-details="auto"
            placeholder="Поиск по названию"
            :rules="validationRules"
            style="min-width: 150px;"
          />
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>
<script setup>
  import { /*onMounted,*/ ref, watch } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  // Инициализация реактивных данных
  const posts = ref([])
  const errorMessage = ref('');
  const driverId = route.query.id;
  const driverName = route.query.name;
  const driverYear = route.query.year;
  const valueYear = ref(driverYear)
  const years = ['2025', '2024', '2023', '2022', '2021', '2020']
  // const tabs = shallowRef(null)
  const validationRules= [v => /^[a-zA-Z\s]*$/.test(v) || ('Используйте английские буквы.')];


  // Метод fetchData для загрузки данных при монтировании компонента
  async function fetchData (year) {
    try {
      const response = await axios.get(`/api/${year}/drivers/${driverId}`)
      posts.value = response.data.results || [];
      errorMessage.value = '';
    } catch (error) {
      if (error.response) {
        errorMessage.value = `${error.response.status}: ${error.response.data.message}`;
      } else if (error.request) {
        errorMessage.value = 'Ошибка подключения к серверу.';
      } else {
        errorMessage.value = 'Что-то пошло не так.';
      }
    }
  }
  // onMounted(() => {
  //   fetchData(valueYear.value)
  // })

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
    { title: 'Название гонки', key: 'race.name', sortable: false },
    { title: 'Страна', key: 'race.circuit.country', sortable: false },
    { title: 'Позиция на финише', key: 'result.finishingPosition', align: 'center', sortable: false },
    { title: 'Очки', key: 'result.pointsObtained', align: 'center', sortable: false },

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

  function goToTable (tabyear) {
    router.push({ path: '/tables/', query: { year: tabyear } });
  }

  watch(valueYear, async newValue => {
    console.log('Год изменился:', newValue);
    await fetchData(newValue);
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: false });
  }, { immediate: true });

  // Наблюдатель за изменением имени
  watch(name, () => {
    search.value = String(Date.now());
  })
</script>
