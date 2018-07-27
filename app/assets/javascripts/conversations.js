document.addEventListener('turbolinks:load', function() {
  $('.modal-overlay').on('shown.bs.modal', function() {
    $('.conversation__header').click(function() {
      alert('bottom!')
    })
  })
})

function initConversationsOverlay() {
  $('.conversation__body').scroll(function() {
    if ($(this).scrollTop() === 0) {
      loadPreviousMessages()
    }
  })
  $('.conversation__body').scrollTop($('.conversation__body').height())

  let fileInput = $('.conversation__fileInput')
  fileInput.on('change', () => {
    $('.conversation__fileInputDetails').show()
    $('.conversation__fileInputFileName').html(
        fileInput.val(),
    )
  })
  $('.conversation__fileInputCancel').on('click', () => {
    fileInput.val('')
    $('.conversation__fileInputDetails').hide()
  })
}

/*$('.conversationList__item--active')
    .scrollTop($('.conversationList').height())
$('.conversation__inputGroup.form-control').keypress(function(event) {
})

if ($('.conversationList__item--active')) {
  $('.conversationList__item--active')
  $('.conversationList').animate({
    scrollTop: $('.conversationList__item--active').offset() - 100,
  }, 0)
}*/

function loadPreviousMessages() {
  $('.conversation__loading').html(
      '<h1 class="text-center">' +
      '<i class="fa fa-spinner fa-spin"></i>' +
      '</h1>')

  Rails.ajax('url')
}
