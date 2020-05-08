import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 *
 * hidden: true                   是否在菜单栏显示
 * redirect: noRedirect           
 * name:'router-name'             出现 -- 会截取--之前的  主要用于 不显示在菜单栏的  二级菜单 类型创建和详情页
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

  //场所管理  创建场所
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕管理' },
    children: [{
      path: '/place/add',
      name: 'Place--add',
      component: () => import('@/views/place/list/PlaceAdd'),
      meta: { title: '创建场所' }
    }],
    hidden: true
  },

  //场所管理  编辑场所
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕管理' },
    children: [{
      path: '/place/edit/:id',
      name: 'Place--edit',
      component: () => import('@/views/place/list/PlaceAdd'),
      meta: { title: '编辑场所' }
    }],
    hidden: true
  },

  //场所管理  详情页
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/place/details/:id',
      name: 'Place--details',
      component: () => import('@/views/place/list/PlaceDetails'),
      meta: { title: '场所详情' }
    }],
    hidden: true
  },

  //屏幕管理  创建大屏
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕管理' },
    children: [{
      path: '/screen/add',
      name: 'Screen--add',
      component: () => import('@/views/screen/ScreenAdd'),
      meta: { title: '创建大屏' }
    }],
    hidden: true
  },

  //屏幕管理  编辑大屏
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕管理' },
    children: [{
      path: '/screen/edit/:id',
      name: 'Screen--edit',
      component: () => import('@/views/screen/ScreenAdd'),
      meta: { title: '编辑大屏' }
    }],
    hidden: true
  },

  //屏幕管理  详情页
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/screen/details/:id',
      name: 'Screen--details',
      component: () => import('@/views/screen/ScreenDetails'),
      meta: { title: '屏幕详情' }
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