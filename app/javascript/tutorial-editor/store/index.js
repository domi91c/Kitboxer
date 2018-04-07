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
    uploadLoading: false,
  },
  actions: {
    'START_UPLOAD': function({ commit }) {
      console.log('STARTING UPLOAD')
    },
    'UPLOAD_IMAGE': function({ commit, dispatch }, { step, image }) {
      const url = `${BASE_URL}/products/${this.state.product.id}/tutorial/images`
      const formData = new FormData()
      formData.append('image[image]', image)
      formData.append('image[step_id]', step.id)
      dispatch('START_UPLOAD')
      return axios.post(url, formData)
                  .then(res => {
                    commit('ADD_IMAGE',
                        { step: step, image: res.data })
                    dispatch('FINISH_UPLOAD')
                  })
                  .catch(err => {
                    console.log(err)
                    dispatch('FINISH_UPLOAD')
                  })
    },
    'FINISH_UPLOAD': function({ commit }) {
      console.log('FINISHING UPLOAD')
    },
    'START_CROP': function({ commit }) {
      console.log('STARTING CROP')
    },
    'CROP_IMAGE': function({ commit, dispatch }, { step, image, cropData }) {
      const url = `${BASE_URL}/products/${this.state.product.id}/tutorial/images/${image.id}`
      const formData = new FormData()
      formData.append('image[crop_data]', JSON.stringify(cropData))
      formData.append('image[step_id]', step.id)
      dispatch('START_CROP')
      return axios.patch(url, formData)
                  .then(res => {
                    commit('UPDATE_IMAGE',
                        {
                          step: step,
                          oldImage: image,
                          newImage: res.data.image,
                        })
                    dispatch('FINISH_CROP')
                  })
                  .catch(err => {
                    console.log(err)
                    dispatch('FINISH_CROP')
                  })
    },
    'FINISH_CROP': function({ commit }) {
      console.log('FINISHING CROP')
    },
    'DELETE_IMAGE': function(
        { commit }, { step, image }) {
      const url = `${BASE_URL}/products/${this.state.product.id}/tutorial/images/${image.id}`
      return axios.delete(url)
                  .then(response => {
                    commit('REMOVE_IMAGE', {
                      step: step, image: image,
                    })
                  })
                  .catch(err => {
                    console.log(err)
                  })
    },
  },
  mutations: {
    'SET_INITIAL_STATE': (state, { props }) => {
      state.product = props.product.product
      state.tutorial = props.tutorial.tutorial
    },
    'ADD_IMAGE': (state, { step, image }) => {
      let stepIndex = state.tutorial.steps.indexOf(step)
      state.tutorial.steps[stepIndex].images.push(image)
    },
    'UPDATE_IMAGE': (state, { step, oldImage, newImage }) => {
      let stepIndex = state.tutorial.steps.indexOf(step)
      let imageIndex = state.tutorial.steps[stepIndex].images.indexOf(oldImage)
      state.tutorial.steps[stepIndex].images.splice(imageIndex, 1, newImage)
    },
    'REMOVE_IMAGE': (state, { step, image }) => {
      let stepIndex = state.tutorial.steps.indexOf(step)
      let imageIndex = state.tutorial.steps[stepIndex].images.indexOf(image)
      state.tutorial.steps[stepIndex].images.splice(imageIndex, 1)
    },
  },

  getters: {
    product: state => state.tutorial.product,
    tutorial: state => state.tutorial,
    steps: state => state.tutorial.steps,
    getStepById: (state, getters) => (id) => {
      state.tutorial.steps.find(step => step.id === id)
    },
  },
})

export default store