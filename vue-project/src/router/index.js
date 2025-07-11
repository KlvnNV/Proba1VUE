/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import Cardteam from '@/components/Cardteam.vue'
import DriverResult from '@/components/DriverResult.vue'
import Driversall from '@/components/Driversall.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import Table from '@/components/Table.vue'
import Team from '@/components/Team.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/team', component: Team },
    { path: '/driverResult', component: DriverResult },
    { path: '/driversall', component: Driversall },
    { path: '/cardteam', component: Cardteam },
    { path: '/tables', component: Table },

  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
