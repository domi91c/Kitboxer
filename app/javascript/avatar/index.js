import Vue from 'vue/dist/vue.esm';
import TurbolinksAdapter from 'vue-turbolinks';
import Avatar from '../avatar/Avatar.vue';

document.addEventListener('DOMContentLoaded', () => {

  let el = document.querySelector('.js-avatar');
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'));

    new Vue({
      render: h => h(Avatar, { props }),
      mixins: [TurbolinksAdapter],
    }).$mount('.js-avatar');

  }
});

