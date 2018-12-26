import Vue from 'vue'
import TurbolinksAdapter from 'vue-turbolinks'
import BootstrapVue from 'bootstrap-vue'
import Messaging from './Messaging.vue'
// import VeeValidate from 'vee-validate'
// import VueLoading from '../vuex-loading'
// import HideBeforeLoad from '../shared/hide-before-load.js'
// import store from './store/index.js'

Vue.use(TurbolinksAdapter)
Vue.use(BootstrapVue)
// Vue.use(VeeValidate)
// Vue.use(VueLoading)
// Vue.use(HideBeforeLoad)

$(document).on('ready', function() {
  let el = document.querySelector('.v-messaging')
  document.querySelector('#launch-messages-modal').click()
  document.querySelector('#test-conversations-tab').click()

  if (el) {
    const props = JSON.parse(el.getAttribute('data'))
    console.dir(props)
    // store.commit('SET_INITIAL_STATE', { props: props.conversations })
    new Vue({
      render: h => h(Messaging)
      // store,
      // vueLoading: new VueLoading({ useVuex: true })
    }).$mount(el)
  }
})
$(document).on('show.bs.tab', function(e) {
  let el = document.querySelector('.v-messaging')
  if (el) {
    const props = JSON.parse(el.getAttribute('data'))
    console.dir(props)
    // store.commit('SET_INITIAL_STATE', { props: props.conversations })
    new Vue({
      render: h => h(Messaging)
      // store,
      // vueLoading: new VueLoading({ useVuex: true })
    }).$mount(el)
  }
})
