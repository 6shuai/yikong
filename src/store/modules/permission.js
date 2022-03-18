import {
	asyncRoutes,
	constantRoutes
} from '@/router';
import Layout from '@/layout';

const moduleMap = {
	'Home': 'project/index',
	'Place': 'place/index',                          	  // 场所管理 场所列表

	'Screen': 'screen/index',                          	  // 屏幕管理  

	'Content': 'content/index',                           // 内容管理  

	'Games': 'games/index',                               // 游戏管理

	'Timeline': 'timeline/index',                         // 时间轴  

	'Layout': 'screenLayout/index',						  // 屏幕布局 模板

	'Activity': 'activity/index',					      // 活动管理

	'CutInAdver': 'cutInAdver/index',				      // 插播广告

	'Merchant': 'merchant/index',				          // 商户管理

	'PriceSystem': 'priceSystem/index',                   // 价格体系

	'Finance': 'finance/index',                   		  // 财务权责


	'Log': 'log/index',									  // 操作日志
	'Authority': 'system/authority/index',                // 权限管理
	'Role': 'system/role/index',						  // 角色管理
	'Member': 'system/member/index',				      // 成员管理
	'Organization': 'system/organizations/index',		  // 品牌列表
	'OrganizationType': 'system/organizationType/index',  // 组织类型列表
	'User': 'user/Center',							      // 个人中心
	'BasicRole': 'system/basicRole/index',			      // 基础角色管理
	'Page': 'system/home/index',                          // 主页管理


	'ResAuthority': 'resAuthority/resAuthority/index',		  // 内容权限管理
	'ResRole': 'resAuthority/resRole/index',			      // 内容角色管理
	'Group': 'resAuthority/group/index',			      	  // 权限群组
}


/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
	const res = [];

	routes.forEach((route) => {
		let tmp = {...route}
		// if (hasPermission(roles, tmp)) {
			if (tmp.children) {
			tmp.children = filterAsyncRoutes(tmp.children, roles);
			// }
			res.push(tmp);
		}
	});
	return res;
}

const state = {
	routes: [],
	routesMenu: [],
	addRoutes: [],
};

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes;
		state.routes = constantRoutes.concat(routes);
		routes.forEach((item => {
			if(item.children) state.routesMenu = state.routesMenu.concat(item.children);
		}))
	},
};

const actions = {
	GenerateRoutes({ commit }, asyncRouter) {
		commit('SET_ROUTES', asyncRouter)
	}
};

//用户页面按钮 操作权限
function getUserPerm(data){
	let permArr = [];
	if(data){
		data.forEach(item => {
			permArr.push(item.moduleName);
		})
	}
	return permArr;
};

//路由格式化
export const filterAsyncRouter = (data) => {
	let result = [];
	if(!data) return result;
    data.forEach(item => {
        // 先格式化子路由
        let formattedChildren = null;
        if (item.children != null && item.children instanceof Array) {
            formattedChildren = filterAsyncRouter(item.children);
		}
        let pageRouter = {
            path: item.route, 
            name: item.moduleName, 
			children: formattedChildren || [], 
			// 路由懒加载
			component: item.parentID === 1 ? Layout : (resolve) => require(['@/views/' + moduleMap[item.moduleName] + '.vue'], resolve),
			meta: {
				title: item.displayName,
				icon: item.moduleName,
				permission: getUserPerm(item.subContent),
			},
			hidden: item.hidden
		}

		if(item.route == '/timeline/index'){
			state.timelinePrem = pageRouter.meta.permission;
		}else if(item.route == '/games/index'){
			state.gamesPrem = pageRouter.meta.permission;
		}


        result.push(pageRouter);
	})
    return result;
}


export default {
	namespaced: true,
	state,
	mutations,
	actions,
};