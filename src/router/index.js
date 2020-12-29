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
      name: 'home',
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
      name: 'userCenter',
      component: () => import('@/views/user/Center'),
      meta: { title: '个人中心' }
    }],
    hidden: true
  },

  //场所管理  创建场所
  {
    path: '/',
    component: Layout,
    meta: { title: '场所管理' },
    children: [{
      path: '/place/add',
      name: 'Place--add',
      component: () => import('@/views/place/PlaceAdd'),
      meta: { title: '创建场所' }
    }],
    hidden: true
  },

  //场所管理  编辑场所
  {
    path: '/',
    component: Layout,
    meta: { title: '场所管理' },
    children: [{
      path: '/place/edit/:id',
      name: 'Place--edit',
      component: () => import('@/views/place/PlaceAdd'),
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
      component: () => import('@/views/place/PlaceDetails'),
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

  //资源管理  创建资源
  {
    path: '/',
    component: Layout,
    meta: { title: '资源管理' },
    children: [{
      path: '/content/add',
      name: 'Content--add',
      component: () => import('@/views/content/contentAdd'),
      meta: { title: '创建资源' }
    }],
    hidden: true
  },

  //资源管理  编辑资源
  {
    path: '/',
    component: Layout,
    meta: { title: '资源管理' },
    children: [{
      path: '/content/edit/:id',
      name: 'Content--edit',
      component: () => import('@/views/content/contentAdd'),
      meta: { title: '编辑资源' }
    }],
    hidden: true
  },

  //资源管理  资源详情
  {
    path: '/',
    component: Layout,
    meta: { title: '资源管理' },
    children: [{
      path: '/content/details/:id',
      name: 'Content--details',
      component: () => import('@/views/content/ContentDetails'),
      meta: { title: '资源详情' }
    }],
    hidden: true
  },

  //时间轴  创建
  {
    path: '/',
    component: Layout,
    meta: { title: '时间轴' },
    children: [{
      path: '/timeline/add',
      name: 'Timeline--add',
      component: () => import('@/views/timeline/timelineAdd'),
      meta: { title: '创建时间轴' }
    }],
    hidden: true
  },

   //时间轴  编辑
   {
    path: '/',
    component: Layout,
    meta: { title: '时间轴' },
    children: [{
      path: '/timeline/edit/:id',
      name: 'Timeline--edit',
      component: () => import('@/views/timeline/timelineAdd'),
      meta: { title: '编辑时间轴' }
    }],
    hidden: true
  },

  //时间轴  详情
  {
      path: '/timeline/details/:id',
      name: 'Timeline--details',
      component: () => import('@/views/timeline/timelineDetails'),
      meta: { title: '时间轴详情' },
      hidden: true
  },

  //游戏管理  创建
  {
    path: '/',
    component: Layout,
    meta: { title: '游戏管理' },
    children: [{
      path: '/games/add',
      name: 'Games--add',
      component: () => import('@/views/games/gameAdd'),
      meta: { title: '创建游戏' },
    }],
    hidden: true
  },

  //游戏管理  编辑
  {
    path: '/',
    component: Layout,
    meta: { title: '游戏管理' },
    children: [{
      path: '/games/edit/:id',
      name: 'Games--edit',
      component: () => import('@/views/games/gameAdd'),
      meta: { title: '编辑游戏' },
    }],
    hidden: true
  },

  //游戏管理  详情
  {
    path: '/',
    component: Layout,
    meta: { title: '游戏管理' },
    children: [{
      path: '/games/details/:id',
      name: 'Games--details',
      component: () => import('@/views/games/details/index'),
      meta: { title: '游戏信息' },
      children: [
        {
          path: 'package',
          name: 'Games--details-package',
          component: () => import('@/views/games/details/package'),
          meta: { title: '包管理' }
        },
        {
          path: 'list',
          name: 'Games--details-list',
          component: () => import('@/views/games/details/gameList'),
          meta: { title: '游戏列表' }
        },
        {
          path: 'rank',
          name: 'Games--details-rank',
          component: () => import('@/views/games/details/rankTemp'),
          meta: { title: '排行榜管理' }
        }
      ]
    }],
    hidden: true
  },


  //屏幕布局 创建
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕布局' },
    children: [
      {
        path: '/screen/layout/add',
        name: 'Layout--add',
        component: () => import('@/views/screenLayout/components/AddScreenLayout'),
        meta: { title: '屏幕布局 - 创建' },
      }
    ],
    hidden: true
  },

  
  //屏幕布局 编辑
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕布局' },
    children: [
      {
        path: '/screen/layout/edit/:id',
        name: 'Layout--edit',
        component: () => import('@/views/screenLayout/components/AddScreenLayout'),
        meta: { title: '屏幕布局 - 编辑' },
      }
    ],
    hidden: true
  },


  //屏幕布局 详情
  {
    path: '/',
    component: Layout,
    meta: { title: '屏幕布局详情' },
    children: [
      {
        path: '/screen/layout/detail/:id',
        name: 'Layout--detail',
        component: () => import('@/views/screenLayout/detail'),
        meta: { title: '屏幕布局 - 详情' },
      }
    ],
    hidden: true
  },

   //活动管理  新建活动
  {
    path: '/',
    component: Layout,
    meta: { title: '活动管理' },
    children: [
      {
        path: '/activity/add',
        name: 'Activity--add',
        component: () => import('@/views/activity/activityAdd'),
        meta: { title: '活动管理 - 创建' },
      }
    ],
    hidden: true
  },

   //活动管理  编辑活动
  {
    path: '/',
    component: Layout,
    meta: { title: '活动管理' },
    children: [
      {
        path: '/activity/edit/:id',
        name: 'Activity--edit',
        component: () => import('@/views/activity/activityAdd'),
        meta: { title: '活动管理 - 编辑' },
      }
    ],
    hidden: true
  },

   //活动管理  详情
  {
    path: '/',
    component: Layout,
    meta: { title: '活动管理' },
    children: [
      {
        path: '/activity/detail/:id',
        name: 'Activity--detail',
        component: () => import('@/views/activity/detail'),
        meta: { title: '活动管理 - 详情' },
      }
    ],
    hidden: true
  },

   //活动管理  统计数据
  {
    path: '/',
    component: Layout,
    meta: { title: '活动管理' },
    children: [
      {
        path: '/activity/statistics/:id',
        name: 'Activity--statistics',
        component: () => import('@/views/activity/statistics/statistics'),
        meta: { title: '活动管理 - 统计数据' },
      }
    ],
    hidden: true
  }

]


export const asyncRoutes = [
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router