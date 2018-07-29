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

let initPurchaseConversationOverlay = function() {
  let currentModal = $('.modal.show')
  let container = currentModal.find($('.js-purchase-conversation-body'))
  let body = container.find($('.purchase-conversation__body'))
  body.scrollTop(100000)

  body.scroll(function() {
    if ($(this).scrollTop() === 0) {
      loadPreviousMessages()
    }
  })

  var fileInput = $('.purchase-conversation__fileInput')
  fileInput.on('change', () => {
    $('.purchase-conversation__fileInputDetails').show()
    $('.purchase-conversation__fileInputFileName').html(
        fileInput.val(),
    )
  })
  $('.purchase-conversation__fileInputCancel').on('click', () => {
    fileInput.val('')
    $('.purchase-conversation__fileInputDetails').hide()
  })
}

function loadPreviousMessages() {
  $('.purchase-conversation__loading').html(
      '<h1 class="text-center">' +
      '<i class="fa fa-spinner fa-spin"></i>' +
      '</h1>')

  Rails.ajax('url')
}
