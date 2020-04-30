import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 *
 * hidden: true                   是否在菜单栏显示
 * redirect: noRedirect           
 * name:'router-name'             
 * meta : {
    roles: ['admin','editor']    控制页面角色
    title: 'title'               名称显示在侧栏和面包屑
    icon: 'svg-name'             图标显示在侧栏
  }
 */


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/Register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    children: [{
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  //个人中心
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/user',
      component: () => import('@/views/user/Center'),
      meta: { title: '个人中心' }
    }],
    hidden: true
  },
]


export const asyncRoutes = [


  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router