import Vue from 'vue'
import Vuex from 'vuex'
import steps from './steps'
import images from './images'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0,
    images: images.state,
    steps: steps.state,
  },
  getters: {
    counter: state => state.counter,
  },
  mutations: {
    increment: (state, payload) => {
      return state.counter += payload
    },
    decrement: (state, payload) => {
      return state.counter -= payload
    },
  },
  actions: {
    increment: ({ commit }, payload) => {
      commit('increment', payload.value)
    },
    decrement: ({ commit }, payload) => {
      commit('decrement', payload.value)
    },
  },
})