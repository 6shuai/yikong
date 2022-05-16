import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, classicMode } = defaultSettings

const state = {
	showSettings: showSettings,
	tagsView: tagsView,
	fixedHeader: fixedHeader,
	sidebarLogo: sidebarLogo,
	classicMode: classicMode
}

const mutations = {
	CHANGE_SETTING: (state, { key, value }) => {
		if (state.hasOwnProperty(key)) {
		state[key] = value
		}
	},

	SET_SHOW_MENU: (state, data) => {
		state.classicMode = data
		localStorage.classicMode = data
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

