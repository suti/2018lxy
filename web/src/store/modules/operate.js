import { getCanvasData } from './canvasData'

const state = {
  focusElemIndex: -1,
}

const getters = {
  getFocusElemIndex:
    state => state.focusElemIndex,
  getFocusElemJson:
    state => state.focusElemIndex > -1
      ? getCanvasData().data.elements[state.focusElemIndex]
      : null,
}

const mutations = {
  setFocusElemIndex (state, index) {
    state.focusElemIndex = index
  },
}

const actions = {
  setFocusElemIndex ({commit}, index) {
    commit('setFocusElemIndex', index)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}