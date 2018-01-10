import axios from 'axios'

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3002'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.com'
}

export default {
  state: {
    product: null,
  },

  actions: {},

  mutations: {
    SET_INITIAL_STATE: (state, { props }) => {
      state.product = props.product.product
      state.tutorial = props.tutorial.tutorial
    },
  },

  getters: {
    product: state => state.product,
  },

}