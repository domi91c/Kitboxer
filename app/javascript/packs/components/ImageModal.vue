<template>
    <div class="modal fade modal-lg" id="image_modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <vue-cropper
                            ref='cropper'
                            :aspect-ratio="3/2"
                            :guides="false"
                            :view-mode="1"
                            :drag-mode="'crop'"
                            :auto-crop-area="0.5"
                            :min-container-width="550"
                            :min-container-height="500"
                            :background="false"
                            :rotatable="true"
                            :src="imgSrc"
                            alt="Source Image"
                            :img-style="{  width: '500px', height: '500px'  }" >
                    </vue-cropper>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex';
  import VueCropper from 'vue-cropperjs';

  export default {
    updated() {
//      this.current_file = this.imgSrc;
//      this.imgSrc = this.current_file;
    },

    props: ['current_file'],
    data() {
      return {
        imgSrc: this.current_file,
      };
    },

    methods: {
      cropImage() {
        // get image data for post processing, e.g. upload or setting image src
//        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      },
    },
    components: { VueCropper },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>