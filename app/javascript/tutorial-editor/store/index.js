import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createActionHelpers } from '../../vuex-loading'

const { startLoading, endLoading } = createActionHelpers({
  moduleName: 'loading'
})

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3009'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.herokuapp.com'
}

let http = axios.create({
  baseURL: BASE_URL
})

http.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
  'meta[name="csrf-token"]').getAttribute('content')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appReady: false,
    tutorial: {
      errors: {},
      product_id: 0,
      steps: [{}]
    }
  },
  actions: {
    'UPLOAD_IMAGE': function({ commit, dispatch }, { step, image }) {
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial/steps/${step.id}/images`
      const formData = new FormData()
      formData.append('image[attachment]', image)
      startLoading(dispatch, `upload image ${step.id}`)
      return axios.post(url, formData).then(res => {
        endLoading(dispatch, `upload image ${step.id}`)
        commit('ADD_IMAGE', { step: step, image: res.data })
      }).catch(err => {
        endLoading(dispatch, `upload image ${step.id}`)
        console.log(err)
      })
    },
    'CROP_IMAGE': function({ commit, dispatch }, { step, image, cropData }) {
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial/steps/${step.id}/images/${image.id}`
      const formData = new FormData()
      formData.append('image[crop_x]', cropData['x'])
      formData.append('image[crop_y]', cropData['y'])
      formData.append('image[crop_width]', cropData['width'])
      formData.append('image[crop_height]', cropData['height'])
      startLoading(dispatch, `crop image ${image.id}`)
      return axios.patch(url, formData).then(res => {
        endLoading(dispatch, `crop image ${image.id}`)
        commit('UPDATE_IMAGE',
          {
            step: step,
            oldImage: image,
            newImage: res.data.image
          })
      }).catch(err => {
        endLoading(dispatch, `crop image ${image.id}`)
        console.log(err)
      })
    },
    'DELETE_IMAGE': function({ commit }, { step, image }) {
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial/steps/${step.id}/images/${image.id}`
      return axios.delete(url).then(() => {
        commit('REMOVE_IMAGE', {
          step: step, image: image
        })
      }).catch(err => {
        console.log(err)
      })
    },
    addStep({ commit }) {
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial/steps/`
      return axios.post(url, {
        step: {
          body: '',
          title: '',
          number: this.state.tutorial.steps[this.state.tutorial.steps.length -
          1].number + 1
        }
      }).then(res => {
        commit('ADD_STEP', res.data)
      }).catch(err => console.log(err))
    },
    deleteStep({ commit }, step) {
      // if (this.state.tutorial.steps.length <= 1) return
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial/steps/${step.id}`
      return axios.delete(url).then(res => {
        commit('REMOVE_STEP', step)
      }).catch(err => console.log())
    },
    submitTutorial({ commit, dispatch }) {
      const url = `${BASE_URL}/products/${this.state.tutorial.product_id}/tutorial`
      startLoading(dispatch, `submitting tutorial`)
      return axios.patch(url, { tutorial: this.state.tutorial }).then(res => {
        endLoading(dispatch, `submitting tutorial`)
        Turbolinks.visit('/products/' + this.state.productId + '/')

      }).catch(err => {
        console.log(err)
      })
    }
  },
  mutations: {
    'APP_READY': (state) => {
      state.appReady = true
    },
    'APP_STOPPED': (state) => {
      state.appReady = false
    },
    'SET_INITIAL_STATE': (state, { props }) => {
      state.tutorial = props
      state.productId = props.product_id
    },
    'ADD_IMAGE': (state, { step, image }) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      state.tutorial.steps[stepIdx].images.push(image)
    },
    'UPDATE_IMAGE': (state, { step, oldImage, newImage }) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      let imageIdx = state.tutorial.steps[stepIdx].images.indexOf(oldImage)
      state.tutorial.steps[stepIdx].images.splice(imageIdx, 1, newImage)
    },
    'REMOVE_IMAGE': (state, { step, image }) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      let imageIdx = state.tutorial.steps[stepIdx].images.indexOf(image)
      state.tutorial.steps[stepIdx].images.splice(imageIdx, 1)
    },
    'ADD_STEP': (state, step) => {
      state.tutorial.steps.push(step)
    },
    'UPDATE_STEP_TITLE': (state, { title, step }) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      state.tutorial.steps[stepIdx].title = title
    },
    'UPDATE_STEP_BODY': (state, { body, step }) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      state.tutorial.steps[stepIdx].body = body
    },
    'REMOVE_STEP': (state, step) => {
      let stepIdx = state.tutorial.steps.indexOf(step)
      state.tutorial.steps.splice(stepIdx, 1)
    }
  },

  getters: {
    errors: state => state.tutorial.errors,
    productId: state => state.tutorial.product_id,
    tutorial: state => state.tutorial,
    steps: state => {
      return state.tutorial.steps.sort(
        (a, b) => {
          return a.number - b.number
        })
    },
    getStepById: (state, getters) => (id) => {
      return state.tutorial.steps.find(step => step.id === id)
    },
    appReady: (state) => state.appReady
  }
})

export default store
