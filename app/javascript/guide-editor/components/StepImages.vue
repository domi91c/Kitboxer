<template>
    <div class="row">
        <div class="col-md-12 mb-2">
            <step-image v-for="image in images" :image="image"></step-image>
            <crop-modal :image="image"></crop-modal>
        </div>
    </div>
</template>

<script>
  import StepImage from './StepImage.vue'
  import StepImageModal from './StepImageModal.vue'
  import CropModal from '../../image-uploader/components/CropModal'

  export default {
    components: {
      StepImage,
      CropModal,
    },
    mounted() {

    },

    data() {
      return {
        images: [
          {
            id: 0,
            src: 'http://via.placeholder.com/100x100',
          },
          {
            id: 1,
            src: 'http://via.placeholder.com/100x100',
          },
          {
            id: 2,
            src: 'http://via.placeholder.com/100x100',
          },
          {
            id: 3,
            src: 'http://via.placeholder.com/100x100',
          },
        ],
      }
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~bootstrap/scss/functions";
    @import "~stylesheets/variables";


</style>