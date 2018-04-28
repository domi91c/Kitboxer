import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import NumberField from '../NumberField.vue'
import BootstrapVue from 'bootstrap-vue'

document.addEventListener('turbolinks:load', () => {
  if (document.querySelector('[data-behavior="vue"]')) {
    new Vue({
      el: '[data-behavior="vue"]',
      components: { NumberField },
    })
    Vue.use(TurbolinksAdapter)
    Vue.use(BootstrapVue)
  }
})
