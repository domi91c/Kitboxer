import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks'
import BootstrapVue from 'bootstrap-vue'
import TutorialEditor from './TutorialEditor.vue'
import VeeValidate from 'vee-validate'
import VueLoading from '../vuex-loading'
import HideBeforeLoad from '../shared/hide-before-load.js'
import store from './store'

Vue.use(TurbolinksAdapter)
Vue.use(BootstrapVue)
Vue.use(VeeValidate);
Vue.use(VueLoading)
Vue.use(HideBeforeLoad)


document.addEventListener('turbolinks:load', () => {
  let el = document.querySelector('.v-tutorial-editor')
  if (el) {
    const props = JSON.parse(el.getAttribute('data'))
    console.dir(props)
    store.commit('SET_INITIAL_STATE', { props: props.tutorial })

    new Vue({
      render: h => h(TutorialEditor),
      store,
      vueLoading: new VueLoading({ useVuex: true }),
    }).$mount(el)

    $('.js-submit-tutorial').click(() => {
      store.dispatch('submitTutorial')
    })
  }
})
