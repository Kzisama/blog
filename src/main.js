import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/normailze.css'
import './style/icon/iconfont.css'

Vue.use(ElementUI)

Vue.prototype.$host = 'http://127.0.0.1:3007'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
