<template>
    <div class="new-image-button text-center mx-1 mt-2">
        <input type="file" name="file" id="file" class="new-image-file-field"
               @change="handleFileInput($event.target.files)"/>
        <label for="file">
            <i class="material-icons md-24 image new-image-button-icon"></i>
            <p>New Image</p>
        </label>
    </div>
</template>

<script>
  import * as model from '../model'

  export default {
    props: ['step', 'product', 'tutorial'],
    mounted() {

    },
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',
      }
    },
    methods: {
      handleFileInput(fileList) {
        const formData = new FormData()
        if (!fileList.length) return
        formData.append('image[image]', fileList[0])
        formData.append('image[step_id]', this.step.id)
        formData.append('image[product_id]', this.product.id)
        model.uploadImage(formData, this.product)
             .then(x => {
               this.$emit('get-new-image', x.image.url)
             })
             .catch(err => console.log(err))
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