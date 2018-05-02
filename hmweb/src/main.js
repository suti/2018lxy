import App from './app'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.axios = axios

const app = new Vue({
  el: '#app',
  render: h => h(App),
})