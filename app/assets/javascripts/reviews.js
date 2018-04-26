// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('turbolinks:load', function() {
  $('.rating__icon').hover(
      function() {
        let currentStar = $(this).data('value')
        let selectedStars = $(this).parent().children().filter(function() {
          return $(this).data('value') <= currentStar
        })
        let unSelectedStars = $(this).parent().children().filter(function() {
          return $(this).data('value') > currentStar
        })
        selectedStars.addClass('rating__icon--hover')
        unSelectedStars.removeClass('rating__icon--hover')
      },
      function() {
        $(this).parent().children().removeClass('rating__icon--hover')
      })
  $('.rating__icon').click(function() {
    let currentStar = $(this).data('value')
    let selectedStars = $(this).parent().children().filter(function() {
      return $(this).data('value') <= currentStar
    })
    $(this).parent().children().removeClass('rating__icon--checked')
    selectedStars.addClass('rating__icon--checked')
    $(this)
        .closest('.form-group')
        .find('input[name*=\'score\']').val(currentStar)
        .val(currentStar)
  })
})
