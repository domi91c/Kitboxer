import axios from 'axios';

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content');

const BASE_URL = 'http://localhost:3002';

function loadImages(productId) {
  const url = `${BASE_URL}/products/${productId}/images`;
  return axios.get(url).
  then(x => x.request.response).
              catch(error => error);
}

function uploadImage(cardData, productId, onProgress) {
  var formData = new FormData();
  formData.append('image', cardData.file);
  const url = `${BASE_URL}/products/${productId}/images`;
  let config = {
    onUploadProgress(progressEvent) {
      var percentCompleted = Math.round((progressEvent.loaded * 100) /
          progressEvent.total);
      if (onProgress) onProgress(percentCompleted, cardData);
    },
  };
  return axios.post(url, formData, config).
  then(x => x.request.response).
              catch(error => error);
}

function removeImage(cardData, productId) {
  const url = `${BASE_URL}/products/${productId}/images/${cardData.id}`;
  console.dir(cardData)
  return axios.delete(url).
  then(x => x.request.response).
              catch(error => error);
}

function setCover(cardData, productId) {
  const url = `${BASE_URL}/products/${productId}/images/${cardData.id}/set_cover_image`;
  return axios.patch(url).
  then(x => x.request.response).
              catch(error => error);
}

export { loadImages, uploadImage, removeImage, setCover };

