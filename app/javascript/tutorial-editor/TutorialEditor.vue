<template>
    <div>
        <transition-group name="step-list" tag="p">
            <div v-for="step in steps" :key="step.id">
                <step :step="step"></step>
            </div>
        </transition-group>
        <hr>
        <div class="text-center">
            <button type="button"
                    class="btn btn-outline-info"
                    @click="addStep()">
                <i class="fa fa-plus"></i> Add Step
            </button>
        </div>
        <hr>
    </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Step from './components/Step'

  export default {
    components: {
      Step,
    },
    computed: {
      ...mapGetters([
        'product',
        'steps',
      ]),
    },

    mounted() {
      alert('yoo')
      let containerEl = document.getElementsByClassName('js-hide-before-load')
      containerEl[0].classList.remove('js-hide-before-load')
    },

    methods: {
      addStep(step) {
        this.$store.dispatch('ADD_STEP')
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-list-enter-active, .step-list-leave-active {
        transition: all .4s;
    }

    .step-list-enter, .step-list-leave-to {
        opacity:   0;
        transform: translateY(-300px);
    }

</style>
