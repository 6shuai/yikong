import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getAuthMenu } from "@/api/user";
import { filterAsyncRouter } from './store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach((to, from, next) => {
	// start progress bar
	NProgress.start()

	// set page title
	document.title = getPageTitle(to.meta.title)
	const hasToken = getToken()
	if (hasToken) {
		if (to.path === '/login' || to.path === '/register') {
			next({ path: '/' })
			NProgress.done()
		}if(to.path === '/' && store.state.settings.showMenu){
			next({ path: '/project' })
			NProgress.done()
		}else {
			if(!store.state.permission.addRoutes.length){
				getAuthMenu().then(res => {
					if(res.code === 0){
						// 主页数据
						store.state.user.homePageData = res.obj

						// 只有一个角色时 直接显示首页    多个角色要选选择角色进入
						if(res.obj.length === 1){
							localStorage.currentRoleHomePageData = JSON.stringify(res.obj[0].authorities)

							// id === 1 老用户  显示左侧菜单栏
							if(res.obj[0].id === 1){
								store.commit('settings/SET_SHOW_MENU', true)
							}
						}
						
						
						let currentRoleHomePageData = localStorage.currentRoleHomePageData ? JSON.parse(localStorage.currentRoleHomePageData) : []
						const asyncRouter = filterAsyncRouter(currentRoleHomePageData)
						
						asyncRouter.push({ path: '*', redirect: '/404', hidden: true })

						
						// 存储路由
						store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => { 
							// 动态添加可访问路由表
							router.addRoutes(asyncRouter) 

							// hack方法 确保addRoutes已完成
							next({ ...to, replace: true })
						})
					}
				})
			}else{
				next()
			}
		}
	} else {

		if (whiteList.indexOf(to.path) !== -1) {
			// 在免登录白名单，直接进入
			next()
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next({ path: '/login' })
			NProgress.done()
		}
	}
	
})

router.afterEach(() => {
	// finish progress bar
	NProgress.done()
})



