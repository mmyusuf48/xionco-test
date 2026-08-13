import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/Dashboard.vue'
import Products from '../pages/Products.vue'
import Stocks from '../pages/Stocks.vue'
import Purchases from '../pages/Purchases.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/products',
      component: Products,
    },
    {
      path: '/stocks',
      component: Stocks,
    },
    {
      path: '/purchases',
      component: Purchases,
    },
  ],
})

export default router