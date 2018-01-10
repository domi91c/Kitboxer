<template>
    <div>
        <step v-for="step in tutorial.steps" :key="step.id" :step="step"></step>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import Step from './components/Step'

  export default {
    components: {
      Step,
    },
    computed: {
      ...mapGetters([
        'product',
        'tutorial',
      ]),
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