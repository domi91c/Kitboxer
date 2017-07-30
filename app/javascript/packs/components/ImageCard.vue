<template>
    <div class="">
        <div class="row">
            <div class="col-sm-4 image-card">
                <div class="item-image">
                    <img class="" :src="currentFile"/>
                    <input type="file" name="file" class="" accept="image/*">
                </div>
            </div>
            <div class="col-sm-8">
                <div class="icons pull-right" style="position: absolute; bottom: 0;">
                    <i class="fa fa-crop fa-2x" @click="$emit('crop-image', file)"></i>
                    <i class="fa fa-eye fa-2x" @click="$emit('view-image', file)"></i>
                    <i class="fa fa-times fa-2x" @click="$emit('delete-image', file)"></i>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 ">
                <div class="file-info mt-2 mb-4">
                    <h5>filename_of_this_file.png</h5>
                    <div class="progress align-bottom" style="">
                        <div class="progress-bar bg-success " role="progressbar" style="width: 25%"
                             aria-valuenow="0"
                             aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import placeholder from '../images/placeholder_img.png';
  import { uploadImage } from './model';

  export default {
    mounted() {
    },
    props: ['listing_id', 'file'],
    data() {
      return {
        currentFile: placeholder,
      };
    },

    methods: {
      inputDidChange(e) {
        this.currentFile = e.target.files[0];
        var formData = new FormData();
        formData.append('image', this.currentFile);
        uploadImage(formData, this.listing_id).
            then((x) => {
              var xParse = JSON.parse(x);
              this.currentFile = xParse.image.image.url;
              this.$emit('open-modal', this.currentFile);
            });
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
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

</style>