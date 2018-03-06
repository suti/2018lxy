import Vue from 'vue'
import Vuex from 'vuex'
import canvaData from './modules/canvaData'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    canvaData
  },
})
