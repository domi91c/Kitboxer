<template class="step-images">
    <div class="row">
        <div class="col-md-12 mb-2">
            <new-image-button class="float-left"
                              :step="step"
            >
            </new-image-button>
            <step-image class="float-left"
                        v-for="image in step.images"
                        :image="image"
                        :key="image.id">
            </step-image>
        </div>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import StepImage from './StepImage.vue'
  import StepImageModal from './StepImageModal.vue'
  import CropModal from '../../image-uploader/components/CropModal'
  import NewImageButton from './NewImageButton'

  export default {
    props: ['step'],
    components: {
      StepImage,
      CropModal,
      NewImageButton,
    },
    computed: {
      ...mapGetters([
        'tutorial',
        'steps',
      ]),
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~bootstrap/scss/functions";
    @import "~stylesheets/variables";


</style>