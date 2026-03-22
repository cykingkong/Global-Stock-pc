import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue' //1
import StockDetailView from '../views/stockDetail.vue' //2
import AFFund from '../views/AFFund.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/detail',
      name: 'detail',
      component: StockDetailView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/detail2',
      name: 'detail2',
      component: () => import('../views/stockDetail2.vue'),
    },
    {
      path: '/affund',
      name: 'affund',
      component: AFFund,
    },
  ],
})

export default router
