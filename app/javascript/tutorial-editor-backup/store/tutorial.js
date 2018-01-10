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
    tutorial: {},
  },
  actions: {
    LOAD_TUTORIAL: ({ commit }, { product }) => {
      const url = `${BASE_URL}/products/${product.id}/tutorial.json`
      return axios.get(url)
                  .then((response) => {
                    commit('SET_TUTORIAL', { tutorial: response.data })
                  }, (err) => {
                    console.log(err)
                  })
    },
  },
  mutations: {
    SET_TUTORIAL: (state, { tutorial }) => state.tutorial = tutorial,
  },
  getters: {
    tutorial: state => state.tutorial,
    steps: state => state.tutorial.steps,
  },
}
