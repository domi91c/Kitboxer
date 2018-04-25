import Vue from 'vue'
import HideBeforeLoad from '../shared/hide-before-load.js'
import TurbolinksAdapter from 'vue-turbolinks'
import BootstrapVue from 'bootstrap-vue'
import TutorialEditor from './TutorialEditor.vue'
import VueLoading from '../vuex-loading'
import store from './store'

Vue.use(TurbolinksAdapter)
Vue.use(BootstrapVue)
Vue.use(VueLoading)
Vue.use(HideBeforeLoad)

document.addEventListener('turbolinks:load', () => {
  let el = document.querySelector('.js-tutorial-editor')
  if (el) {
    const props = JSON.parse(el.getAttribute('data'))
    store.commit('SET_INITIAL_STATE', { props })

    new Vue({
      render: h => h(TutorialEditor, { props }),
      store,
      vueLoading: new VueLoading({ useVuex: true }),
    }).$mount(el)

    $('.js-submit-tutorial').click(() => {
      store.dispatch('submitTutorial')
    })
  }
})
