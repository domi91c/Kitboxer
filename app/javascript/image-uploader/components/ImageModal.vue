<template>
  <div>
    <b-modal hide-header-close
             no-close-on-backdrop
             id="image-modal"
             size="xl"
             @ok="finishCrop">
      <img v-show="false" :src="image.url" alt="">
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
    VueCropper
  },
  updated() {
    this.$refs.cropper.replace(this.image.url)
  },
  props: ['image'],
  methods: {
    finishCrop() {
      let cropData = this.$refs.cropper.getData()
      console.log(cropData)
      this.$emit('finish-crop', cropData)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
/*@import "./resources/assets/sass/variables";*/
</style>
