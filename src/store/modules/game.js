const state = {
    details: {}
}

const mutations = {
    SET_GAME_DETAIL_DATA: (state, data) => {
        state.details = data
    }
}

const actions = {
    //游戏详情
    setGameDetail({ commit }, data) {
        commit('SET_GAME_DETAIL_DATA', data);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
