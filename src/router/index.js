import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue' //1
import StockDetailView from '../views/stockDetail.vue' //2
import AFFund from '../views/AFFund.vue'
import FuturesInvestment from '../views/FuturesInvestment.vue'
import EquityInvestment from '../views/EquityInvestment.vue'
import ProfileView from '../views/ProfileView.vue'

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
      path: '/market',
      name: 'market',
      component: () => import('../views/MarketList.vue'),
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
    {
      path: '/futures',
      name: 'futures',
      component: FuturesInvestment,
    },
    {
      path: '/futures/detail',
      name: 'futuresDetail',
      component: () => import('../views/FuturesDetail.vue'),
    },
    {
      path: '/equity',
      name: 'equity',
      component: EquityInvestment,
    },
    {
      path: '/equity/detail',
      name: 'equityDetail',
      component: () => import('../views/EquityDetail.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      component: () => import('../views/AboutUs.vue'),
    },
    {
      path: '/moneyDetail',
      name: 'moneyDetail',
      component: () => import('../views/MoneyDetail.vue'),
    },
    {
      path: '/ipo',
      name: 'ipo',
      component: () => import('../views/IpoList.vue'),
    },
    {
      path: '/ipo/detail',
      name: 'ipoDetail',
      component: () => import('../views/IpoDetail.vue'),
    },
    {
      path: '/stockOrder',
      name: 'stockOrder',
      component: () => import('../views/StockOrders.vue'),
    },
  ],
})

export default router
