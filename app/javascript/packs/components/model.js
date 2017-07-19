import x from 'axios';

const BASE_URL = 'http://localhost:3008';

function uploadImage(image, listingId) {
  x.post(
      BASE_URL + `listings/${listingId}/images`,
      image,
  ).
      then(function(response) {
        console.log(response);
      }).
      catch(function(error) {
        console.log(error);
      });
}

;

export { uploadImage };
