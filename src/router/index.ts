import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InsimAppView from  '../views/InsimAppView.vue'
import WellInitParam from  '../views/WellInitParam.vue'
import ConnectModel from  '../views/ConnectModel.vue'
import historyL from  '../views/historyL.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/insim',
    redirect: '/insim/home'},
  {
    path: '/',
    redirect: '/insim/home'},
  {
    path:'/insim',
    component:InsimAppView,
    children:[
      { // 所有的控件都写在这里
        path: 'home',
        component: HomeView
      },
      {
        path: 'baseData',
        component: WellInitParam
      },
      {
        path:"connectModel",
        name:"connectModel",
        component:ConnectModel,
        meta:{
          keepAlive: true //设置页面是否需要使用缓存
        }

      },
      {
        path:"historyL",
        component:historyL
      }
    ]}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
