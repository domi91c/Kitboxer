/* eslint no-console:0 */
import Vue from 'vue/dist/vue.esm';
import App from './app.vue';
import TurbolinksAdapter from 'vue-turbolinks';
import VueResource from 'vue-resource';

Vue.use(VueResource);

document.addEventListener('turbolinks:load', function() {
  Vue.http.headers.common['X-CSRF-Token'] = document.querySelector(
      'meta[name="csrf-token"]').getAttribute('content');

  let imageUploadEl = document.getElementById('image_upload');
  if (imageUploadEl !== null) {
    console.log(imageUploadEl);
    let props = JSON.parse(imageUploadEl.getAttribute('data'));
    console.log('props:');
    console.dir(props);
    new Vue({
      render: h => h(App, { props }),
      mixins: [TurbolinksAdapter],
    }).$mount(imageUploadEl);
  }
});
