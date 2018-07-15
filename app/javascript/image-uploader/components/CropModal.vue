<template>
    <div class="modal fade js-crop-modal" role="dialog" aria-labelledby="modalLabel" tabindex="-1">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div v-if="modalIsReady" class="img-container text-center">
                        <img v-show="false" :src="image" alt="">
                        <vue-cropper
                                ref='cropper'
                                :aspect-ratio="1/1"
                                :guides="false"
                                :minContainerWidth="520"
                                :minContainerHeight="500"
                                :view-mode="1"
                                :drag-mode="'crop'"
                                :auto-crop-area="0.5"
                                :background="false"
                                :rotatable="true"
                        >
                        </vue-cropper>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary mt-2" @click="handleSubmit()">Crop</button>
                    <button type="button" class="btn btn-default mt-2" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import VueCropper from 'vue-cropperjs'
  import {bus} from '../../main.js'
  import {uploadImage} from '../model.js'

  export default {
    components: {
      VueCropper,
    },
    props: ['image', 'modalIsReady'],
    data() {
      return {
        currentImage: {},
        cropperIsActive: false,
        cropperIsLoading: false,
        formData: new FormData(),
      }
    },
    mounted() {
      console.log('modal is ready')
      this.$refs.cropper.enable()
      this.$refs.cropper.replace(this.image)
    },
    updated() {
      console.log('updated')
      this.$refs.cropper.destroy()
      this.$refs.cropper.enable()
      this.$refs.cropper.replace(this.image)
    },
    methods: {
      handleSubmit() {
        $('#cropModal').modal('hide')
        const cropData = this.$refs.cropper.getData()
        let fd = new FormData()
        fd.append('crop_data', JSON.stringify(cropData))
        fd.append('avatar', this.currentImage)
        uploadImage(fd).then(x => {
          this.$emit('submit', x);
        }).catch(x => {
        });
      },
    },
  };
</script>


<style>
    .img-container {
        max-width: 100%;
        height: 500px;
    }

    .file-input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    .drop-box {
        position: absolute;
        border: 2px dashed #666;
        background-color: #ccc;
        width: 95%;
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center
    }

    .loading {
        width: 95%;
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center
    }

    .drop-box-text {
        font-size: 26px;
    }

    .v-spinner {
        position: absolute;
        top: 50%;
        margin: 0 auto;
        width: 100%;
    }
</style>