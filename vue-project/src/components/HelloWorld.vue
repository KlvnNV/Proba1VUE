<template>
  <v-container
    class="mb-4"
    fluid
    max-width="900"
  >
    <div>
      <v-img
        class="mb-0"
        height="250"
        src="@/assets/logo.png"
      />
      <!-- <v-card
        class="mx-auto"
        color="surface-light"
        max-width="400"
      >
        <v-card-text>
          <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            hide-details
            label="Search templates"
            :loading="loading"
            single-line
            variant="solo"
            @click:append-inner="onClick"
          />
        </v-card-text>
      </v-card> -->
      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">F1 Stat</h1>
      </div>

      <!-- <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn density="compact" prepend-icon="$vuetify" @click="firstBClick">Первая кнопка</v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn density="comfortable" @click="changeEl">Вторая кнопка</v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn class="bg-purple-darken-2 text-center" density="default" rounded="xl">Default Button</v-btn>
          </v-col>
        </v-row>
      </v-container> -->
      <!-- <v-row>{{ el }}</v-row> -->
      <v-row>
        <!-- <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Get started
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Change this page by updating <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>components/HelloWorld.vue</v-kbd>.
              </div>
            </template>
          </v-card>
        </v-col> -->

        <v-col v-for="link in links" :key="link.href" cols="12">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
  // import { ref } from 'vue'

  // const loaded = ref(false)
  // const loading = ref(false)

  // function onClick () {
  //   loading.value = true
  //   setTimeout(() => {
  //     loading.value = false
  //     loaded.value = true
  //   }, 2000)
  // }
  const links = [
    {
      href: '/tables',
      icon: 'mdi-text-box-outline',
      subtitle: 'Результаты гонщиков, команд и календарь чемпионата.',
      title: 'Чемпионат',
    },
    {
      href: '/cardteam',
      icon: 'mdi-widgets-outline',
      subtitle: 'Список команд чемпионата.',
      title: 'Команды',
    },
    {
      href: '/driversall',
      icon: 'mdi-star-circle-outline',
      subtitle: 'Список гощиков чемпионата.',
      title: 'Гонщики',
    },
    // {
    //   href: '#',
    //   icon: 'mdi-account-group-outline',
    //   subtitle: 'Connect with Vuetify developers.',
    //   title: 'Community',
    // },
  ];
  // export default {

  //   data () {
  //     return {
  //       el: 'Frozen Yogurt',
  //     }
  //   },
  //   methods: {
  //     firstBClick () {
  //       console.log('First button clicked')
  //     },
  //     changeEl () {
  //       this.el = 'Peanut Butter Cup'
  //     },
  //   },
  // }
</script>

<style lang="scss" scoped></style>
