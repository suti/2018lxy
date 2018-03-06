const state = {
  data: {
    width: 400,
    height: 400,
    elements: [],
  },
}

const getters = {
  getCanvaData: state => state.data,
}

const mutations = {
  setCanvaData (state, data) {
    state.data = data
  },
}

const actions = {
  setCanvaData ({commit}, data) {
    commit('setCanvaData', data)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}