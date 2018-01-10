import Vue from 'vue'
import Vuex from 'vuex'
import product from './product'
import tutorial from './tutorial'
import steps from './steps'
import images from './images'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    product,
    tutorial,
    steps,
    images,
  },
})
export default store