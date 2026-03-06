import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue' //1
import StockDetailView from '../views/stockDetail.vue' //2


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
  ],
})

export default router
