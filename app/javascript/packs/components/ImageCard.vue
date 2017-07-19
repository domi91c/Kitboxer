<template>
    <div class="col-md-3 image-card mt-3 mb-3" @click="handleCardClick">
        <div class="upload-btn-wrapper">

            <img class="image-card" :src="currentFile"/>
            <input type="file" name="file" class="" accept="image/*" multiple
                   @change="inputDidChange($event)">
            <div class="progress ">
                <div class="progress-bar bg-success " role="progressbar" style="width: 25%"
                     aria-valuenow="0"
                     aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    </div>
</template>

<script>

  import placeholder from './placeholder_img.png';
  import { uploadImage } from './model';

  export default {
    mounted() {
      console.log(this.listing_id)
    },
    props: ['listing_id'],
    data() {
      return {
        currentFile: placeholder,
        imageFile: '',
      };
    },

    methods: {
      inputDidChange(e) {
        this.currentFile = e.target.files[0];
        var formData = new FormData();
        console.log(this.currentFile);
        formData.append('image', this.currentFile);
        uploadImage(formData, this.listing_id);

      },
      handleCardClick() {
        console.log('clicked.');
        this.$emit('open-modal', null);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/
    .image-card {
        display: inline-block;
        position: relative;
        vertical-align: bottom;
    }

    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }

</style>