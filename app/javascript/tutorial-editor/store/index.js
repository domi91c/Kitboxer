import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3002'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.com'
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    product: {},
    tutorial: {},
    steps: [],
  },
  actions: {
    UPLOAD_IMAGE: function({ commit }, { product, step, image }) {
      const url = `${BASE_URL}/products/${product.id}/tutorial/images`
      const formData = new FormData()
      formData.append('image[image]', image)
      formData.append('image[step_id]', step.id)
      return axios.post(url, formData)
                  .then(response => {
                    commit('ADD_IMAGE',
                        { step: step, image: response.data })
                  })
                  .catch((err) => {
                    console.log(err)
                  })
    },
    DELETE_IMAGE: function(
        { commit }, { product, stepIndex, imageIndex, image }) {
      const url = `${BASE_URL}/products/${product.id}/tutorial/images/${image.id}`
      return axios.delete(url)
                  .then(response => {
                    commit('REMOVE_IMAGE', {
                      stepIndex: stepIndex, imageIndex: imageIndex,
                    })
                  })
                  .catch(err => {
                    console.log(err)
                  })
    },
  },
  mutations: {
    SET_INITIAL_STATE: (state, { props }) => {
      state.product = props.product.product
      state.tutorial = props.tutorial.tutorial
    },
    ADD_IMAGE: (state, { step, image }) => {
      let stepIndex = state.tutorial.steps.indexOf(step)
      state.tutorial.steps[stepIndex].images.push(image)
    },
    REMOVE_IMAGE: (state, { stepIndex, imageIndex }) => {
      state.tutorial.steps[stepIndex].images.splice(imageIndex, 1)
    },
  },

  getters: {
    product: state => state.product,
    tutorial: state => state.tutorial,
    steps: state => state.tutorial.steps,
  },
})

export default store