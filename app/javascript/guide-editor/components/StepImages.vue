<template>
    <div class="row ">
        <div class="col-md-12 mb-2">
            <step-image></step-image>
            <step-image></step-image>
            <step-image></step-image>
        </div>
    </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex';
  import StepImage from './StepImage.vue'
  export default {
    components: {
      StepImage
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
    @import "~bootstrap/scss/functions";
    @import "~stylesheets/variables";


</style>