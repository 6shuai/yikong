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
		}else {
			if(!store.state.permission.addRoutes.length){
				getAuthMenu().then(res => {
					if(res.code === 0){
						// 无访问权限
						const asyncRouter = filterAsyncRouter(res.obj)
						asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
						store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => { // 存储路由
							router.addRoutes(asyncRouter) // 动态添加可访问路由表
							next({ ...to, replace: true })// hack方法 确保addRoutes已完成
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



