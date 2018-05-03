import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import store from './index.js'

let baseUrl = ''
if (window.environment === 'development') {
  baseUrl = 'http://localhost:3009'
} else if (window.environment === 'production') {
  baseUrl = 'https://www.kitboxer.herokuapp.com'
}

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

let http = axios.create({
  baseURL: function() {
    return `baseUrl/products/${store.state.productId}`
  },
})

export default http
