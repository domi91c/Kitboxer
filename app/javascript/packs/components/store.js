import Vue from 'vue';
import Vuex from 'vuex';
// Import additional stores here

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {},
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
  state: {
    users:
        [
          { id: 1, name: 'Dominic' },
          { id: 2, name: 'Charles' },
        ]
    ,
  });