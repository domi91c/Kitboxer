<template>
    <div class="app">
        <hr>
        <div v-for="file in imageCards">
            <image-card :card="file"
                        @open-modal="openModal"
                        @crop-image="cropImage"
                        @delete-image="deleteImage"
                        @cover-image="setCoverImage">
            </image-card>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label class="btn btn-outline-info">
                    <input type="file" @change="inputDidChange" accept="image/*" multiple/>
                    <span v-if="this.imageCards.length > 0">Add Another ...</span>
                    <span v-else>Add An Image ...</span>
                </label>
            </div>
        </div>
        <hr>
        <crop-modal :image="previewFile"></crop-modal>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue';
  import CropModal from './components/CropModal.vue';
  import { loadImages, uploadImage, removeImage, setCover } from './model.js';

  export default {
    props: ['images', 'productId'],
    data: function() {
      return {
        previewFile: '',
        imageCards: [],
      };
    },
    components: {
      ImageCard,
      CropModal,
    },

    mounted() {
      loadImages(this.productId).then(x => {
        let respParsed = JSON.parse(x);
        console.log('loading imageCards');
        for (var i = 0; i < respParsed.images.length; i++) {
          let card = {
            progress: 100,
            url: respParsed.images[i].image.url,
            coverImage: respParsed.images[i].cover_image,
            id: respParsed.images[i].id,
          };
          this.imageCards.push(card);
        }
      });
    },
    methods: {
      inputDidChange(e) {
        if (e.target.files[0]) {
          for (let i = 0; i < e.target.files.length; i++) {
            let card = {
              file: e.target.files[i],
              formData: {},
              progress: 0,
              url: '',
              coverImage: false,
            };
            this.imageCards.push(card);
            uploadImage(card, this.productId, this.onProgress).then((x) => {
              let respParsed = JSON.parse(x);
              card.url = respParsed.image.image.url;
              card.id = respParsed.image.id;
              console.log('success');
            });
          }
        }
      },
      onProgress(percent, card) {
        console.log(this.files);
        console.log(card);
        this.imageCards[this.imageCards.indexOf(card)].progress = percent;
      },
      previewImage() {
        console.log('preview image');
      },
      cropImage(file) {
        this.previewFile = file.url;
        $('.js-crop-modal').modal('show');
      },
      deleteImage(cardData) {
        let fileIndex = this.imageCards.indexOf(cardData);
        this.imageCards.splice(fileIndex, 1);
        removeImage(cardData, this.productId).then(x => {
          console.log('deleted image.');
        });
      },
      addImageCard() {
        console.log('adding image card');
      },
      openModal(file) {
        console.log('opening modal');
        this.previewFile = file.url;
        $('.js-crop-modal').modal('show');
      },
      setCoverImage(card) {
        setCover(card, this.productId).then(x => {
          console.log('set cover image success');
          for (let i = 0; i < this.imageCards.length; i++) {
            let card = this.imageCards[i];
            card.coverImage = false;
          }
          card.coverImage = true;
        });
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
        border-radius: 50%;
        bottom: 0;
    }
</style>



