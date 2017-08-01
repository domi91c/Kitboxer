<template>
    <div class="mb-4">
        <div class="row">
            <div class="col-sm-4 image-card .cover-photo">
                <div class="item-image">
                    <img class="" :src="cardData.url" @click="$emit('open-modal', cardData)"/>
                </div>
            </div>
            <div class="col-sm-8" style="">
                <div class="actions hidden-md-down " style="">
                    <h5>the_name_of_the_file.png</h5>
                    <div class="btn btn-xl btn-success" @click="$emit('delete-image', cardData)">
                        <i class="fa fa-crop "></i> Crop
                    </div>
                    <div class="btn btn-xl btn-primary" @click="$emit('delete-image', cardData)">
                        <i class="fa fa-star "></i> Cover Photo
                    </div>
                    <div class="btn btn-xl btn-danger" @click="$emit('delete-image', cardData)">
                        <i class="fa fa-times "></i> Delete
                    </div>
                </div>
                <div class="actions hidden-lg-up ">
                    <h5>the_name_of_the_file.png</h5>
                    <span @click="$emit('crop', cardData)"><i class="fa fa-crop "></i> Crop</span>
                    <span @click="$emit('cover-photo', cardData)"><i class="fa fa-star "></i> Cover Photo</span>
                    <span @click="$emit('delete-image', cardData)"><i class="fa fa-times "></i> Delete</span>
                </div>
                <div class="progress mt-4 ">
                    <div class="progress-bar "
                         :class="cardData.progress < 100 ? 'bg-primary' : 'bg-success'"
                         :style="{width: cardData.progress + '%'}"></div>
                </div>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>

  import placeholder from '../images/placeholder_img.png';

  export default {
    mounted() {
    },
    props: ['cardData'],
    data() {
      return {
        currentFile: placeholder,
        isCoverPhoto: false,
      };
    },

    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    @import '~stylesheets/custom';

    .image-card {
        position: relative;
        top: 0;
        height: 100%;
        display: inline-block;
        cursor: hand;
    }

    .image-card img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: auto;
        object-fit: contain;
        cursor: hand;
    }

    .cover-photo {
        border: 1px solid $brand-danger
    }

</style>

