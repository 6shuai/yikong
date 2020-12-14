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

	'Games': 'games/index',                               //游戏管理

	'Timeline': 'timeline/index',                         //时间轴  

	'Log': 'log/index',									  //操作日志

	'Layout': 'screenLayout/index',						  //屏幕布局 模板
	
	'Authority': 'system/authority/index',                //权限管理
	'Role': 'system/role/index',						  //角色管理
	'Member': 'system/member/index',				      //成员管理
	'Organization': 'system/organizations/index',		  //品牌列表
	'OrganizationType': 'system/organizationType/index',  //组织类型列表
	'User': 'user/Center',							      //个人中心
	'BasicRole': 'system/basicRole/index',			      //基础角色管理
	'ResAuthority': 'system/resAuthority/index',		  //资源权限管理
	'ResRole': 'system/resRole/index',			      	  //资源角色管理
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
				icon: one.moduleName,
				permission: getUserPerm(one.subContent),
			}
		}

		if(one.route == '/timeline/index'){
			state.timelinePrem = oneRouter.meta.permission;
		}else if(one.route == '/games/index'){
			state.gamesPrem = oneRouter.meta.permission;
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