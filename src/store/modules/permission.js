import {
	asyncRoutes,
	constantRoutes
} from '@/router';
import Layout from '@/layout';

const moduleMap = {
	'Home': 'home/index',
	'Place': 'place/list/index',                          //场所管理 场所列表

	'Screen': 'screen/index',                          	  //屏幕管理  

	'Content': 'content/index',                           //内容管理  

	'Timeline': 'timeline/index',                         //时间轴  
	
	'Authority': 'system/authority/index',                //权限管理
	'Role': 'system/role/index',						  //角色管理
	'Member': 'system/member/index',				      //成员管理
	'Organization': 'system/organizations/index',		  //品牌列表
	'User': 'user/Center'								  //个人中心
}

/**
 * 当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
	if (route.meta && route.meta.roles) {
		return roles.some((role) => route.meta.roles.includes(role));
	} else {
		return true;
	}
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
	addRoutes: [],
};

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes;
		state.routes = constantRoutes.concat(routes);
	},
};

const actions = {
	GenerateRoutes({ commit }, asyncRouter) {
		commit('SET_ROUTES', asyncRouter)
	}
};

//路由格式化
export const filterAsyncRouter = (data) => {
    let result = [];
    data.forEach(one => {
        // 先格式化子路由
        let formattedChildren = null;
        if (one.children != null && one.children instanceof Array) {
            formattedChildren = filterAsyncRouter(one.children);
		}
        let oneRouter = {
            path: one.route, 
            name: one.moduleName, 
            children: formattedChildren || [], 
			component: one.parentID === 1 ? Layout : (resolve) => require(['@/views/' + moduleMap[one.moduleName] + '.vue'], resolve),
			meta: {
				title: one.displayName,
				icon: one.moduleName
			}
		}
        result.push(oneRouter);
	})
    return result;
}


export default {
	namespaced: true,
	state,
	mutations,
	actions,
};