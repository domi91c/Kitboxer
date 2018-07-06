// place all the behaviors and hooks related to the matching controller here.
// all this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.carousel').carousel({
    interval: false,
  })

  let quantityField = $('.js-quantity-input')
  let productQuantity = quantityField.data('productQuantity')
  $('.js-quantity-decrease').click(function() {
    quantityField.val(Math.max(0, Number(quantityField.val()) - 1))
    // $(this).closest('form').submit()
  })
  $('.js-quantity-increase').click(function() {
    if (quantityField.val() < productQuantity) {
      quantityField.val(Math.max(0, Number(quantityField.val()) + 1))
      // $(this).closest('form').submit()
    }
  })

  $('.js-show-reviews').click(function() {
    $('html, body').animate({
      scrollTop: $('.js-product-tabs').offset().top,
    }, 500)
    $('.js-product-tabs a[href="#reviews"]').tab('show')
  })
})
