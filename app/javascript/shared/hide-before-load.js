function plugin(Vue, options) {
  // Install a global mixin
  Vue.mixin({
    mounted() {
      if (this === this.$root &&
          document.getElementsByClassName('js-hide-before-load').length > 0) {
        let containerEl = document.getElementsByClassName(
            'js-hide-before-load')
        containerEl[0].classList.remove('js-hide-before-load')
      }
    },
  })
}

export default plugin