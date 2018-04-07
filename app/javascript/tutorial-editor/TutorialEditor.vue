<template>
    <div>
        <div v-for="step in tutorial.steps">
            <step :key="step.id" :step="step"></step>
            <hr>
            <div class="text-center">
                <button type="button"
                        class="btn btn-outline-info"
                        @click="addStep(step)">
                    <i class="fa fa-plus"></i> Add Step
                </button>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Step from './components/Step'

  export default {
    components: {
      Step,
    },
    computed: {
      ...mapGetters([
        'product',
        'tutorial',
        'getStepById',
      ]),
    },
    mounted() {
    },

    data() {
      return {}
    },

    methods: {
      addStep(step) {
        alert('adding another step in between' + step.id)
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>
