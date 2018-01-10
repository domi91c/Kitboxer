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
                <div class="form-group">
                    <input type="file" class="form-control" @change="handleFileInput($event)">
                </div>
                <div class="row ">
                    <step-image v-for="image in step.images" :key="image.id" :image="image"></step-image>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import StepImage from './StepImage.vue'

  export default {
    props: ['step'],
    components: {
      StepImage,
    },
    mounted() {

    },

    data() {
      return {}
    },

    methods: {
      handleFileInput(e) {
        this.$store.dispatch('UPLOAD_IMAGE',
            { product: this.$store.state.product, image: e.target.files[0], step: this.step })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>