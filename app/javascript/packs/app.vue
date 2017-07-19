<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="image-scroller" style="">
                        <image-card v-on:open-modal="openModal" :listing_id="listing_id"></image-card>
                        <image-card v-on:open-modal="openModal" :listing_id="listing_id"></image-card>
                        <image-card v-on:open-modal="openModal" :listing_id="listing_id"></image-card>
                        <image-card v-on:open-modal="openModal" :listing_id="listing_id"></image-card>
                        <image-card v-on:open-modal="openModal" :listing_id="listing_id"></image-card>
                    </div>
                </div>
            </div>
        </div>
        <image-modal></image-modal>
    </div>
</template>

<script>
  import ImageCard from './components/ImageCard.vue';
  import ImageModal from './components/ImageModal.vue';

  export default {
    props: ['placeholder_img', 'listing_id'],
    data: function() {
      return {
        message: 'hi',
      };
    },
    components: {
      ImageCard,
      ImageModal,
    },
    methods: {
      openModal() {
        console.log('opening modal');
        $('#image_modal').modal('show');
      },
    },
  };
</script>

<style scoped>

    .image-scroller {
        height: 100%;
        width: 100%;
        white-space: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
    }

</style>



