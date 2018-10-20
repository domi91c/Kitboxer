import axios from 'axios'

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content')

var BASE_URL = ''
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3002'
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.com'
}

function uploadImage(imageData, onProgress) {
  var formData = new FormData();
  formData.append('image[attachment]', imageData.file);
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
  let cropData = imageData.cropData;
  formData.append('image[crop_x]', cropData['x'])
  formData.append('image[crop_y]', cropData['y'])
  formData.append('image[crop_width]', cropData['width'])
  formData.append('image[crop_height]', cropData['height'])
  formData.append('image[product_id]', imageData.productId);
  return axios.patch(url, formData)
              .then(x => x.request.response)
              .catch(error => error);
}

export { uploadImage, removeImage, setCoverImage, cropImage }

