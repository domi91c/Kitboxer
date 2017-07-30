<template>
    <div class="app">
        <hr>
        <div v-for="file in list">
            <ImageCard :file="file"  v-on:delete-image="deleteImage"></ImageCard>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn btn-outline-info mt-4" @click="addImageCard">Add Another ...</button>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue';
  import ImageModal from './components/ImageModal.vue';

  export default {
    props: ['listing_id'],
    data: function() {
      return {
        list: ['dog', 'cat', 'moose'],
        message: 'hi',
      };
    },
    components: {
      ImageCard,
      ImageModal,
    },
    methods: {
      previewImage() {
        console.log('preview image');
      },
      cropImage() {
        console.log('crop image');
      },
      deleteImage(file) {
        console.log('delete image');
        let fileIndex = this.list.indexOf(file);
        this.list.splice(fileIndex, 1);
      },
      addImageCard() {
        console.log('adding image card');
      },
      openModal(file) {
        console.log('opening modal');
        this.currentFile = file;
        $('#image_modal').modal('show');
      },
    },
  };
</script>

<style scoped>


    .item-image input[type=file] {
        font-size: 200px;
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

    .progress-bar {
        bottom: 0;
    }

</style>



