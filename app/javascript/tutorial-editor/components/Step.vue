<template>
    <div class="card mb-4">
        <crop-modal :step="step" :image="currentImage"></crop-modal>
        <div class="card-body">
            <h2 class="card-title">Step {{this.stepNumber}}</h2>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Step title...">
                </div>
                <div class="form-group">
                    <trix-editor class="form-control" placeholder="Step instructions..."></trix-editor>
                </div>
                <div class="row ">
                    <step-image-button :step="step"></step-image-button>
                    <step-image v-for="image in step.images"
                                :key="image.id"
                                :step="step"
                                :image="image"
                                @preview-image="launchCropModal(image)">
                    </step-image>
                    <step-image-loading></step-image-loading>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import StepImageButton from './StepImageButton.vue'
  import StepImage from './StepImage.vue'
  import CropModal from './CropModal.vue'

  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

  export default {
    props: ['step'],
    components: {
      StepImageButton,
      StepImage,
      CropModal,
    },

    data() {
      return {
        currentImage: { image: { url: '' } },
      }
    },

    computed: {
      ...mapGetters([
        'steps',
        'getStepById',
      ]),
      stepNumber() {return this.steps.indexOf(this.step) + 1},
    },
    methods: {
      launchCropModal(image) {
        this.currentImage = image
        this.$root.$emit('bv::show::modal', `image-modal-${this.step.id}`)
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>