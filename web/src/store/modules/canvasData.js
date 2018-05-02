const state = {
  data: {
    width: 800,
    height: 600,
    elements: [],
  },
  canvasScale: 1,
}

const getters = {
  getCanvasData: state => state.data,
  getCanvasScale: state => state.canvasScale,
}

const mutations = {
  setCanvasData (state, data) {
    state.data = data
  },
  setCanvasScale (state, data) {
    state.canvasScale = data
  },
}

const actions = {
  setCanvasData ({commit}, data) {
    commit('setCanvasData', data)
  },
  setCanvasScale ({commit}, data) {
    commit('setCanvasScale', data)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}

export function getCanvasData () {
  return state
}