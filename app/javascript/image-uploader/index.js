import Vue from 'vue'
import HideBeforeLoad from '../shared/hide-before-load.js'
import TurbolinksAdapter from 'vue-turbolinks'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ImageUploader from './ImageUploader.vue'

Vue.use(TurbolinksAdapter)
Vue.use(BootstrapVue)
Vue.use(HideBeforeLoad)

document.addEventListener('turbolinks:load', () => {
  let el = document.querySelector('.js-image-uploader')
  if (el) {
    const props = JSON.parse(el.getAttribute('data'))
    new Vue({
      render: h => h(ImageUploader, { props }),
    }).$mount(el);
  }
});

