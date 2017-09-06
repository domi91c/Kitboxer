<template>
    <div>
        <b-modal hide-header-close
                 no-close-on-backdrop
                 id="image-modal"
                 ref="image_modal"
                 size="lg"
                 @ok="finishCrop">
            <img v-show="false" :src="image.url" alt="">
            <vue-cropper
                    ref='cropper'
                    :aspect-ratio="1/1"
                    :guides="false"
                    :view-mode="1"
                    :drag-mode="'crop'"
                    :min-container-height="400"
                    :auto-crop-area="0.5"
                    :background="false"
                    :rotatable="true">
            </vue-cropper>
        </b-modal>
    </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs';
  import Model from '../model.js';

  export default {
    components: {
      VueCropper,
    },
    mounted() {
      this.$refs.cropper.replace(this.image.url);
    },
    updated() {
      this.$refs.cropper.replace(this.image.url);
    },
    props: ['image'],
    data() {
      return {
        name: 'name',
      };
    },

    methods: {
      finishCrop() {
        console.log('finishing crop.');
        let cropData = this.$refs.cropper.getData();
        console.log(cropData);
        this.$emit('finish-crop', cropData);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/
</style>