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
      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">F1 Stat</h1>
      </div>

      <v-row>
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
  ];
</script>
