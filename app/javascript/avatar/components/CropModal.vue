<template>
    <div class="modal fade" id="cropModal" role="dialog" aria-labelledby="modalLabel" tabindex="-1">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="img-container text-center">
                        <label v-if="!cropperActive" for="file" class="drop-box ">
                            <p class="drop-box-text text-center">Drop image here</p>
                        </label>
                        <input ref="file" type="file" name="file" id="file" class="inputfile"
                               @change="handleFileInput"/>
                        <vue-cropper
                                v-show="!cropperLoading"
                                ref='cropper'
                                :aspect-ratio="309/278"
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
                        <pulse-loader :loading="cropperLoading"></pulse-loader>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary mt-2" @click="handleSubmit()">Crop</button>
                    <button type="button" class="btn btn-warning mt-2" @click="handleReset()">Reset</button>
                    <button type="button" class="btn btn-default mt-2" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import VueCropper from 'vue-cropperjs';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import { uploadAvatar } from '../model';

  export default {
    components: {
      VueCropper,
      PulseLoader,
    },
    props: ['image', 'person'],
    data() {
      return {
        currentImage: {},
        cropperActive: false,
        cropperLoading: false,
        formData: new FormData(),
      };
    },
    mounted() {
      console.log('hello')
    },
    updated() {
      this.$refs.cropper.enable();
    },
    methods: {
      handleFileInput(event) {
        this.currentImage = event.target.files[0];
        this.$refs.cropper.reset();
        let reader = new FileReader();
        const self = this;
        reader.onload = function() {
          self.cropperLoading = false;
          self.$refs.cropper.replace(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
        this.cropperActive = true;
        this.cropperLoading = true;
      },
      handleReset() {
        this.$refs.file.value = '';
        this.$refs.cropper.destroy();
        this.cropperActive = false;
      },
      handleSubmit() {
        $('#cropModal').modal('hide');
        const cropData = this.$refs.cropper.getData();
        let fd = new FormData();
        fd.append('crop_data', JSON.stringify(cropData));
        fd.append('avatar', this.currentImage);
        uploadAvatar(fd).then(x => {
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

    .inputfile {
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