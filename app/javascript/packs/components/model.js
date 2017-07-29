import axios from 'axios';

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector(
    'meta[name="csrf-token"]').getAttribute('content');

const BASE_URL = 'http://localhost:3002';

function uploadImage(data, listingId) {
  const url = `${BASE_URL}/listings/${listingId}/images`;
  return axios.post(url, data).
      then(x => x.request.response).
      catch((error) => {
        console.log(error);
      });
  ;
}

export { uploadImage };

