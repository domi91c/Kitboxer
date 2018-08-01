//= require jquery
//= require rails-ujs
//= require jquery.remotipart
//= require trix
//= require turbolinks
//= require popper
//= require lodash
//= require select2
//= require bootstrap-sprockets
//= require bootstrap-tagsinput
//= require_directory ./bootstrap-overrides
//= require typeahead
//= require my/store/conversations
//= require rails.validations
//= require stripe
//= require jquery.fancybox
//= require products
//= require carts
//= require reviews
//= require users
//= require conversations
//= require coming_soon

(function($) {

  var ready = $.fn.ready
  $.fn.ready = function(fn) {
    if (this.context === undefined) {
      // The $().ready(fn) case.
      ready(fn)
    } else if (this.selector) {
      ready($.proxy(function() {
        $(this.selector, this.context).each(fn)
      }, this))
    } else {
      ready($.proxy(function() {
        $(this).each(fn)
      }, this))
    }
  }
})(jQuery)

document.addEventListener('turbolinks:load', function() {
  $('.hero-dropdown-menu').on('click', 'div', function() {
    $('.hero-dropdown-toggle').text($(this).text())
  })

  // fixes bug with multiple active tabs
  $('.nav-tabs .nav-item .nav-link')
      .click(function() {
        this.find('.active').removeClass('active')
      })

})

// Tooltips
$(function() {
  $('[data-toggle="tooltip"]').tooltip()

  $("input").tagsinput('items')


})
