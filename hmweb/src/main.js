import App from './app'
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.prototype.axios = axios

axios.interceptors.request.use(request => {
  if (request.method == 'post' || request.method == 'POST')
    request.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  request.transformRequest = [
    function (data) {
      if (data instanceof FormData) return data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }]
  return request
})

Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routes,
})

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
})