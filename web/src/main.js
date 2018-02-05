import App from './components/app'
import Vue from 'vue'
import axios from 'axios'
import routes from './routes/routes'
import VueRouter from 'vue-router'
import store from './store/index'

Vue.prototype.axios = axios
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routes
})

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})