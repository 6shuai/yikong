import { userLogin, userLogout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
	// 项目详情
	projectDetail: {},

	// 项目 合同详情
	projectContractDetail: {},

    // 锁位列表 再次预约 订单数据
    againReserveData: undefined,

    // 寻位选择的播放规则
    playRuleData: undefined
}

const mutations = {

}

const actions = {
    setAgainReserveData({ commit, state }, data) {
        state.againReserveData = data
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
