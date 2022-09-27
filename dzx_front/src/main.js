import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './until/http'

Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
import { Toast } from 'vant';
import BaiduMap from 'vue-baidu-map'

Vue.use(Toast);
Vue.use(Vant);
Vue.use(BaiduMap,{ak:'PYwrQ1BnS3KEYSbhoGEjvjVPaYyxGsS1'})

Vue.prototype.$Toast = Toast
Vue.prototype.$http = http

var vm = new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')

export default vm