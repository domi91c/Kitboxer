<template>
    <div>
        <b-modal hide-header-close
                 no-close-on-backdrop
                 :id="`image-modal-${step.id}`"
                 ref="image_modal"
                 size="lg"
                 lazy
                 ok-title="Crop"
                 @ok="submitCropData(this.$event)"
                 v-model="modalVisible"
        >
            <img v-show="false" :src="image.image.url" alt="">
            <vue-cropper
                    ref='cropper'
                    :aspect-ratio="10/9"
                    :guides="false"
                    :view-mode="1"
                    :drag-mode="'move'"
                    :min-container-height="400"
                    :auto-crop-area="0.5"
                    :background="false"
                    :rotatable="true">
            </vue-cropper>
        </b-modal>
    </div>
</template>
<script>
  import VueCropper from 'vue-cropperjs'

  export default {
    components: {
      VueCropper,
    },
    props: ['step', 'image'],
    data() {
      return {
        modalVisible: false,
      }
    },
    watch: {
      modalVisible() {
        this.$refs.cropper.replace(this.image.image.url)
      },
    },
    methods: {
      submitCropData(event) {
        let cropData = this.$refs.cropper.getData()
        this.$store.dispatch('CROP_IMAGE',
            { step: this.step, image: this.image, cropData: cropData })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>