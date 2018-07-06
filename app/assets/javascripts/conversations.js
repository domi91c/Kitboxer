document.addEventListener('turbolinks:load', function() {
  $('.conversation__body').scrollTop($(this).height())
  $('.conversationList__item--active')
      .scrollTop($('.conversationList').height())
  $('.conversation__inputGroup.form-control').keypress(function(event) {
  })

  if ($('.conversationList__item--active')) {
    $('.conversationList__item--active')
    $('.conversationList').animate({
      scrollTop: $('.conversationList__item--active').offset().top - 100,
    }, 0)
  }

  $('.conversation__fileInput').on('change', () => {
    $('.conversation__fileInputDetails').show()
  })

})
