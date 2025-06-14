<template>
  <v-card>
    <h1 class="text-h4 font-weight-bold d-flex justify-center mb-4 align-center">
      <div class="text-truncate">
        Командный зачет {{ props.user.nameJJ }}
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
    <template #[`item.team.teamName`]="{ item }">
      <span class="d-flex flex-row align-center"><img height="20" :src="getTeamImage(item)"> {{ item.team.teamName }}

        <!-- <img
          v-if="item.team.teamName === 'Scuderia Ferrari'"
          alt="{{ item.team.teamName }}"
          height="20"
          src="https://c.f1news.ru/userfiles/ham-photo.jpg"
          width="20"
        >
        <img
          v-else
          alt="{{ item.team.teamName }}"
          height="20"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-m4D7gaOaHMGxxheIp_xF_OSzrba6G7MIA&s"
          width="20"
        > -->

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
  import { defineProps } from 'vue';
  // import { useRoute } from 'vue-router';
  // const route = useRoute();
  // Инициализация реактивных данных
  const posts = ref([])
  const errors = ref([])
  // const tableYear = route.query.year;
  const props = defineProps(['user'])
  const valueYear = ref(props.user.nameJJ || '2022')//tableYear? tableYear : '2025'
  // const years = ['2025', '2024', '2023', '2022']
  // const tabs = shallowRef(null)


  async function fetchData (year) {
    try {
      const response = await axios.get(`https://f1api.dev/api/${year}/constructors-championship`)
      posts.value = response.data.constructors_championship
    } catch (err) {
      errors.value.push(err.message || err.toString())
    }
  }
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
            if (search.value && !item.team.teamName.toLowerCase().includes(search.value.toLowerCase())
            ) {
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
    { title: 'wins', key: 'wins', sortable: false },
    { title: 'country', key: 'team.country' },
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
  }, { immediate: true });

  watch(name, () => {
    search.value = String(Date.now())
  })

  function getTeamImage (item) {
    switch (item.team.teamName) {
      case 'Scuderia Ferrari':
        return '/src/assets/teams/ferrari.jpg';
      case 'Mercedes Formula 1 Team':
        return '/src/assets/teams/mersedes.jpg';
      case 'McLaren Formula 1 Team':
        return '/src/assets/teams/mclaren.jpg';
      case 'Red Bull Racing':
        return '/src/assets/teams/redbull.jpg';
      case 'RB F1 Team':
        return '/src/assets/teams/rb.jpg';
      case 'Haas F1 Team':
        return '/src/assets/teams/haas.jpg';
      case 'Sauber F1 Team':
        return '/src/assets/teams/sauber.jpg';
      case 'Aston Martin F1 Team':
        return '/src/assets/teams/aston.jpg';
      case 'Alpine F1 Team':
        return '/src/assets/teams/alpine.jpg';
      case 'Williams Racing':
        return '/src/assets/teams/williams.jpg';

      default:
        return '/src/assets/teams/defteam.png'
    }
  }

</script>
