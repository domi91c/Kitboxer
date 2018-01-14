<template>
    <div class="d-inline col-4 col-sm-3">
        <div class="step-image-button">
            <label class="img-fluid img-thumbnail" alt="">
                <input type="file" name="file" id="file" class="inputfile" @change="uploadImage($event)"/>
                <div class="inner-label">
                    <i class="fa fa-camera"></i>
                </div>
            </label>
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
      uploadImage(e) {
        this.$store.dispatch('UPLOAD_IMAGE',
            { product: this.$store.state.product, step: this.step, image: e.target.files[0] })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image-button {
        position:       relative;
        padding-bottom: 90%;
        margin-bottom:  30px;

        .inputfile {
            width:    0.1px;
            height:   0.1px;
            opacity:  0;
            overflow: hidden;
            position: absolute;
            z-index:  -1;
        }

        label {
            position:         absolute;
            height:           100%;
            width:            100%;
            object-fit:       contain;
            background-color: #ffffff;
            text-align: center;

            .inner-label {
                position:     absolute;
                right:        0;
                left:         0;
                text-align: center;
                font-size: 2rem;
            }
        }

    }
</style>