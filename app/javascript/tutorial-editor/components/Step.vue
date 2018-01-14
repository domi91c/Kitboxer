<template>
    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title">Step 1</h5>
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
                                :image="image">
                    </step-image>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import StepImageButton from './StepImageButton.vue'
  import StepImage from './StepImage.vue'

  export default {
    props: ['step'],
    components: {
      StepImageButton,
      StepImage,
    },
    mounted() {

    },

    data() {
      return {}
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>