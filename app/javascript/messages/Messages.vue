<template>
    <div class="container">
        <div class="row">
            <aside class="col-md-2">
                <folders></folders>
            </aside>
            <main class="col-md-10">
                <div>Messages App</div>
            </main>
        </div>
    </div>
</template>

<script>
  import Folders from './components/Folders.vue'
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    components: {
      Folders,
    },
    mounted() {

    },

    data() {
      return {}
    },

    methods: {},
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/


</style>