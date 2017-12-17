<template>
    <div>
        <div class="guide-step" v-for="step in guideSteps">
            <guide-step :steps="guideSteps" :step="step" @remove-step="removeStep"></guide-step>
        </div>
        <div class="mt-4 guide-footer">
            <button class="btn btn-lg btn-success float-right" @click="newStep">Next Step</button>
        </div>
    </div>
</template>

<script>
  import GuideStep from './components/GuideStep'

  export default {
    components: {
      GuideStep,
    },
    mounted() {

    },

    data() {
      return {
        guideSteps: [{ id: 0, title: 'Step One' }, { id: 1, title: 'Step Two' }, { id: 2, title: 'Step Three' }],
      }
    },

    methods: {
      removeStep(step) {
        let index = this.guideSteps.indexOf(step)
        this.guideSteps.splice(index, 1)
      },
      newStep() {
        this.guideSteps.push({})
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>