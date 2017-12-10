// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.js-quantity-decrease').click(function() {
    let quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) - 1))
  })
  $('.js-quantity-increase').click(function() {
    console.log(this)
    let quantityField = $(this).siblings('.js-quantity-input')
    quantityField.val(Math.max(0, Number(quantityField.val()) + 1))
  })
})

// document.addEventListener('turbolinks:load', function() {
//   $('.js-quantity-decrease').click(function() {
//     console.log(this)
//     var id = $(this).closest('[data-product-id]').data('product-id')
//     var quantityField = $('form').find('[data-product-id="' + id + '"]')
//
//     quantityField.val(Math.max(1, Number(quantityField.val()) - 1))
//   })
//   $('.js-quantity-increase').click(function() {
//     var id = $(this).closest('[data-product-id]').data('product-id')
//     var quantityField = $('form').find('[data-product-id="' + id + '"]')
//     quantityField.val(Math.max(1, Number(quantityField.val()) + 1))
//   })
// })

