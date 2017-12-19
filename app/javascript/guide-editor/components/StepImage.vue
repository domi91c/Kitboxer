<template>
        <img src="http://via.placeholder.com/100x100" height="100px" width="100px" class="img-fluid mx-1 mt-2"
              @click="openImageModal()">
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
        console.log('peenor')
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

</style>