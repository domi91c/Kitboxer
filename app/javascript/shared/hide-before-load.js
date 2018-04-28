function plugin(Vue, options) {
  Vue.mixin({
    mounted() {
      if (this === this.$root &&
          document.getElementsByClassName('js-hide-before-load').length > 0) {
        let containerEl = document.querySelector('.js-hide-before-load')
        let loadEl = document.querySelector('.js-load')
        containerEl.classList.remove('js-hide-before-load')
        loadEl.style.display = 'none'
      }
    },
  })
}

export default plugin