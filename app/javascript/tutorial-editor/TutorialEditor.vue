<template>
    <div>
        <h1>Counter {{counter}}</h1>
        <button @click="increment({ value:1000 })">Increment</button>
        <button @click="decrement">Decrement</button>
        <transition-group name="fade">
            <tutorial-step @remove-step="deleteStep"
                           :product="product"
                           :steps="tutorialSteps"
                           :step="step"
                           v-for="step in tutorialSteps"
                           :key="step.id">
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
  import TutorialStep from './components/TutorialStep'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['product'],

    components: {
      TutorialStep,
    },

    data() {
      return {
        tutorialSteps: [{ id: 0, title: 'Step One' }, { id: 1, title: 'Step Two' }],
      }
    },

    computed: {
      ...mapGetters([
        'counter',
      ]),
    },

    methods: {
      ...mapActions([
        'increment',
        'decrement',
      ]),
      deleteStep(step) {
        if (this.tutorialSteps.length > 1) {
          let index = this.tutorialSteps.indexOf(step)
          this.tutorialSteps.splice(index, 1)
        }
      },
      createStep() {
        this.tutorialSteps.push({ id: this.tutorialSteps[this.tutorialSteps.length].id + 1 })
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