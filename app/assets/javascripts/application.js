//= require jquery
//= require rails-ujs
//= require trix
//= require turbolinks
//= require popper
//= require bootstrap-sprockets
//= require rails.validations
//= require stripe
//= require products
//= require users
//= require coming_soon
//= require_tree .

document.addEventListener('turbolinks:load', function() {
  $('.hero-dropdown-menu').on('click', 'div', function() {
    $('.hero-dropdown-toggle').text($(this).text())
  })

  $('.carousel').carousel({
    interval: false,
  })

  // fixes bug with multiple active tabs
  $('.nav-tabs .nav-item .nav-link')
      .click(function() {
        this.find('.active').removeClass('active')
      })
})
