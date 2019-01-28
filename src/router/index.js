import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
     {
        path: '/',
        redirect: '/recommend'
      },  
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import("@/components/recommend/recommend"),
      children:[
          {
              path:':id',
              component: () => import('@/components/disc/disc')
          }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import("@/components/singer/singer"),
      children:[
          {
              path:':id',
              component: () => import('@/components/singer-detail/singer-detail')
          }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import("@/components/rank/rank"),
      children:[
          {
            path:':id',
            component: () => import('@/components/top-list/top-list')
          }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import("@/components/search/search"),
      children:[
        {
            path:':id',
            component: () => import('@/components/singer-detail/singer-detail')
        }
    ]
    }
  ]
})
