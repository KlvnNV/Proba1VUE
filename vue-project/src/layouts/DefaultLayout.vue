<template>
  <div class="layout">
    <AppNav />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script>
  import AppFooter from './AppFooter.vue'
  import AppNav from './Nav.vue';
  export default {
    name: 'DefaultLayout',
    components: { AppNav, AppFooter },
  }
</script>

<style>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 55px 0em;
}
</style>
