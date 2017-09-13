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
//= require tether/dist/js/tether
//= require popper
//= require bootstrap-sprockets
//= require rails.validations

//= require_tree .

document.addEventListener('turbolinks:load', function() {
  var stripe = Stripe('pk_test_7S4vSqmHfCHOJlBaJvZ4pV0A')
  // Create an instance of Elements
  var elements = stripe.elements()

  // Custom styling can be passed to options when creating an Element.
  // (Note that this demo uses a wider set of styles than the guide below.)
  var style = {
    base: {
      color: '#393F58',
      lineHeight: '24px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#393F58',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  }

  // Create an instance of the card Element
  var card = elements.create('card', { style: style })

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element')

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors')
    if (event.error) {
      displayError.textContent = event.error.message
    } else {
      displayError.textContent = ''
    }
  })

  // Handle form submission
  var form = document.getElementById('payment-form')
  form.addEventListener('submit', function(event) {
    event.preventDefault()

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors')
        errorElement.textContent = result.error.message
      } else {
        // Send the token to your server
        stripeTokenHandler(result.token)
      }
    })
  })

  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form')
    var hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', 'stripe_token')
    hiddenInput.setAttribute('value', token.id)
    form.appendChild(hiddenInput)

    // Submit the form
    form.submit()
  }
})
