document.addEventListener('turbolinks:load', function() {
  $('#product-count-decrease').click(function() {
    console.log('decrease count test');
    $('#product-count').val(Math.max(1, Number($('#product-count').val()) - 1));

  });
  $('#product-count-increase').click(function() {
    console.log('increase count test');
    $('#product-count').val(Math.max(1, Number($('#product-count').val()) + 1));

  });
});
