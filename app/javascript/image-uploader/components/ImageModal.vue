<template>
    <div>
        <b-modal hide-header-close
                 no-close-on-backdrop
                 id="image-modal"
                 ref="image_modal"
                 size="lg">
            <img v-show="false" :src="image" alt="">
            <vue-cropper
                    ref='cropper'
                    :aspect-ratio="1/1"
                    :guides="false"
                    :view-mode="1"
                    :drag-mode="'crop'"
                    :auto-crop-area="0.5"
                    :background="false"
                    :rotatable="true">
            </vue-cropper>
        </b-modal>
    </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs';

  export default {
    components: {
      VueCropper,
    },
    mounted() {
      console.log('image mounted:');
      console.log(this.image);
      this.$refs.cropper.enable();
      this.$refs.cropper.replace(this.image);
    },

    updated() {
      this.$refs.cropper.enable();
      this.$refs.cropper.replace(this.image);
    },
    props: ['image'],
    data() {
      return {
        name: 'name',
      };
    },

    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/
</style>