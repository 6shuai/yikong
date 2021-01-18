import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faCamera, faLocationArrow, faDownload, faExternalLinkAlt, faTrashAlt, faCaretDown, faMobileAlt, faFilm, faGamepad,
    faMapMarkerAlt, faPlay
} from '@fortawesome/free-solid-svg-icons'
import { faWeixin } from "@fortawesome/free-brands-svg-icons"
import { faBuilding, faWindowMaximize, faClock, faImage } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueDND from 'awe-dnd'
import BabelPolyfill from 'babel-polyfill'

Vue.use(BabelPolyfill)

library.add(
  faBuilding, faCamera, faLocationArrow, faWindowMaximize, faDownload, faExternalLinkAlt, faTrashAlt, faCaretDown, faImage, 
  faWeixin, faMobileAlt, faClock, faFilm, faGamepad, faMapMarkerAlt, faPlay
)
 
// <font-awesome-icon :icon="['fas', 'download']" />
// rotation="90"  旋转角度
// spin 旋转动画
Vue.component('font-awesome-icon', FontAwesomeIcon)


// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.use(VueDND)

Vue.config.productionTip = false;
Vue.prototype.$successCode = 0;    //接口返回code 0 成功

window.eventBus = new Vue();


/**
 * 按钮操作是否具有权限
 * @param auths
 * @param key
 */
function hasBtnPermission(auths, key) {
	if(auths && auths.length){
		return auths.includes(key);
	}else{
		return false;
	}
}

Vue.prototype.hasPerm = hasBtnPermission;


/**
 * 当前页面是否具有权限看到
 * @param name  路由name
 * @param key
 */
function hasPagePermission(name) {
  return new Promise((resolve) => {
    let has = false;
    store.state.permission.routesMenu.forEach(item => {
      if(item.name === name){
        has = true;
      }
    })
    if(has){
      resolve(true);
    }else{
      router.replace('/404');
      resolve(false);
    }
  })
}

Vue.prototype.hasPagePerm = hasPagePermission;



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
