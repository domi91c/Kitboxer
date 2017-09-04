<template>
    <div class="mb-4">
        <div class="row">
            <div class="col-sm-4 image-card ">
                <div class="item-image " :class="card.coverImage ? 'cover-image' : 'other-image'">
                    <img class="" :src="card.url" @click="$emit('crop-image', card)"/>
                </div>
            </div>
            <div class="col-sm-8" style="">
                <div class="actions hidden-md-down " style="">
                    <h5>{{card.filename}}</h5>
                    <div class="btn btn-success" @click="$emit('crop-image', card)">
                        <i class="fa fa-crop "></i>
                        Crop
                    </div>
                    <div class="btn btn-primary" :class="card.coverImage ? 'disabled' : ''"
                         @click="$emit('cover-image', card)">
                        <i class="fa fa-star "></i>
                        Cover Photo
                    </div>
                    <div class="btn btn-danger" @click="$emit('delete-image', card)">
                        <i class="fa fa-times "></i>
                        Delete
                    </div>
                </div>
                <div class="actions hidden-lg-up ">
                    <h5>{{card.filename}}</h5>
                    <span @click="$emit('crop-image', card)"><i class="fa fa-crop "></i> Crop</span>
                    <span @click="$emit('cover-image', card)"><i class="fa fa-star "></i> Cover Photo</span>
                    <span @click="$emit('delete-image', card)"><i class="fa fa-times "></i> Delete</span>
                </div>
                <div class="progress mt-4 ">
                    <div class="progress-bar "
                         :class="card.progress < 100 ? 'bg-primary' : 'bg-success'"
                         :style="{width: card.progress + '%'}"></div>
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
    props: ['card'],
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

    .cover-image {
        border-radius: 2%;
        border: 5px solid $brand-primary;
    }

    .other-image {
        border-radius: 2%;
        border: 5px solid #FFFFFF;
    }

</style>

