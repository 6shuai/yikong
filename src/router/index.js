import Vue from 'vue'
import Router from 'vue-router'

import homeRoutes from './home'
import placeRoutes  from './place'
import screenRoutes from './screen'
import contentRoutes from './content'
import timelineRoutes from './timeline'
import gameRoutes from './game'
import activityRoutes from './activity'
import merchantRoutes from './merchant'
import layoutRoutes from './layout'
import adverRoutes from './adver'

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
			name: 'Project',
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

	// 我的项目
	...homeRoutes,

	// 场所管理
	...placeRoutes,

	// 屏幕管理
	...screenRoutes,

	// 内容管理
	...contentRoutes,

	// 时间轴管理
	...timelineRoutes, 

	//游戏管理
	...gameRoutes, 

	//活动管理
	...activityRoutes,

	//商户管理
	...merchantRoutes,

	// 屏幕布局
	...layoutRoutes,

	// 插播广告
	...adverRoutes

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