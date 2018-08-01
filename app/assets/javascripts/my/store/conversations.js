document.addEventListener('turbolinks:load', function() {
  var template = _.template(
      '<span class="initials ${id}">${object.initials}</span> ' +
      '${name} [${object.product}]')
  var $input = $('.typeahead')
  $input.typeahead({
    source: [
      {
        id: '1',
        name: 'Patrick Wallabee',
        object: { initials: 'PW', product: 'Arduino Kit for babies' },
      },
      {
        id: '2',
        name: 'Beatrice Potter',
        object: { initials: 'BP', product: 'Arduino Kit for babies' },
      },
      {
        id: '3',
        name: 'Patrick Wisnton',
        object: { initials: 'PW', product: 'Arduino Kit for babies' },
      },
      {
        id: '4',
        name: 'John Allies',
        object: { initials: 'JA', product: 'Arduino Kit for babies' },
      },
    ],
    autoSelect: true,
    theme: 'bootstrap4',
    displayText: template,
    afterSelect: function(item) { $input.val(item.name).change() },
  })
  $input.change(function() {
    var current = $input.typeahead('getActive')
    if (current) {
      // Some item from your model is active!
      if (current.name == $input.val()) {
        // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
      } else {
        // This means it is only a partial match, you can either add a new item
        // or take the active if you don't want new items
      }
    } else {
      // Nothing is active so it is a new value (or maybe empty value)
    }
  })

})
