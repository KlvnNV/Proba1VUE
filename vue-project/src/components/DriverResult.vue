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
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        {{ `Результаты гонщика ${driverName}` }}
      </div>
    </h1>
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
            style="min-width: 120px"
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
    <template #[`item.result.pointsObtained`]="{ item }">
      <v-btn class="d-flex justify-center" @click="goToTable(valueYear)">{{ item.result.pointsObtained }}
      </v-btn>
    </template>
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
  import { /*onMounted,*/ ref, shallowRef, watch } from 'vue'
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
  const tabs = shallowRef(null)


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
    { title: 'Name race', key: 'race.name', sortable: false },
    { title: 'country', key: 'race.circuit.country', sortable: false },
    { title: 'finishingPosition', key: 'result.finishingPosition', sortable: false },
    { title: 'points', key: 'result.pointsObtained', sortable: true },

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


  // watch(name, () => {
  //   search.value = String(Date.now())
  // })
  //   watch([valueYear, name], async ([newValueYear, newName]) => {
  //   if (newValueYear !== undefined && newValueYear !== null) {
  //     await fetchData(newValueYear)
  //   }

  //   if (newName !== undefined && newName !== null) {
  //     search.value = String(Date.now())
  //   }
  // }, { immediate: true })
  // Наблюдатель за изменением года
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

<!-- <script>
  import axios from 'axios'

  export default {
    data () {
      return {
        posts: [],
        errorMessage: '',
        valueYear: '2025',
        years: ['2025', '2024', '2023', '2022', '2021', '2020'],
        itemsPerPage: 10, // Количество элементов на странице
        headers: [
          { title: 'Дата', align: 'start', sortable: false, key: 'race.date' },
          { title: 'Название гонки', key: 'race.name', sortable: false },
          { title: 'Страна', key: 'race.circuit.country', sortable: false },
          { title: 'Позиция финиша', key: 'result.finishingPosition', sortable: false },
          { title: 'Очки', key: 'result.pointsObtained', sortable: true },
        ],
        serverItems: [], // Элементы сервера (результаты запроса)
        loading: true, // Загрузка данных
        totalItems: 0, // Общее количество записей
        name: '', // Имя водителя (не используется здесь)
        search: '', // Поисковая фраза

      };
    },
    watch: {
      valueYear: {
        async handler () {
          await this.fetchData();
        },
        immediate: true,
      },
      // Наблюдатель за полем имени (name), обновление search.value при каждом изменении
      // name (newVal) {
      //   this.search = String(Date.now())
      // },

    },
    created () {
      this.fetchData();
      // Запрашиваем начальные данные при создании компонента
      this.loadItems();

    },
    methods: {
      async fetchData () {
        try {
          const driverId = this.$route.query.id; // Используем встроенный объект маршрута Vue Router
          const response = await axios.get(
            `https://f1api.dev/api/${this.valueYear}/drivers/${driverId}`
          );
          this.posts = response.data.results || [];
          this.errorMessage = '';
        } catch (error) {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.message}`;
          } else if (error.request) {
            this.errorMessage = 'Ошибка подключения к серверу.';
          } else {
            this.errorMessage = 'Что-то пошло не так.';
          }
        }
      },
      // Метод загрузки данных
      async loadItems (options) {
        this.loading = true

        const { page, itemsPerPage, sortBy } = options
        const result = await FakeAPI.fetch({ page, itemsPerPage, sortBy, search: this.search })

        this.serverItems = result.items
        this.totalItems = result.total
        this.loading = false
      },

    },
  };

  // Мнимое API для симуляции запросов (FakeAPI)
  const FakeAPI = {
    async fetch (options) {
      return new Promise(resolve => {
        setTimeout(() => {
          const { page, itemsPerPage, sortBy, search } = options
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage

          // Фильтруем элементы по поиску
          const filteredItems = posts.value.filter(item => {
            if (
              search &&
              (!item.race.name.toLowerCase().includes(search.toLowerCase()) ||
                !item.race.circuit.country.toLowerCase().includes(search.toLowerCase()))
            ) {
              return false
            }
            return true
          })

          // Сортируем список элементов (если задана сортировка)
          if (sortBy.length > 0) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order

            filteredItems.sort((a, b) => {
              let aValue = a
              let bValue = b

              // Идем по каждому уровню объекта (для глубокого сравнения)
              for (const part of sortKey.split('.')) {
                aValue = aValue[part]
                bValue = bValue[part]
              }

              // Локализованное сравнение строк
              return sortOrder === 'desc'
                ? bValue.localeCompare(aValue)
                : aValue.localeCompare(bValue)
            })
          }

          // Создаем пагинированный набор данных
          const paginated = filteredItems.slice(start, end === -1 ? undefined : end)
          resolve({
            items: paginated,
            total: filteredItems.length,
          })
        }, 500)
      })
    },
  }


</script> -->
<!-- <script>
  import axios from 'axios';
  import { ref, shallowRef } from 'vue';

  export default {
    setup () {
      const posts=ref([]);
      const errorMessage= ref('');

      const valueYear = ref('2025');
      const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
      const tabs = shallowRef(null);
      const serverItems = ref([]);
      const loading = ref(true);
      const totalItems = ref(0);
      const name = ref('');
      const search = ref('');
      const itemsPerPage = ref(5)
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
        { title: 'points', key: 'result.pointsObtained', sortable: true },

      ]);
      const fakeApi = {
        async fetch ({ page, itemsPerPage, sortBy, search }, postsArray) {
          return new Promise(resolve => {
            setTimeout(() => {
              const start = (page - 1) * itemsPerPage;
              const end = start + itemsPerPage;
              const items = postsArray.slice().filter(item => {
                if (
                  search.value &&
                  !item.race.name.toLowerCase().includes(search.value.toLowerCase()) &&
                  !item.race.circuit.country.toLowerCase().includes(search.value.toLowerCase())
                ) {
                  return false;
                }
                return true;
              });

              if (sortBy.length > 0) {
                const sortKey = sortBy[0].key;
                const sortOrder = sortBy[0].order;

                items.sort((a, b) => {
                  let aValue = a;
                  let bValue = b;

                  for (const part of sortKey.split('.')) {
                    aValue = aValue[part];
                    bValue = bValue[part];
                  }

                  if (sortOrder === 'desc') {
                    return bValue.localeCompare(aValue);
                  } else {
                    return aValue.localeCompare(bValue);
                  }
                });
              }

              const paginated = items.slice(start, end === -1 ? undefined : end);
              resolve({ items: paginated, total: items.length });
            }, 500);
          });
        },
      };
      return {
        valueYear, years, tabs,serverItems,loading,totalItems,name,search,itemsPerPage,headers,posts,errorMessage,fakeApi,
      };
    },

    // data () {
    //   return {
    //     fakeApi: {
    //       async fetch ({ page, itemsPerPage, sortBy, search }) {
    //         return new Promise(resolve => {
    //           setTimeout(() => {
    //             const start = (page - 1) * itemsPerPage;
    //             const end = start + itemsPerPage;
    //             const items = this.posts.slice().filter(item => {
    //               if (
    //                 search.value &&
    //                 !item.driver.surname.toLowerCase().includes(search.value.toLowerCase()) &&
    //                 !item.driver.name.toLowerCase().includes(search.value.toLowerCase())
    //               ) {
    //                 return false;
    //               }
    //               return true;
    //             });

    //             if (sortBy.length > 0) {
    //               const sortKey = sortBy[0].key;
    //               const sortOrder = sortBy[0].order;

    //               items.sort((a, b) => {
    //                 let aValue = a;
    //                 let bValue = b;

    //                 for (const part of sortKey.split('.')) {
    //                   aValue = aValue[part];
    //                   bValue = bValue[part];
    //                 }

    //                 if (sortOrder === 'desc') {
    //                   return bValue.localeCompare(aValue);
    //                 } else {
    //                   return aValue.localeCompare(bValue);
    //                 }
    //               });
    //             }

    //             const paginated = items.slice(start, end === -1 ? undefined : end);
    //             resolve({ items: paginated, total: items.length });
    //           }, 500);
    //         });
    //       },
    //     },
    //   itemsPerPage: 5,
    //   headers: [
    //     { title: 'Позиция', align: 'start', sortable: false, key: 'position' },
    //     { title: 'First Name', key: 'driver.name', sortable: false },
    //     { title: 'Last Name', key: 'driver.surname' },
    //     { title: 'Team', key: 'team.teamName' },
    //     { title: 'Points', key: 'points' },
    //   ],
    //   serverItems: [],
    //   loading: true,
    //   totalItems: 0,
    //   name: '',
    //   search: '',
    //   };
    // },
    watch: {
      async valueYear (newValue) {
        await this.fetchData(newValue);
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
      },
    },
    mounted () {
      this.fetchData(this.valueYear);
    },

    // watch: {
    //   name (newVal) {
    //     this.search = String(Date.now());
    //   },
    // },
    // mounted () {
    //   this.fetchData();
    // },
    methods: {
      async fetchData (year) {
        try {
          const driverId = this.$route.query.id;
          const response = await axios.get(`https://f1api.dev/api/${year}/drivers/${driverId}`);
          this.posts = response.data.results || [];
          this.errorMessage = '';
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
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
      loadItems ({ page, itemsPerPage, sortBy }) {
        this.loading = true;
        this.fakeApi.fetch({ page, itemsPerPage, sortBy, search: { value: this.search } }, this.posts).then(({ items, total }) => {
          this.serverItems = items;
          this.totalItems = total;
          this.loading = false;
        });
      },
    },
  };
</script> -->
