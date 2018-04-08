<template>
    <div class="d-inline col-4 col-sm-3">
        <div class="step-image">
            <img class="img-fluid img-thumbnail" :src="image.image.url">
            <v-loading :loader="`crop image ${image.id}`">
                <template slot='spinner'>
                    <pulse-loader class="loading-indicator" color="#6C6CE1">
                    </pulse-loader>
                </template>
            </v-loading>
            <div class="image-overlay">
                <div class="btn-group">
                    <div class="btn btn-info" @click.stop="$emit('preview-image', image)">
                        <i class="fa fa-crop"></i>
                    </div>
                    <div class="btn btn-secondary" @click.stop="deleteImage">
                        <i class="fa fa-trash"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

  export default {
    components: {
      PulseLoader,
    },
    props: ['step', 'image'],
    methods: {
      deleteImage() {
        this.$store.dispatch('DELETE_IMAGE',
            { step: this.step, image: this.image })
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image {
        position:       relative;
        padding-bottom: 90%;
        margin-top:     15px;

        img {
            position:         absolute;
            height:           100%;
            width:            100%;
            object-fit:       contain;
            background-color: #ffffff;
        }

        .image-overlay {
            opacity:    0;
            position:   absolute;
            right:      0;
            left:       0;
            bottom:     0;
            text-align: center;

            & .btn {
                cursor: pointer;
            }
        }
        &:hover .image-overlay {
            opacity: 1;
        }

    }

    .loading-indicator {
        position:    absolute;
        left:        50%;
        top:         50%;
        margin-left: -28px;
        margin-top:  -10px;
    }
</style>