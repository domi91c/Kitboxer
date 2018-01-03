import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import TurbolinksAdapter from 'vue-turbolinks'
import TutorialEditor from '../tutorial-editor/TutorialEditor.vue'
import store from './store/index'

Vue.use(BootstrapVue)

document.addEventListener('DOMContentLoaded', () => {
  let el = document.querySelector('.js-tutorial-editor')
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'))
    new Vue({
      render: h => h(TutorialEditor, { props }),
      store,
      mixins: [TurbolinksAdapter],
    }).$mount(el)
  }
})

