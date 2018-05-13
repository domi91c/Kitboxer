document.addEventListener('turbolinks:load', function() {
  $('.conversation__body').scrollTop($(this).height())
  $('.conversation__inputGroup.form-control').keypress(function(event) {
  })
})
