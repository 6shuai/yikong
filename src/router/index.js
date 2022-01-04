import Vue from 'vue'
import Router from 'vue-router'

import screenRoutes from './screen'
import contentRoutes from './content'
import gameRoutes from './game'
import activityRoutes from './activity'
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


export const constantRoutes = [{
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
			meta: {
				title: '首页',
				icon: 'home'
			}
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
			meta: {
				title: '个人中心'
			}
		}],
		hidden: true
	},

	//游戏统计数据
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/game/statisics',
			name: 'gameStatisics',
			component: () => import('@/components/Statistics/index'),
			meta: {
				title: '数据统计'
			}
		}],
		hidden: true
	},

	//游戏奖励统计数据
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/game/awardStatisics',
			name: 'gameAwardStatisics',
			component: () => import('@/components/Statistics/award/index'),
			meta: {
				title: '游戏奖励数据统计'
			}
		}],
		hidden: true
	},

	//玩家游戏行为统计
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/game/charts',
			name: 'gameCharts',
			component: () => import('@/components/Statistics/charts/index'),
			meta: {
				title: '玩家游戏行为统计'
			}
		}],
		hidden: true
	},

	//玩家优惠券统计
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/game/couponStatisics',
			name: 'gameCoupon',
			component: () => import('@/components/couponStatistics/index'),
			meta: {
				title: '优惠券统计'
			}
		}],
		hidden: true
	},

	//场所管理  创建场所
	{
		path: '/',
		component: Layout,
		meta: {
			title: '场所管理'
		},
		children: [{
			path: '/place/add',
			name: 'Place--add',
			component: () => import('@/views/place/PlaceAdd'),
			meta: {
				title: '创建场所'
			}
		}],
		hidden: true
	},

	//场所管理  编辑场所
	{
		path: '/',
		component: Layout,
		meta: {
			title: '场所管理'
		},
		children: [{
			path: '/place/edit/:id',
			name: 'Place--edit',
			component: () => import('@/views/place/PlaceAdd'),
			meta: {
				title: '编辑场所'
			}
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
			meta: {
				title: '场所详情'
			}
		}],
		hidden: true
	},

	//时间轴  创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '时间轴'
		},
		children: [{
			path: '/timeline/add',
			name: 'Timeline--add',
			component: () => import('@/views/timeline/timelineAdd'),
			meta: {
				title: '创建时间轴'
			}
		}],
		hidden: true
	},

	//时间轴  编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '时间轴'
		},
		children: [{
			path: '/timeline/edit/:id',
			name: 'Timeline--edit',
			component: () => import('@/views/timeline/timelineAdd'),
			meta: {
				title: '编辑时间轴'
			}
		}],
		hidden: true
	},

	//时间轴  详情
	{
		path: '/timeline/details/:id',
		name: 'Timeline--details',
		component: () => import('@/views/timeline/timelineDetails'),
		meta: {
			title: '时间轴详情'
		},
		hidden: true
	},


	//屏幕布局 创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局'
		},
		children: [{
			path: '/screen/layout/add',
			name: 'Layout--add',
			component: () => import('@/views/screenLayout/components/AddScreenLayout'),
			meta: {
				title: '屏幕布局 - 创建'
			},
		}],
		hidden: true
	},


	//屏幕布局 编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局'
		},
		children: [{
			path: '/screen/layout/edit/:id',
			name: 'Layout--edit',
			component: () => import('@/views/screenLayout/components/AddScreenLayout'),
			meta: {
				title: '屏幕布局 - 编辑'
			},
		}],
		hidden: true
	},


	//屏幕布局 详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局详情'
		},
		children: [{
			path: '/screen/layout/detail/:id',
			name: 'Layout--detail',
			component: () => import('@/views/screenLayout/detail'),
			meta: {
				title: '屏幕布局 - 详情'
			},
		}],
		hidden: true
	},


	//插播广告 创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/add',
			name: 'CutInAdver--add',
			component: () => import('@/views/cutInAdver/add'),
			meta: {
				title: '插播广告 - 创建'
			},
		}],
		hidden: true
	},

	//插播广告 编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/edit/:id',
			name: 'CutInAdver--edit',
			component: () => import('@/views/cutInAdver/add'),
			meta: {
				title: '插播广告 - 编辑'
			},
		}],
		hidden: true
	},


	//插播广告 详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/:adverId',
			name: 'CutInAdver--detail',
			component: () => import('@/views/cutInAdver/detail'),
			meta: {
				title: '插播广告 - 详情'
			},
		}],
		hidden: true
	},

	// 商户管理 - 添加商户
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/add',
			name: 'Merchant--add',
			component: () => import('@/views/merchant/MerchantAdd'),
			meta: {
				title: '商户管理 - 添加商户'
			},
		}],
		hidden: true
	},

	// 商户管理 - 编辑商户
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/edit/:id',
			name: 'Merchant--edit',
			component: () => import('@/views/merchant/MerchantAdd'),
			meta: {
				title: '商户管理 - 编辑商户'
			},
		}],
		hidden: true
	},

	// 商户管理 - 商户详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/detail/:id',
			name: 'Merchant--detail',
			component: () => import('@/views/merchant/MerchantDetail'),
			meta: {
				title: '商户管理 - 商户详情'
			},
		}],
		hidden: true
	},

	// 屏幕管理
	...screenRoutes,

	// 内容管理
	...contentRoutes,

	//游戏管理
	...gameRoutes, 

	//活动管理
	...activityRoutes  

]


export const asyncRoutes = [
	// { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({
		x: 0,
		y: 0
	}),
	routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router