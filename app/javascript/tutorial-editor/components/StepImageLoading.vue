<template>
    <v-loading :loader="`upload image ${step.id}`" :classes="'d-inline col-4 col-sm-3'">
        <template slot='spinner'>
            <div class="step-image-button">
                <pulse-loader class="loading-indicator" color="#6C6CE1">
                </pulse-loader>
            </div>
        </template>
    </v-loading>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

  export default {
    components: {
      PulseLoader,
    },
    props: ['step'],
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image-button {
        position:       relative;
        padding-bottom: 90%;
        margin-top:     15px;

        .inputfile {
            width:    0.1px;
            height:   0.1px;
            opacity:  0;
            overflow: hidden;
            position: absolute;
            z-index:  -1;
        }

        label {
            cursor:           pointer;
            position:         absolute;
            height:           100%;
            width:            100%;
            object-fit:       contain;
            background-color: #ffffff;
            text-align:       center;

            img {
                height:           100%;
                width:            100%;
                object-fit:       contain;
                background-color: #ffffff;
            }
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
