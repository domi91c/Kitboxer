import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tutorial: {
      steps: [],
    },
  },
  actions: {
    initialLoad() {
    },
  },
  mutations: {
    SET_INITIAL_STATE: (state, { props }) => {
      state.tutorial = props.tutorial
    },
  },
})