<template>
    <div class="modal fade" id="image_modal">
        <div class="modal-dialog " role="document">
            <div class="modal-content modal-lg">
                <div class="modal-body"><img class="output" :src="file"></div>
            </div>
        </div>
    </div>
</template>


<script>
  import VueCropper from 'vue-cropper';
  import Croppa from 'vue-croppa';

  export default {
    mounted() {
    },
    components: {
      Croppa,
    },
    props: ['file'],
    data() {
      return {
        myCroppa: null,
        imgUrl: '',
      };
    },
    methods: {
      generateImage: function() {
        let url = this.myCroppa.generateDataUrl();
        if (!url) {
          alert('no image');
          return;
        }
        this.imgUrl = url;
      },
    },
  };
</script>
<style type="text/scss">
    .wrapper {
        height: 500px;
    }
</style>
