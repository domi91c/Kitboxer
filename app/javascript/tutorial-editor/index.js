import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks'
import TutorialEditor from '../tutorial-editor/TutorialEditor.vue'
import VueLoading from '../vuex-loading'
import store from './store'

Vue.use(VueLoading)

document.addEventListener('DOMContentLoaded', () => {
  let el = document.querySelector('.js-tutorial-editor')
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'))
    console.dir(props)
    store.commit('SET_INITIAL_STATE', { props })

    new Vue({
      render: h => h(TutorialEditor, { props }),
      store,
      mixins: [TurbolinksAdapter],
      vueLoading: new VueLoading({ useVuex: true }),
    }).$mount(el)

    $('.js-submit-tutorial').click(() => {
      store.dispatch('submitTutorial')
    })
  }
})
