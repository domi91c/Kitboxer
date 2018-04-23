<template>
    <div class="d-inline mr-2" style="user-select: none;">
        <span @click="decrement"><i class="mr-2 fa fa-minus cart-icon "></i></span>
        <input :name="name" type="text" class="form-control d-inline-block col-2" v-model="newValue">
        <span @click="increment"><i class="ml-2 fa fa-plus cart-icon"></i></span>
    </div>
</template>

<script>
  export default {
    mounted() {

    },
    props: ['name', 'value'],
    data() {
      return {
        newValue: this.value,
      }
    },

    methods: {
      increment() {
        this.newValue++
      },
      decrement() {
        if (this.newValue > 0) {
          this.newValue--
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>