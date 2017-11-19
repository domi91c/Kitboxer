import * as axios from 'axios'

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3001'
} else if (window.environment === 'production') {
  BASE_URL = 'http://138.197.153.164'
}

function loadAvatar(memberId) {
  const url = `${BASE_URL}/avatars`
  return axios.get(url, { params: { user_id: memberId } })
              .then((x) => {
                return x
              })
              .catch(function(error) {
                console.log(error)
              })
}

function uploadAvatar(formData) {
  const url = `${BASE_URL}/avatars`
  return axios.post(url, formData).then(x => {
    return JSON.parse(x.request.response)
  }).catch((error) => {
    console.log(error)
  })
}

export { loadAvatar, uploadAvatar }
