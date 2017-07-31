<template>
    <div class="mb-4">
        <div class="row">
            <div class="col-sm-4 image-card">
                <div class="item-image">
                    <img class="" :src="file" @click="$emit('open-modal', file)"/>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="actions " style="position:absolute;bottom: 0">
                <h5>the_name_of_the_file.png</h5>
                    <div class="btn btn-xl btn-success" @click="$emit('delete-image', file)">
                        <i class="fa fa-crop "></i> Crop
                    </div>
                    <div class="btn btn-xl btn-danger" @click="$emit('delete-image', file)">
                        <i class="fa fa-times "></i> Delete
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import placeholder from '../images/placeholder_img.png';

  export default {
    mounted() {
    },
    props: ['listing_id', 'file', 'progress'],
    data() {
      return {
        currentFile: placeholder,
      };
    },

    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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