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
        <button type="submit" class="btn btn-lg btn-success float-right" @click="handleSubmit">Submit Tutorial
        </button>
    </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Step from './components/Step'
  import scrollIntoView from 'scroll-into-view'

  export default {
    components: {
      Step,
    },
    computed: {
      ...mapGetters([
        'productId',
        'tutorial',
        'steps',
      ]),
    },
    methods: {
      ...mapActions([
        'addStep',
        'submitTutorial',
      ]),
      handleSubmit() {
        this.$validator.validateScopes()
            .then((result) => {
              if (!result) {
                scrollIntoView(this.$el.querySelector('[data-vv-id="' + this.$validator.errors.items[0].id + '"]'),
                    { time: 250 })
                return
              }
              this.submitTutorial()
            }).catch(() => {
        })
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
        transform: translateY(-30px);
    }

</style>
