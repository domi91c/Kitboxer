<template>
    <div>This is the test app.

        <p>{{tutorialState}}</p>

    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    mounted() {
    },

    data() {
      return {}
    },

    computed: {
      ...mapState({ tutorialState: state => state.tutorial }),
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>