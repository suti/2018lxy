import app from './components/app'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.axios = axios

const main = new Vue({
  el: '#app',
  render: h => h(app),
})