<template>
    <div class="mb-4">
        <div class="row">
            <div class="col-sm-4 image-card ">
                <img :class="card.coverImage ? 'cover-image' : 'other-image'" class="img-contain img-fluid"
                     :src="card.url"
                     @click="$emit('crop-image', card)"/>
            </div>
            <div class="col-sm-8" style="">
                <div class="actions d-none d-lg-block" style="">
                    <h5>{{card.filename}}</h5>
                    <div class="btn btn-success" @click="$emit('crop-image', card)">
                        <i class="fa fa-crop "></i>
                        Crop
                    </div>
                    <div class="btn btn-primary"
                         :class="card.coverImage ? 'disabled' : ''"
                         @click="$emit('cover-image', card)">
                        <i class="fa fa-star "></i>
                        Cover Photo
                    </div>
                    <div class="btn btn-danger" @click="$emit('delete-image', card)">
                        <i class="fa fa-times "></i>
                        Delete
                    </div>
                </div>
                <div class="actions d-lg-none text-center">
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
  import placeholder from '../images/placeholder_img.png'

  export default {
    mounted() {
    },
    props: ['card'],
    data() {
      return {
        currentFile: placeholder,
        isCoverPhoto: false,
      }
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .actions span {
        cursor: pointer;
    }

    .cover-image {
        border-radius: 2%;
        border:        5px solid theme-color("info");
    }

    .other-image {
        border-radius: 2%;
        border:        5px solid #FFFFFF;
    }

    .img-contain {
        height:           100%;
        width:            100%;
        object-fit:       contain;
    }

</style>

