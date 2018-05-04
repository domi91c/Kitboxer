document.addEventListener('turbolinks:load', function() {
  if (location.hash) {
    $('a[href=\'' + location.hash + '\']').tab('show')
  }
  let activeTab = localStorage.getItem('activeTab')
  if (activeTab) {
    $('a[href="' + activeTab + '"]').tab('show')
  }

  $('body').on('click', 'a[data-toggle=\'tab\']', function(e) {
    e.preventDefault()
    let tabName = this.getAttribute('href')
    if (history.pushState) {
      history.pushState(null, null, tabName)
    }
    else {
      location.hash = tabName
    }
    localStorage.setItem('activeTab', tabName)

    $(this).tab('show')
    return false
  })
  $(window).on('popstate', function() {
    let anchor = location.hash ||
        $('a[data-toggle=\'tab\']').first().attr('href')
    $('a[href=\'' + anchor + '\']').tab('show')
  })
})