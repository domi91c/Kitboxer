import axios from 'axios';

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content');

const BASE_URL = 'http://localhost:3002';

function uploadImage(cardData, listingId, onProgress) {
  var formData = new FormData();
  formData.append('image', cardData.file);
  console.log('in oup')
  console.log(cardData)
  const url = `${BASE_URL}/listings/${listingId}/images`;
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

export { uploadImage };

