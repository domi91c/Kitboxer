$('.js-subscription-form')
    .on('ajax:error', function(event, xhr, status, error) {
      // insert the failure message inside the "#account_settings" element
      $(this).append(xhr.responseText)
    })
