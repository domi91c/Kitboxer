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
    steps: {},
  },
  actions: {
    UPLOAD_IMAGE: function({ commit }, { product, image, step }) {
      const url = `${BASE_URL}/products/${product.id}/tutorial/images.json`
      const formData = new FormData()
      formData.append('image[image]', image)
      formData.append('image[step_id]', step.id)
      return axios.post(url, formData)
                  .then(response => {
                    commit('SET_IMAGE',
                        { step: step, image: response.data.image })
                  })
                  .catch((error) => {
                    console.log(error)
                  })
    },
  },
  mutations: {
    SET_IMAGE: (state, { step, image }) => {
      state.steps.images.push(image)
    },
  },
  getters: {},
}
