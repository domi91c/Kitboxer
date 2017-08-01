<template>
    <div class="app">
        <hr>
        <div v-for="file in uploading">
            <image-card :cardData="file"
                        v-on:open-modal="openModal"
                        v-on:delete-image="deleteImage"
                        v-on:cover-photo="makeCoverPhoto">
            </image-card>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label class="btn btn-outline-info">
                    <input type="file" @change="inputDidChange" accept="image/*" multiple/>
                    Add Another ...
                </label>
            </div>
        </div>
        <hr>
        <image-modal :file="previewFile"></image-modal>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue';
  import ImageModal from './components/ImageModal.vue';
  import placeholder from './images/placeholder_img.jpg';

  import { uploadImage } from './model';

  export default {
    props: ['listingId'],
    data: function() {
      return {
        previewFile: '',
        uploading: [],
      };
    },
    components: {
      ImageCard,
      ImageModal,
    },
    methods: {
      inputDidChange(e) {
        if (e.target.files[0]) {
          for (let i = 0; i < e.target.files.length; i++) {

            let cardData = {
              file: e.target.files[i],
              formData: {},
              progress: 0,
              url: '',
            };
            this.uploading.push(cardData);
            uploadImage(cardData, this.listingId, this.onProgress).
                then((x) => {
                  let responseParsed = JSON.parse(x);
                  cardData.url = responseParsed.image.image.url;
                  console.log('success');
                });
          }
        }
      },
      onProgress(percent, card) {
        console.log(this.files);
        console.log(card);
        this.uploading[this.uploading.indexOf(card)].progress = percent;
      },
      previewImage() {
        console.log('preview image');
      },
      cropImage() {
        console.log('crop image');
      },
      deleteImage(cardData) {
        let fileIndex = this.uploading.indexOf(cardData);
        this.uploading.splice(fileIndex, 1);
      },
      addImageCard() {
        console.log('adding image card');
      },
      openModal(file) {
        console.log('opening modal');
        this.previewFile = file.url;
        $('#image_modal').modal('show');
      },
      makeCoverPhoto() {

      },
    },
  };
</script>

<style scoped>

    input[type="file"] {
        display: none;
    }

    .image-card {
        position: relative;
        top: 0;
        height: 100%;
        display: inline-block;
    }

    .image-card img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: auto;
        object-fit: cover;
    }

    .progress-bar {
        bottom: 0;
    }
</style>



