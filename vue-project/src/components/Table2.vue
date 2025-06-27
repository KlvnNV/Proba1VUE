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
    class="custom-class"
    :headers="headers"
    item-value="name"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <template #[`item.team.teamName`]="{ item }">
      <span class="d-flex flex-row align-center">
        <v-btn class="px-0 py-0" color="rgb(50, 50, 50)" @click="goToTeam(item.teamId, item.team.teamName, valueYear)">
          <img height="30" :src="getTeamImage(item)">
        </v-btn>
        {{ item.team.teamName }}
      </span>
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
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const posts = ref([])
  const errors = ref([])
  const props = defineProps(['user'])
  const valueYear = ref(props.user.nameJJ || '2022')
  const validationRules= [v => /^[a-zA-Z\s]*$/.test(v) || ('Используйте английские буквы.')];


  async function fetchData (year) {
    try {
      const response = await axios.get(`/api/${year}/constructors-championship`)
      posts.value = response.data.constructors_championship
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
    { title: 'Название команды', key: 'team.teamName', sortable: false },
    { title: 'Страна', key: 'team.country', sortable: false },
    { title: 'Побед', key: 'wins', sortable: false },
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

  function goToTeam (teamId, tname, tyear) {
    router.push({ path: '/team/', query: { id: teamId, name: tname, year: tyear } });
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
