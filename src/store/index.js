import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import user from './modules/user'
import timeline from './modules/timeline'
import game from './modules/game'
import project from './modules/project'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    tagsView,
    user,
    timeline,
    game,
    project
  },
  getters
})

export default store
