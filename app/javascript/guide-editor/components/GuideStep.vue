<template>
    <div class="card mb-4">
        <div class="card-body">
            <i class="close fa fa-close float-right" @click="$emit('remove-step', step)"></i>
            <h1>Step {{steps.indexOf(step) + 1}}</h1>
            <input type="text" id="step-title" class="form-control mb-4" placeholder="Step title...">
            <trix-editor placeholder="Step instructions..."></trix-editor>
            <div class="step-images-container text-center mt-4">
                <step-images></step-images>
            </div>
        </div>
    </div>
</template>

<script>
  import StepImages from './StepImages'

  export default {
    components: { StepImages },
    props: ['steps', 'step'],
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


    .step-images-container {
        border: 1px solid #bbb;
        border-radius: 3px;
        margin: 0;
        padding: 0.4em 0.6em;
        min-height: 5em;
    }

</style>