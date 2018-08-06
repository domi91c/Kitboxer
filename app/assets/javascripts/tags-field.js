(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory)
  } else if (typeof exports !== 'undefined' && typeof module !==
      'undefined') {factory(exports, module)} else {
    var mod = { exports: {} }
    factory(mod.exports, mod)
    global.tagsField = mod.exports
  }
})(this, function(exports, module) {
  'use strict'
  module.exports = tagsField

  function tagsField() {
    function createElement(
        type, name, text, attributes) {
      var el = document.createElement(type)
      if (name) el.className = name
      if (text) el.textContent = text
      for (var key in attributes) {
        el.setAttribute('data-' + key, attributes[key])
      }
      return el
    }
  }
})
