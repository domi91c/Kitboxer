<template>
    <div class="d-inline col-4 col-sm-3">
        <div class="step-image">
            <img height="100" class="img-fluid img-thumbnail" :src="image.image.url"
                 alt="">
            <div class="image-overlay">
                <div class="btn-group">
                    <button class="btn btn-default">
                        <i class="fa fa-crop"></i>
                    </button>
                    <button class="btn btn-default" @click="removeImage(this.$event)">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';

  export default {
    props: ['image'],
    mounted() {

    },
    computed: {},

    data() {
      return {}
    },

    methods: {
      cropImage() {

      },
      removeImage(e) {

      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image {
        position:       relative;
        padding-bottom: 90%;
        margin-bottom:  30px;

        &:hover .image-overlay {
            opacity: 1;
        }

        img {
            position:         absolute;
            height:           100%;
            width:            100%;
            object-fit:       contain;
            background-color: #ffffff;
        }

        .image-overlay {
            opacity:    0;
            position:   relative;
            text-align: center;

            & .btn {
                position:  relative;
                top:       150px;
                font-size: 20px;
            }
        }

    }
</style>