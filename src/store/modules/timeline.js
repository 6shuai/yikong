const state = {
    dragData: {},               //资源选择 ， 正在拖拽的资源数据
    screenLayoutData: [],       //资源布局 数据
}

const mutations = {
    SET_DRAG_DATA: (state, data) => {
        state.dragData = data
    },

    SET_SCREEN_LAYOUT_DATA: (state, data) => {
        state.screenLayoutData = data
    },
}

const actions = {
    //拖拽的数据
    setDragData({ commit }, data) {
        commit('SET_DRAG_DATA', data);
    },

    setScreenLayoutData({ commit }, data) {
        commit('SET_SCREEN_LAYOUT_DATA', data);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
