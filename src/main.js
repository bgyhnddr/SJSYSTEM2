import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { configRouter } from './vue-router/route-config'
import { disableHistoryBack } from './extend/disable-history-back'

disableHistoryBack()



window.state = {
  userInfo: { name: "", permissions: [] },
  showLoginModal: false
}

window.actions = {
  logout: function () {
    window.state.userInfo = { name: "", permissions: [] }
  }
}
/* eslint-disable no-new */
Vue.use(VueRouter)

const router = new VueRouter({
  saveScrollPosition: true,
  transitionOnLoad: true
})

configRouter(router)

router.beforeEach((tran) => {
  tran.next();
})

router.start(App, 'app');
