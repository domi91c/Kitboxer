import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);


const BASE_URL = 'http://localhost:3008';

function uploadImage(image, listingId) {
  // POST /someUrl
  return Vue.http.post(BASE_URL + `/listings/${listingId}/images`, image ).
      then(response => {
        return response;

      }, response => {
        // error callback
      });
}

export { uploadImage };











/*function uploadImage(image, listingId) {
  x.post(
      BASE_URL + `/listings/${listingId}/images`,
      image,
  ).
      then(function(response) {
        console.log('in post');
        console.log(response);
        return 1;
      }).
      catch(function(error) {
        console.log(error);
      });
};*/

