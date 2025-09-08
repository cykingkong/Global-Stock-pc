import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue' //1
import userDetail from '../views/userDetail.vue' // 2
import votingProgress from '../views/votingProgress.vue' // 3
import votingRules from '../views/votingRules.vue' //4

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: userDetail,
    },
    {
      path: '/votingProgress',
      name: 'votingProgress',
      component: votingProgress,
    },
    {
      path: '/votingRules',
      name: 'votingRules',
      component: votingRules,
    },
  ],
})

export default router
