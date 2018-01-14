<template>
    <div class="d-inline col-4 col-sm-3">
        <div class="step-image">
            <img class="img-fluid img-thumbnail" :src="image.image.url"
                 alt="">
            <div class="image-overlay">
                <div class="btn-group">
                    <div class="btn btn-info">
                        <i class="fa fa-crop"></i>
                    </div>
                    <div class="btn btn-secondary" @click="deleteImage">
                        <i class="fa fa-trash"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

  export default {
    props: ['step', 'image'],
    mounted() {

    },
    computed: {
      ...mapGetters([
        'steps',
        'images',
      ]),
    },

    data() {
      return {}
    },

    methods: {
      cropImage() {

      },
      deleteImage() {
        let stepIndex = this.steps.indexOf(this.step)
        let imageIndex = this.steps[stepIndex].images.indexOf(this.image)
        this.$store.dispatch('DELETE_IMAGE',
            { product: this.$store.state.product, stepIndex: stepIndex, imageIndex: imageIndex, image: this.image })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image {
        position:       relative;
        padding-bottom: 90%;

        img {
            position:         absolute;
            height:           100%;
            width:            100%;
            object-fit:       contain;
            background-color: #ffffff;
        }

        .image-overlay {
            opacity:      0;
            position:     absolute;
            right:        0;
            left:         0;
            bottom:       0;
            text-align: center;

            & .btn {
                cursor: pointer;
            }
        }
        &:hover .image-overlay {
            opacity: 1;
        }

    }
</style>