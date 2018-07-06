// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.rating-field').each((i, el) => {
    let stars = $(el).children()
    let currentValue = $(el).data('rating')
    let selectedStars = stars.filter(function() {
      return $(this).data('value') <= currentValue
    })
    stars.removeClass('rating__icon--checked')
    selectedStars.addClass('rating__icon--checked')
    $(this)
        .parent()
        .find('input').val(currentValue)
        .val(currentValue)
  })
  $('.rating-field > .rating__icon').hover(
      function() {
        let stars = $(this).parent().children()
        let currentValue = $(this).data('value')
        let selectedStars = stars.filter(function() {
          return $(this).data('value') <= currentValue
        })
        let unSelectedStars = stars.filter(function() {
          return $(this).data('value') > currentValue
        })
        selectedStars.addClass('rating__icon--hover')
        unSelectedStars.removeClass('rating__icon--hover')
      },
      function() {
        let stars = $(this).parent().children()
        stars.removeClass('rating__icon--hover')
      })
  $('.rating-field .rating__icon').click(function() {
    let stars = $(this).parent().children()
    let currentValue = $(this).data('value')
    let selectedStars = stars.filter(function() {
      return $(this).data('value') <= currentValue
    })
    stars.removeClass('rating__icon--checked')
    selectedStars.addClass('rating__icon--checked')
    $(this)
        .parent()
        .find('input').val(currentValue)
        .val(currentValue)
  })
})
