import Vue from 'vue/dist/vue.esm';
import TurbolinksAdapter from 'vue-turbolinks';
import GuideEditor from '../guide-editor/GuideEditor.vue';

document.addEventListener('DOMContentLoaded', () => {
  let el = document.querySelector('.js-guide-editor');
  if (el !== null) {
    const props = JSON.parse(el.getAttribute('data'));

    new Vue({
      render: h => h(GuideEditor, { props }),
      mixins: [TurbolinksAdapter],
    }).$mount(el);

  }
});