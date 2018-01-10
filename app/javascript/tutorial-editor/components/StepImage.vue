<template>
    <div class="d-inline col-4 col-sm-3">
        <div class="step-image">
            <img height="100" class="img-fluid img-thumbnail " :src="image.image.url"
                 alt="">
        </div>
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

    /*.step-image {*/
    /*position:            relative;*/
    /*float:               left;*/
    /*width:               100%;*/
    /*height:              100px;*/
    /*object-fit: cover;*/
    /*}*/

    .step-image {
        position:       relative;
        //top: 0;
        //width: 100%;
        padding-bottom: 90%;
        margin-bottom:30px;
    }

    .step-image img {
        position:         absolute;
        //top: 0;
        //bottom: 0;
        //left: 0;
        //right: 0;
        height:           100%;
        width:            100%;
        object-fit:       contain;
        background-color: #ffffff;
    }
</style>