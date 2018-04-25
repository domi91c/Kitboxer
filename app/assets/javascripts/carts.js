// place all the behaviors and hooks related to the matching controller here.
// all this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.js-cart-quantity-decrease').click(function() {
    var quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) - 1))
    $(this).closest('form').submit()
  })
  $('.js-cart-quantity-increase').click(function() {
    var quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) + 1))
    $(this).closest('form').submit()
  })
})

