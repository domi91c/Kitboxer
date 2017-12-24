<template class="step-images">
    <div class="row">
        <div class="col-md-12 mb-2">
            <new-image-button class="float-left" @get-new-image="getNewImage"></new-image-button>
            <step-image class="float-left" v-for="image in images" :image="image"></step-image>
        </div>
    </div>
</template>

<script>
  import StepImage from './StepImage.vue'
  import StepImageModal from './StepImageModal.vue'
  import CropModal from '../../image-uploader/components/CropModal'
  import NewImageButton from './NewImageButton'

  export default {
    components: {
      StepImage,
      CropModal,
      NewImageButton,
    },
    mounted() {

    },

    data() {
      return {
        images: [],
      }
    },

    methods: {
      getNewImage(formData) {
        console.log(formData)
        this.images.push(formData[0])
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~bootstrap/scss/functions";
    @import "~stylesheets/variables";


</style>