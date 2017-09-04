import axios from 'axios';

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content');

const BASE_URL = 'http://localhost:3002';

function loadImages(productId) {
  const url = `${BASE_URL}/products/${productId}/images`;
  return axios.get(url).then(x => x.request.response).catch(error => error);
}

function uploadImage(imageData, onProgress) {
  var formData = new FormData();
  formData.append('image[image]', imageData.file);
  formData.append('image[product_id]', imageData.productId);
  const url = `${BASE_URL}/products/${imageData.productId}/images`;
  let config = {
    onUploadProgress(progressEvent) {
      var percentCompleted = Math.round((progressEvent.loaded * 100) /
          progressEvent.total);
      if (onProgress) onProgress(percentCompleted, imageData);
    },
  };
  return axios.post(url, formData, config)
              .then(x => x.request.response)
              .catch(error => error);
}

function removeImage(imageData) {
  const url = `${BASE_URL}/products/${imageData.productId}/images/${imageData.id}`;
  return axios.delete(url).then(x => x.request.response).catch(error => error);
}

function setCoverImage(imageData, productId) {
  const url = `${BASE_URL}/products/${imageData.productId}/images/${imageData.id}/set_cover_image`;
  return axios.patch(url).then(x => x.request.response).catch(error => error);
}

function cropImage(imageData) {
  const url = `${BASE_URL}/products/${imageData.productId}/images/${imageData.id}`;
  var formData = new FormData();
  formData.append('image[crop_data]', JSON.stringify(imageData.cropData));
  formData.append('image[product_id]', imageData.productId);
  return axios.patch(url, formData).then(x => x.request.response).catch(error => error);
}

export { loadImages, uploadImage, removeImage, setCoverImage, cropImage };

