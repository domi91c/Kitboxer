import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import HideBeforeLoad from './hide-before-load.js'
import NumberField from '../NumberField.vue'
import BootstrapVue from 'bootstrap-vue'

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('number-field')) {
    new Vue({
      el: '#number-field',
      components: { NumberField },
    })

    Vue.use(TurbolinksAdapter)
    Vue.use(BootstrapVue)
    // Vue.use(HideBeforeLoad)
  }
})
