<template>
    <div class="modal fade" id="image_modal">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <img :src="file" alt="">
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

    props: ['file'],
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