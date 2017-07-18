<template>
    <div class="col-md-3 image-card" style="margin-bottom:15px; margin-top:15px;" @click="handleClick">
        <img class="image-card" src="../images/placeholder_img.png"/>
        <div class="progress ">
            <div class="progress-bar bg-success " role="progressbar" style="width: 25%"
                 aria-valuenow="0"
                 aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>
</template>

<script>
  export default {
    mounted() {

    },

    data() {
      return {};
    },

    methods: {
      handleClick() {
        console.log('clicked.');
        this.$emit('open-modal', null);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .image-card {
        display: inline-block;
        position: relative;
        vertical-align: bottom;
    }


</style>