import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue'
import App from '../app.vue'
import NumberField from '../NumberField.vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(TurbolinksAdapter)
Vue.use(BootstrapVue)

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('number-field')) {
    const app = new Vue({
      el: '#number-field',
      data: {
        message: 'Can you say hello?',
      },
      components: { App, NumberField },
    })
  }
})
