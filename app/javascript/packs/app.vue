<template>
    <div class="app">
        <hr>
        <div v-for="file in imageCards">
            <image-card :card="file"
                        v-on:open-modal="openModal"
                        v-on:delete-image="deleteImage"
                        v-on:cover-image="setCoverImage">
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

  import { loadImages, uploadImage, removeImage, setCover } from './model';

  export default {
    props: ['listingId'],
    data: function() {
      return {
        previewFile: '',
        imageCards: [],
      };
    },
    components: {
      ImageCard,
      ImageModal,
    },

    mounted() {
      loadImages(this.listingId).then(x => {
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
            uploadImage(card, this.listingId, this.onProgress).
                then((x) => {
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
      cropImage() {
        console.log('crop image');
      },
      deleteImage(cardData) {
        let fileIndex = this.imageCards.indexOf(cardData);
        this.imageCards.splice(fileIndex, 1);
        removeImage(cardData, this.listingId).then(x => {
          console.log('deleted image.');
        });
      },
      addImageCard() {
        console.log('adding image card');
      },
      openModal(file) {
        console.log('opening modal');
        this.previewFile = file.url;
        $('#image_modal').modal('show');
      },
      setCoverImage(card) {
        setCover(card, this.listingId).then(x => {
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



