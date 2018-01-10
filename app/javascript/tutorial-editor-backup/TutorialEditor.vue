<template>
    <div>
        <p>{{this.tutorial}}</p>
        <transition-group name="fade">
            <tutorial-step
                    v-for="step in steps"
                    :step="step"
                    :key="step.id"
                    @remove-step="deleteStep">
            </tutorial-step>
        </transition-group>
        <div class="mt-4 tutorial-footer">
            <button class="btn btn-lg btn-success float-right"
                    @click="createStep"> New Step
            </button>
            <button class="btn btn-lg btn-outline-dark">Preview</button>
        </div>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import TutorialStep from './components/TutorialStep'

  export default {

    components: {
      TutorialStep,
    },

    mounted: function() {
      this.$store.dispatch('LOAD_TUTORIAL', {product: this.product})
    },
    computed: {
      ...mapGetters([
        'product',
        'tutorial',
        'steps',
      ]),
    },

    methods: {
      deleteStep(step) {
        if (this.steps.length > 1) {
          let index = this.steps.indexOf(step)
          this.steps.splice(index, 1)
        }
      },
      createStep() {
        this.steps.push({ id: this.tutorialSteps[this.tutorialSteps.length].id + 1 })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to {
        opacity: 0
    }

</style>