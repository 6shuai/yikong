import { userLogin, userLogout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
	token: getToken(),
	name: "",
	avatar: "",
	loginData: localStorage.loginData ? JSON.parse(localStorage.loginData) : {},
};

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_LOGIN_DATA: (state, data) => {
		state.loginData = data;
	},
};

const actions = {
	// user login
	login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
		userLogin(userInfo)
			.then((response) => {
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
