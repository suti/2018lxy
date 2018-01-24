import app from './components/app'
import vue from 'vue'

const main = new vue({
  el: '#app',
  render: h => h(app),
})