import axios from 'axios'

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3002'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.com'
}

function uploadImage(formData, product) {
  const url = `${BASE_URL}/products/${product.id}/tutorial/images`
  return axios.post(url, formData).then(x => {
    return JSON.parse(x.request.response)
  }).catch((error) => {
    console.log(error)
  })
}

export { uploadImage }
