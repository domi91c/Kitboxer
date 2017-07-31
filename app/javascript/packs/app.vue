<template>
    <div class="app">
        <hr>
        <div v-for="file in files">
            <image-card v-on:open-modal="openModal" :file="file" :progress="progress"
                        v-on:delete-image="deleteImage"></image-card>
        </div>
        <div class="row">
            <div class="col-sm-12 ">
                <div class="file-info mt-2 mb-4">
                    <div class="progress align-bottom">
                        <div class="progress-bar" :style="{width: progress + '%'}"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label class="btn btn-outline-info">
                    <input type="file" @change="inputDidChange"/>
                    Add Another ...
                </label>
            </div>
        </div>
        <hr>
        <image-modal :file="previewFile"></image-modal>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue';
  import ImageModal from './components/ImageModal.vue';
  import placeholder from './images/placeholder_img.jpg';

  import { uploadImage } from './model';

  export default {
    props: ['listingId'],
    data: function() {
      return {
        files: [],
        newFile: [],
        progress: 0,
        previewFile: '',
      };
    },
    components: {
      ImageCard,
      ImageModal,
    },
    methods: {
      inputDidChange(e) {
        if (e.target.files[0]) {
          let inputData = e.target.files[0];
          var formData = new FormData();
          formData.append('image', inputData);
          this.files.push(placeholder);
          uploadImage(formData, this.listingId, this.onProgress).
              then((x) => {
                var xParsed = JSON.parse(x);
                this.newFile = xParsed.image.image.url;
                let indexOfFile = this.files.indexOf(placeholder);
                this.files.splice(indexOfFile, 1, this.newFile);
                console.log('success');
              });
        }
      },
      onProgress(percent) {
        this.progress = percent;
      },
      previewImage() {
        console.log('preview image');
      },
      cropImage() {
        console.log('crop image');
      },
      deleteImage(file) {
//        deleteImage(file, this.listingId).
//            then()
        console.log('delete image');
        let fileIndex = this.files.indexOf(file);
        this.files.splice(fileIndex, 1);
      },
      addImageCard() {
        console.log('adding image card');
      },
      openModal(file) {
        console.log('opening modal');
        this.previewFile = file;
        $('#image_modal').modal('show');
      },
    },
  };
</script>

<style scoped>

    input[type="file"] {
        display: none;
    }

    .image-card {
        position: relative;
        top: 0;
        height: 100%;
        display: inline-block;
    }

    .image-card img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: auto;
        object-fit: cover;
    }

    .progress-bar {
        bottom: 0;
    }
</style>



