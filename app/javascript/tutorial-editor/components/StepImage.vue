<template>
    <div class="step-image mx-1 mt-2">
        <img :src="image"
             height="120"
             width="120"
             @click="openImageModal()">
    </div>
</template>

<script>

  export default {
    props: ['image'],
    mounted() {
    },

    data() {
      return {}
    },

    methods: {
      openImageModal() {

      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/
    .step-image {
        border:        1px solid #bbb;
        border-radius: 3px;
        cursor:        pointer;
        height:        120px;
        width:         120px;
    }

</style>