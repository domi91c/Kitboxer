import Vue from 'vue'
import TestApp from './TestApp.vue'
import TurbolinksAdapter from 'vue-turbolinks'
import { store } from './store/index.js'

Vue.use(TurbolinksAdapter)

document.addEventListener('turbolinks:load', function() {
  let el = document.querySelector('.v-test-app')
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'))
    store.commit('SET_INITIAL_STATE', { props })
    new Vue({
      render: h => h(TestApp, { props }),
      store
    }).$mount(el);
  }
});

