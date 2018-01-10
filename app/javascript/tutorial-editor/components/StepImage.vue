<template>
        <div class="d-inline col-4 col-sm-3">
            <img height="100" class="img-fluid img-thumbnail" :src="image.image.url" alt="">
        </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex';

  export default {
    props: ['image'],
    mounted() {
      debugger
    },
    computed: {},

    data() {
      return {}
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>