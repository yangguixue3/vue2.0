import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import httpRequest from '@/utils/httpRequest'
// import { Message } from 'element-ui'

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
// Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
