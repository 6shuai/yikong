import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, showMenu } = defaultSettings

const state = {
	showSettings: showSettings,
	tagsView: tagsView,
	fixedHeader: fixedHeader,
	sidebarLogo: sidebarLogo,
	showMenu: showMenu
}

const mutations = {
	CHANGE_SETTING: (state, { key, value }) => {
		if (state.hasOwnProperty(key)) {
		state[key] = value
		}
	},

	SET_SHOW_MENU: (state, data) => {
		state.showMenu = data
		localStorage.showMenu = data
	}
}

const actions = {
	changeSetting({ commit }, data) {
		commit('CHANGE_SETTING', data)
	}
}


/* 是否显示logo组件 */
/* this.$store.dispatch('settings/changeSetting', {
	key: 'sidebarLogo',
	value: val
}) */

export default {
	namespaced: true,
	state,
	mutations,
	actions
}

