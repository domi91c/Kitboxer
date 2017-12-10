// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.js-quantity-decrease').click(function() {
    var quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) - 1))
  })
  $('.js-quantity-increase').click(function() {
    var quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) + 1))
  })
})

