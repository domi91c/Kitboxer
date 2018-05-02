function plugin(Vue, options) {
  Vue.mixin({
    mounted() {
      if (this === this.$root &&
          document.querySelector('.js-hide-before-load')) {
        let containerEl = document.querySelector('.js-hide-before-load')
        let loadEl = document.querySelector('.js-load')
        containerEl.style.display = 'block'
        loadEl.style.display = 'none'
      }
    },
    destroyed() {
      if (this === this.$root &&
          document.querySelector('.js-hide-before-load')) {
        let containerEl = document.querySelector('.js-hide-before-load')
        // containerEl.style.display = 'none'
        console.log('destroyed')
      }
    },
  })
}

export default plugin