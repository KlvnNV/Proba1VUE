<template>
  <v-card>
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        Календарь чемпионата, сезон {{ props.user.nameJJ }}
      </div>
    </h1>
  </v-card>

  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :hide-default-footer="true"
    item-value="name"
    :items="filteredItems"
    :items-length="totalItems"
    :loading="loading"
    @update:options="loadItems"
  >
    <template #[`item.schedule.race.date`]="{ item }">
      {{ new Date(item.schedule.race.date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric' }) }}
    </template>

    <!-- //   :search="search" -->
    <template #[`item.winner.surname`]="{ item }">
      <span class="d-flex flex-row align-center">
        {{ getStatusD(item.winner) }}
      </span>
    </template>
    <template #[`item.teamWinner.teamName`]="{ item }">
      <span class="d-flex flex-row align-center">
        {{ getStatusT(item.teamWinner) }}
      </span>

    </template>
    <!-- <template #tfoot>
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
    </template> -->
  </v-data-table-server>
  <v-row class="d-flex justify-center mt-4 align-center">
    <v-col cols="4">
      <v-text-field v-model="formattedDate" class="text-align-content-center" placeholder="Выберите начальную и конечную дату" readonly />
    </v-col>
    <v-btn @click="clearFilter">Очистить фильтр</v-btn>
  </v-row>
  <v-row class="d-flex justify-center mb-4 align-center">
    <!-- <v-col> -->
    <v-date-picker
      v-model="dateFrom"
      first-day-of-week="1"
      :max="'2025-12-31'"
      :min="'2020-01-01'"
      min-width="120"
      title="Начало периода"
    />
    <v-date-picker
      v-model="dateTo"
      first-day-of-week="1"
      :max="'2025-12-31'"
      :min="'2020-01-01'"
      min-width="120"
      title="Конец периода"
    />
    <!-- </v-col> -->


  </v-row>
  <v-row>
    <!-- <v-col>
      <v-btn @click="clearFilter">Очистить фильтр</v-btn>
    </v-col> -->
  </v-row>
</template>
<script setup>
  import { computed, /*onMounted,*/ ref, watch } from 'vue'
  import axios from 'axios'
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  // Инициализация реактивных данных
  const posts = ref([])
  const errors = ref([])
  // const tableYear = route.query.year;
  const props = defineProps(['user'])
  const valueYear = ref(props.user.nameJJ || '2022')//tableYear? tableYear : '2025'
  // const years = ['2025', '2024', '2023', '2022']
  // const tabs = shallowRef(null)

  const dateFrom = ref(null);
  const dateTo = ref(null);


  const filteredItems = computed(() => {
    if (!dateFrom.value&&!dateTo.value) return serverItems.value;

    return serverItems.value.filter(item => {
      const raceDate = new Date(item.schedule.race.date);
      return (raceDate >= dateFrom.value && raceDate <= dateTo.value);
    });
  });

  const formattedDate = computed(() => {
    if (!dateFrom.value || !dateTo.value) return '';
    return `с  ${new Date(dateFrom.value).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}   по   ${new Date(dateTo.value).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  });

  const clearFilter = () => {
    dateFrom.value = null;
    dateTo.value = null;
  };

  const statusMap = {
    null: 'Неизвестно',
  }
  const getStatusD = winner => {
    if (winner===null ) {
      return statusMap[winner]
    }
    return winner?.surname
  }
  const getStatusT = teamWinner => {
    if (teamWinner===null ) {
      return statusMap[teamWinner]
    }
    return teamWinner?.teamName
  }


  async function fetchData (year) {
    try {
      const response = await axios.get(`/api/${year}`)
      posts.value = response.data.races
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }
  // Метод fetchData для загрузки данных при монтировании компонента
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
            if (search.value && !item.team.teamName.toLowerCase().includes(search.value.toLowerCase())
            ) {
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
  const itemsPerPage = ref(25)
  const headers = ref([
    {
      title: 'Дата',
      align: 'start',
      sortable: false,
      key: 'schedule.race.date',
    },
    // { title: '', key: 'schedule.race.time', sortable: false },
    { title: 'Гран При', key: 'circuit.country', sortable: false },
    { title: 'Трасса', key: 'circuit.circuitName', sortable: false },
    { title: 'Победитель', key: 'winner.surname', sortable: false },
    { title: 'Команда', key: 'teamWinner.teamName', sortable: false },
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
  }, { immediate: true });

  watch(name, () => {
    search.value = String(Date.now())
  })

</script>
