document.addEventListener('turbolinks:load', function() {
  $('.conversation__body').scrollTop($(this).height())
  $('.conversationList__item--active')
      .scrollTop($('.conversationList').height())
  $('.conversation__inputGroup.form-control').keypress(function(event) {
  })
})
