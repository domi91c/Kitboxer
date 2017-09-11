import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import Lightbox from '../lightbox/Lightbox.vue'

document.addEventListener('DOMContentLoaded', () => {
  let el = document.querySelector('.js-lightbox')
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'))

    new Vue({
      render: h => h(Lightbox, { props }),
      mixins: [TurbolinksAdapter],
    }).$mount(el)

  }
})
