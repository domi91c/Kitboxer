// import Vue from 'vue/dist/vue.esm'
// import Buefy from 'buefy'
// import TurbolinksAdapter from 'vue-turbolinks'
// import 'buefy/lib/buefy.css'

import Cereal from "../models/cereal"


document.addEventListener('turbolinks:load', () => {
  // if (document.querySelector('[data-behavior="vue"]')) {
  //   new Vue({
  //     el: '[data-behavior="vue"]',
  //   })
  //   Vue.use(TurbolinksAdapter)
  //   Vue.use(Buefy)
  // }
  console.log('testing cereal...')
  let testJson = '{"id":2621,"created_at":"2018-10-16T03:19:37.295Z","updated_at":"2018-10-16T03:19:37.437Z","image":null,"product_id":null,"cover_image":null,"step_id":null,"imageable_id":null,"imageable_type":null,"images":null,"url":"http://localhost:3002/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBUZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2eae62b4594aba1bcfdfbd1ea5cc90e605a54a90/kZe7iBUZXyba7UpGaQ_0azlRYYWwb9IaL4nTPS2e75Y.jpg","processed_url":null,"original_url":"http://localhost:3002/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBUZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2eae62b4594aba1bcfdfbd1ea5cc90e605a54a90/kZe7iBUZXyba7UpGaQ_0azlRYYWwb9IaL4nTPS2e75Y.jpg"}'

  let cereal = new Cereal(testJson)
  let image = cereal.object

  console.log(image)
})
