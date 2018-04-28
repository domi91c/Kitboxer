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