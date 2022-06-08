import { userLogin, userLogout, organizationListProject } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { reject } from "core-js/fn/promise";

const state = {
	token: getToken(),
	name: "",
	avatar: "",
	loginData: localStorage.loginData ? JSON.parse(localStorage.loginData) : {},

	// 主页数据
	homePageData: [],

	// 选择的主页
	currentRoleHomePageData: [],

	// 场所列表
	placeData: [],

	// 价格体系列表
	priceTypeData: [],

	// 品牌列表
	brandData: undefined,

	// 点击头像  主页显示选择角色
	clickAvatarCount: 0
};

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_LOGIN_DATA: (state, data) => {
		state.loginData = data;
	},

	SET_BRAND_DATA: (state, data) => {
		state.brandData = data
	}
};

const actions = {
	// user login
	login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			userLogin(userInfo).then((response) => {
				localStorage.clear();
				commit("SET_TOKEN", response.obj.username);
				commit("SET_LOGIN_DATA", response.obj);
				setToken(response.obj.username);
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
		});
	},

  	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
		userLogout()
			.then(() => {
			commit("SET_TOKEN", "");
			localStorage.clear();
			removeToken();
			resetRouter();
			resolve();
			})
			.catch((error) => {
			reject(error);
			});
		});
	},

  	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			commit("SET_TOKEN", "");
			removeToken();
			resolve();
		});
	},


	// 获取品牌列表
	getBrandList({ commit, state }){
		return new Promise((resolve, reject) => {
			if(state.brandData){
				resolve(state.brandData)
			}else{
				organizationListProject().then(res => {
					commit('SET_BRAND_DATA', res.obj)
					resolve(res.obj)	
				})
			}
		}).catch((error) => {
			reject([])
		})
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
