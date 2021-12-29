const state = {
    dragData: {},               //内容选择 ， 正在拖拽的内容数据
    screenLayoutData: [],       //内容布局 数据
    screenSize: {},             //屏幕尺寸  真实宽高
}

const mutations = {
    SET_DRAG_DATA: (state, data) => {
        state.dragData = data
    },

    SET_SCREEN_LAYOUT_DATA: (state, data) => {
        state.screenLayoutData = data
    },

    SET_SCREEN_SIZE: (state, data) => {
        state.screenSize = data;
    }
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
