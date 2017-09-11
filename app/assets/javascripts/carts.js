// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.js-quantity-decrease').click(function() {
    let id = $(this).closest('[data-product-id]').data('product-id')
    let quantityField = $('tr').find(`[data-product-id="${id}"]`)
    quantityField.val(Math.max(1, Number(quantityField.val()) - 1))
  })
  $('.js-quantity-increase').click(function() {
    let id = $(this).closest('[data-product-id]').data('product-id')
    let quantityField = $('tr').find(`[data-product-id="${id}"]`)
    quantityField.val(Math.max(1, Number(quantityField.val()) + 1))
  })
})

