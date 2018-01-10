<template>
    <div class="new-image-button text-center mx-1 mt-2">
        <label>
            <input type="file" id="file" class="new-image-file-field"
                   @change="handleFileInput($event.target.files)"/>
            <i class="material-icons md-24 image new-image-button-icon"></i>
            <p>New Image</p>
        </label>
    </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

  export default {
    props: ['step'],

    computed: {
      ...mapGetters([
        'product',
        'tutorial',
        'steps',
      ]),
    },
    methods: {
      handleFileInput(fileList) {
        this.$store.dispatch('UPLOAD_IMAGE',
            { product: this.product, image: fileList[0], step: this.step })
      },
    },
  }
</script>

<style lang="scss" rel="styesheet/scss" scoped>
    .new-image-button {
        border:        1px solid #bbb;
        border-radius: 3px;
        margin:        0;
        cursor:        pointer;
        height:        120px;
        width:         120px;
    }

    .new-image-button > label > p {
        font-size: 1em;
    }

    .new-image-button-icon {
        position:  relative;
        top:       9px;
        font-size: 5rem;
        color:     #393F57;
    }

    .new-image-file-field {
        width:    0.1px;
        height:   0.1px;
        opacity:  0;
        overflow: hidden;
        position: absolute;
        z-index:  -1;
    }

</style>