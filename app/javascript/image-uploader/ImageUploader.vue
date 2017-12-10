<template>
    <div class="image-uploader">
        <hr>
        <div v-for="card in imageCards">
            <image-card :card="card"
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
        <image-modal :image="currentImage" @finish-crop="updateImage"></image-modal>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue'
  import ImageModal from './components/ImageModal.vue'
  import { loadImages, uploadImage, removeImage, setCoverImage, cropImage } from './model.js'

  export default {
    props: ['images', 'productId'],
    data: function() {
      return {
        currentImage: '',
        imageCards: [],
      }
    },
    components: {
      ImageCard,
      ImageModal,
    },
    mounted() {
      for (var i = 0; i < this.images.length - 1; i++) {
        let image = this.images[i]
        let card = {
          productId: this.productId,
          progress: 100,
          url: image.image.url,
          coverImage: image.cover_image,
          id: image.id,
          cropped: image.cropped,
        }
        this.imageCards.push(card)
      }
    },
    methods: {
      inputDidChange(e) {
        if (e.target.files[0]) {
          for (let i = 0; i < e.target.files.length; i++) {
            let card = {
              productId: this.productId,
              file: e.target.files[i],
              formData: {},
              progress: 0,
              url: '',
              coverImage: false,
              cropped: false,
            }
            this.imageCards.push(card)
            uploadImage(card, this.onProgress).then((x) => {
              let respParsed = JSON.parse(x)
              card.url = respParsed.image.image.url
              card.id = respParsed.image.id
            })
          }
        }
      },
      onProgress(percent, card) {
        console.log(this.files)
        console.log(card)
        this.imageCards[this.imageCards.indexOf(card)].progress = percent
      },
      cropImage(card) {
        this.$root.$emit('show::modal', 'image-modal')
        this.currentImage = card
        console.log(this.currentImage)
      },
      updateImage(cropData) {
        this.currentImage.cropData = cropData
        cropImage(this.currentImage).then(x => {
          let respParsed = JSON.parse(x)
          console.log(x)
          let index = this.imageCards.indexOf(this.currentImage)
          this.imageCards[index].url = respParsed.image.image.url
          this.imageCards[index].cropped = true
          console.log(this.imageCards[index].url)
          console.log('image cropped successfully')
        }).catch(x => {
          console.log('image cropped failed')
        })
      },
      deleteImage(cardData) {
        this.imageCards.splice(this.imageCards.indexOf(cardData), 1)
        removeImage(cardData).then(x => {
          console.log('deleted image.')
        })
      },
      setCoverImage(card) {
        setCoverImage(card).then(x => {
          console.log('set cover image success')
          for (let i = 0; i < this.imageCards.length; i++) {
            let card = this.imageCards[i]
            card.coverImage = false
          }
          card.coverImage = true
        })
      },
    },
  }
</script>

<style scoped>
    input[type="file"] {
        display: none;
    }

    .progress-bar {
        border-radius: 50%;
        bottom:        0;
    }

</style>
