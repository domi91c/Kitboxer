import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createActionHelpers } from '../../vuex-loading'

const { startLoading, endLoading } = createActionHelpers({
  moduleName: 'loading',
})

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3009'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.herokuapp.com'
}

this.http = axios.create({
  baseURL: BASE_URL,
})

this.http.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appReady: false,
    tutorial: {
      errors: {},
      product_id: 0,
      steps: [{}],
    },
  },
  actions: {},
  mutations: {
    'SET_INITIAL_STATE': (state, { props }) => {
      state.conversations = props
    },
  },
  getters: {},
})

export default store