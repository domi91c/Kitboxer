/* eslint no-console:0 */
import Vue from 'vue/dist/vue.esm';
import ImageUploader from './ImageUploader.vue';
// import Counter from 'Counter.vue';
import TurbolinksAdapter from 'vue-turbolinks';

document.addEventListener('turbolinks:load', function() {

  let imageUploaderEl = document.getElementById('image-uploader');
  let counterEl = document.getElementById('counter');
  // if (counterEl !== null) {
  //   new Vue({
  //     render: h => h(ImageUploader, { props }),
  //     mixins: [TurbolinksAdapter],
  //   }).$mount(imageUploaderEl);
  // }
  if (imageUploaderEl !== null) {
    console.log(imageUploaderEl);
    let props = JSON.parse(imageUploaderEl.getAttribute('data'));
    console.log('props:');
    console.dir(props);
    new Vue({
      render: h => h(ImageUploader, { props }),
      mixins: [TurbolinksAdapter],
    }).$mount(imageUploaderEl);
  }
});

