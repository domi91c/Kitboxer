<template class="TutorialStep">
    <div class="card mb-4">
        <div class="card-body">
            <i class="close fa fa-close float-right mb-3" @click="$emit('remove-step', step)"></i>
            <h2 class="mb-4">Step {{steps.indexOf(step) + 1}}</h2>
            <input type="text" id="step-title" class="form-control mb-4" placeholder="Step title...">
            <trix-editor height="500" placeholder="Step instructions..."></trix-editor>
            <div class="step-images-container mt-4">
                <step-images :product="product" :step="step"></step-images>
            </div>
        </div>
    </div>
</template>

<script>
  import StepImages from './StepImages'

  export default {
    components: { StepImages },
    props: ['product', 'steps', 'step'],
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

    .TutorialStep {

    }

    .step-images-container {
        margin:     0;
        min-height: 5em;
    }

</style>