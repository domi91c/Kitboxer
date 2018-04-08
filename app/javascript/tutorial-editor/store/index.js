import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createActionHelpers } from '../../vuex-loading'

const { startLoading, endLoading } = createActionHelpers({
  moduleName: 'loading',
})

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
  },
  actions: {
    'UPLOAD_IMAGE': function({ commit, dispatch }, { step, image }) {
      const url = `${BASE_URL}/products/${this.state.product.id}/tutorial/images`
      const formData = new FormData()
      formData.append('image[image]', image)
      formData.append('image[step_id]', step.id)
      startLoading(dispatch, `upload image ${step.id}`)
      return axios.post(url, formData)
                  .then(res => {
                    endLoading(dispatch, `upload image ${step.id}`)
                    commit('ADD_IMAGE', { step: step, image: res.data })
                  })
                  .catch(err => {
                    endLoading(dispatch, `upload image ${step.id}`)
                    console.log(err)
                  })
    },
    'CROP_IMAGE': function({ commit, dispatch }, { step, image, cropData }) {
      const url = `${BASE_URL}/products/${this.state.product.id}/tutorial/images/${image.id}`
      const formData = new FormData()
      formData.append('image[crop_data]', JSON.stringify(cropData))
      formData.append('image[step_id]', step.id)
      startLoading(dispatch, `crop image ${image.id}`)
      return axios.patch(url, formData)
                  .then(res => {
                    endLoading(dispatch, `crop image ${image.id}`)
                    commit('UPDATE_IMAGE',
                        {
                          step: step,
                          oldImage: image,
                          newImage: res.data.image,
                        })
                  })
                  .catch(err => {
                    endLoading(dispatch, `crop image ${image.id}`)
                    console.log(err)
                  })
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