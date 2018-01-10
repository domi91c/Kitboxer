// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require trix
//= require turbolinks
//= require popper
//= require tether
//= require bootstrap-sprockets
//= require rails.validations
//= require stripe
//= require_tree .

document.addEventListener('turbolinks:load', function() {
  $('.hero-dropdown-menu').on('click', 'div', function() {
    console.log('clicked menu')
    $('.hero-dropdown-toggle').text($(this).text())
  })

  $('.carousel').carousel({
    interval: false
  })
})

$('.js-subscription-form')
    .on('ajax:error', function(event, xhr, status, error) {
      // insert the failure message inside the "#account_settings" element
      $(this).append(xhr.responseText)
    })

