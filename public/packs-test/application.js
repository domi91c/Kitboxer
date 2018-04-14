/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs-test/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 101);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(106)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(62);
var isBuffer = __webpack_require__(120);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function handleVueDestruction(vue) {
  document.addEventListener('turbolinks:before-render', function teardown() {
    vue.$destroy();
    document.removeEventListener('turbolinks:before-render', teardown);
  });
}

var TurbolinksAdapter = {
  beforeMount: function() {
    if (this.$el.parentNode) {
      handleVueDestruction(this);
      this.$originalEl = this.$el.outerHTML;
    }
  },
  destroyed: function() {
    this.$el.outerHTML = this.$originalEl;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (TurbolinksAdapter);


/***/ }),
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.4.1
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "test" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "test" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (true) {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("test" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "test" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "test" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "test" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("test" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (true) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("test" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "test" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "test" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("test" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listensers hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data && parentVnode.data.attrs;
  vm.$listeners = listeners;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("test" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "test" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType (vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn(
      ("component option \"" + name + "\" should be an object."),
      vm
    );
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "test" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "test" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  "test" !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (true) {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  "test" !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (true) {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  "test" !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if ("test" !== 'production' && !hasOwn(result, key)) {
        warn(("Injection \"" + key + "\" not found"), vm);
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // keep listeners
  var listeners = data.on;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "test" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("test" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "test" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "test" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "test" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', parentData && parentData.on, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, null, true);
    defineReactive$$1(vm, '$listeners', parentData && parentData.on, null, true);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (true) {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("test" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("test" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("test" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("test" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (true) {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (true) {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.4.1';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "test" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("test" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("test" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (true) {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("test" !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "test" !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (modelRs.exp) + ", " + (modelRs.idx) + ", " + assignment + ")")
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (true) {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (true) {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  var isComponentRoot = isDef(vnode.componentOptions);
  var oldOn = isComponentRoot ? oldVnode.data.nativeOn : oldVnode.data.on;
  var on = isComponentRoot ? vnode.data.nativeOn : vnode.data.on;
  if (isUndef(oldOn) && isUndef(on)) {
    return
  }
  on = on || {};
  oldOn = oldOn || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("test" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("test" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "test" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1 && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1 && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("test" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("test" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("test" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("test" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\"/>";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("test" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (true) {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      if (shouldIgnoreFirstNewline(lastTag, html)) {
        advance(1);
      }
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("test" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("test" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "test" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        if (true) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (true) {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (true) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("test" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "test" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (true) {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("test" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("test" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (!el.component && (
          isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("test" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (true) {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "test" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if ("test" !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function on (el, dir) {
  if ("test" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "test" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("test" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("test" !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el, state) || 'void 0'
      : genElement(el, state)) + "}}"
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e('" + (comment.text) + "')")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    if (true) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (true) {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (true) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (true) {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "test" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("test" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (true) {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("test" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("test" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

/* harmony default export */ __webpack_exports__["a"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(38)))

/***/ }),
/* 38 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(40);

var _vue2 = _interopRequireDefault(_vue);

var _cropperjs = __webpack_require__(112);

var _cropperjs2 = _interopRequireDefault(_cropperjs);

__webpack_require__(113);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var CropperComponent = _vue2.default.extend({
    render: function render(h) {
        return h('div', { style: this.containerStyle }, [h('img', {
            ref: 'img',
            attrs: {
                src: this.src,
                alt: this.alt || 'image',
                style: 'max-width: 100%'
            },
            style: this.imgStyle
        })]);
    },

    props: {
        'containerStyle': Object,
        'data': Object,
        'preview': String,
        'src': {
            type: String,
            default: ''
        },
        'alt': String,
        'imgStyle': Object,
        'dragMode': String,
        'responsive': {
            type: Boolean,
            default: true
        },
        'restore': {
            type: Boolean,
            default: true
        },
        'checkCrossOrigin': {
            type: Boolean,
            default: true
        },
        'checkOrientation': {
            type: Boolean,
            default: true
        },
        'cropBoxMovable': {
            type: Boolean,
            default: true
        },
        'cropBoxResizable': {
            type: Boolean,
            default: true
        },
        'toggleDragModeOnDblclick': {
            type: Boolean,
            default: true
        },
        'modal': {
            type: Boolean,
            default: true
        },
        'center': {
            type: Boolean,
            default: true
        },
        'highlight': {
            type: Boolean,
            default: true
        },
        'zoomOnTouch': {
            type: Boolean,
            default: true
        },
        'zoomOnWheel': {
            type: Boolean,
            default: true
        },
        'scalable': {
            type: Boolean,
            default: true
        },
        'zoomable': {
            type: Boolean,
            default: true
        },
        'guides': {
            type: Boolean,
            default: true
        },
        'background': {
            type: Boolean,
            default: true
        },
        'autoCrop': {
            type: Boolean,
            default: true
        },
        'movable': {
            type: Boolean,
            default: true
        },
        'rotatable': {
            type: Boolean,
            default: true
        },
        'viewMode': Number,
        'aspectRatio': Number,
        'autoCropArea': Number,
        'wheelZoomRatio': Number,

        // Size limitation
        'minCanvasWidth': Number,
        'minCanvasHeight': Number,
        'minCropBoxWidth': Number,
        'minCropBoxHeight': Number,
        'minContainerWidth': Number,
        'minContainerHeight': Number,

        // callbacks
        'ready': Function,
        'cropstart': Function,
        'cropmove': Function,
        'cropend': Function,
        'crop': Function
        // 'zoom': Function
    },
    mounted: function mounted() {
        var _$options$props = this.$options.props,
            containerStyle = _$options$props.containerStyle,
            src = _$options$props.src,
            alt = _$options$props.alt,
            imgStyle = _$options$props.imgStyle,
            data = _objectWithoutProperties(_$options$props, ['containerStyle', 'src', 'alt', 'imgStyle']);

        var props = {};

        for (var key in data) {
            if (this[key] !== undefined) {
                props[key] = this[key];
            }
        }

        this.cropper = new _cropperjs2.default(this.$refs.img, props);
    },

    methods: {
        reset: function reset() {
            return this.cropper.reset();
        },
        clear: function clear() {
            return this.cropper.clear();
        },
        replace: function replace(url, onlyColorChanged) {
            return this.cropper.replace(url, onlyColorChanged);
        },
        enable: function enable() {
            return this.cropper.enable();
        },
        disable: function disable() {
            return this.cropper.disable();
        },
        destroy: function destroy() {
            return this.cropper.destroy();
        },
        move: function move(offsetX, offsetY) {
            return this.cropper.move(offsetX, offsetY);
        },
        moveTo: function moveTo(x, y) {
            return this.cropper.moveTo(x, y);
        },
        zoom: function zoom(ratio, _originalEvent) {
            return this.cropper.zoom(ratio, _originalEvent);
        },
        zoomTo: function zoomTo(ratio, _originalEvent) {
            return this.cropper.zoomTo(ratio, _originalEvent);
        },
        rotate: function rotate(degree) {
            return this.cropper.rotate(degree);
        },
        rotateTo: function rotateTo(degree) {
            return this.cropper.rotateTo(degree);
        },
        scale: function scale(scaleX, scaleY) {
            return this.cropper.scale(scaleX, scaleY);
        },
        scaleX: function scaleX(_scaleX) {
            return this.cropper.scaleX(_scaleX);
        },
        scaleY: function scaleY(_scaleY) {
            return this.cropper.scaleY(_scaleY);
        },
        getData: function getData(rounded) {
            return this.cropper.getData(rounded);
        },
        setData: function setData(data) {
            return this.cropper.setData(data);
        },
        getContainerData: function getContainerData() {
            return this.cropper.getContainerData();
        },
        getImageData: function getImageData() {
            return this.cropper.getImageData();
        },
        getCanvasData: function getCanvasData() {
            return this.cropper.getCanvasData();
        },
        setCanvasData: function setCanvasData(data) {
            return this.cropper.setCanvasData(data);
        },
        getCropBoxData: function getCropBoxData() {
            return this.cropper.getCropBoxData();
        },
        setCropBoxData: function setCropBoxData(data) {
            return this.cropper.setCropBoxData(data);
        },
        getCroppedCanvas: function getCroppedCanvas(options) {
            return this.cropper.getCroppedCanvas(options);
        },
        setAspectRatio: function setAspectRatio(aspectRatio) {
            return this.cropper.setAspectRatio(aspectRatio);
        },
        setDragMode: function setDragMode(mode) {
            return this.cropper.setDragMode(mode);
        }
    }
});

var VueCropper = _vue2.default.component('vue-cropper', CropperComponent);

exports.default = VueCropper;

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.4.1
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "test" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "test" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (true) {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("test" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "test" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "test" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "test" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("test" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (true) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("test" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "test" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "test" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("test" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listensers hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data && parentVnode.data.attrs;
  vm.$listeners = listeners;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("test" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "test" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType (vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn(
      ("component option \"" + name + "\" should be an object."),
      vm
    );
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "test" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "test" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  "test" !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (true) {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  "test" !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (true) {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  "test" !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if ("test" !== 'production' && !hasOwn(result, key)) {
        warn(("Injection \"" + key + "\" not found"), vm);
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // keep listeners
  var listeners = data.on;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "test" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("test" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "test" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "test" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "test" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', parentData && parentData.on, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, null, true);
    defineReactive$$1(vm, '$listeners', parentData && parentData.on, null, true);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (true) {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("test" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("test" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("test" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("test" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (true) {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (true) {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.4.1';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "test" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("test" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("test" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (true) {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("test" !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;



function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */


/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var str;
var index$1;

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  var isComponentRoot = isDef(vnode.componentOptions);
  var oldOn = isComponentRoot ? oldVnode.data.nativeOn : oldVnode.data.on;
  var on = isComponentRoot ? vnode.data.nativeOn : vnode.data.on;
  if (isUndef(oldOn) && isUndef(on)) {
    return
  }
  on = on || {};
  oldOn = oldOn || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("test" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("test" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "test" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1 && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1 && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("test" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("test" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("test" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("test" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(38)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(9);
var normalizeHeaderName = __webpack_require__(122);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(63);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(63);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadImages */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return uploadImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return removeImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setCoverImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cropImage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


__WEBPACK_IMPORTED_MODULE_0_axios___default.a.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

var BASE_URL = '';
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3002';
} else if (window.environment === 'production') {
  BASE_URL = 'https://www.kitboxer.com';
}

function loadImages(productId) {
  var url = BASE_URL + '/products/' + productId + '/images';
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get(url).then(function (x) {
    return x.request.response;
  }).catch(function (error) {
    return error;
  });
}

function uploadImage(imageData, onProgress) {
  var formData = new FormData();
  formData.append('image[image]', imageData.file);
  formData.append('image[product_id]', imageData.productId);
  var url = BASE_URL + '/products/' + imageData.productId + '/images';
  var config = {
    onUploadProgress: function onUploadProgress(progressEvent) {
      var percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
      if (onProgress) onProgress(percentCompleted, imageData);
    }
  };
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post(url, formData, config).then(function (x) {
    return x.request.response;
  }).catch(function (error) {
    return error;
  });
}

function removeImage(imageData) {
  var url = BASE_URL + '/products/' + imageData.productId + '/images/' + imageData.id;
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.delete(url).then(function (x) {
    return x.request.response;
  }).catch(function (error) {
    return error;
  });
}

function setCoverImage(imageData, productId) {
  var url = BASE_URL + '/products/' + imageData.productId + '/images/' + imageData.id + '/set_cover_image';
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.patch(url).then(function (x) {
    return x.request.response;
  }).catch(function (error) {
    return error;
  });
}

function cropImage(imageData) {
  var url = BASE_URL + '/products/' + imageData.productId + '/images/' + imageData.id;
  var formData = new FormData();
  formData.append('image[crop_data]', JSON.stringify(imageData.cropData));
  formData.append('image[product_id]', imageData.productId);
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.patch(url, formData).then(function (x) {
    return x.request.response;
  }).catch(function (error) {
    return error;
  });
}



/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadAvatar */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return uploadAvatar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


__WEBPACK_IMPORTED_MODULE_0_axios__["defaults"].headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

var BASE_URL = '';
if (window.environment === 'development') {
  BASE_URL = 'http://localhost:3001';
} else if (window.environment === 'production') {
  BASE_URL = 'http://138.197.153.164';
}

function loadAvatar(memberId) {
  var url = BASE_URL + '/avatars';
  return __WEBPACK_IMPORTED_MODULE_0_axios__["get"](url, { params: { user_id: memberId } }).then(function (x) {
    return x;
  }).catch(function (error) {
    console.log(error);
  });
}

function uploadAvatar(formData) {
  var url = BASE_URL + '/avatars';
  return __WEBPACK_IMPORTED_MODULE_0_axios__["post"](url, formData).then(function (x) {
    return JSON.parse(x.request.response);
  }).catch(function (error) {
    console.log(error);
  });
}



/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(119);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var settle = __webpack_require__(123);
var buildURL = __webpack_require__(125);
var parseHeaders = __webpack_require__(126);
var isURLSameOrigin = __webpack_require__(127);
var createError = __webpack_require__(64);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(128);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (false) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(129);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(124);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_avatar__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_image_uploader__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_guide_editor__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lightbox__ = __webpack_require__(191);
/* eslint no-console:0 */






/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__avatar_Avatar_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__avatar_Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__avatar_Avatar_vue__);




document.addEventListener('DOMContentLoaded', function () {

  var el = document.querySelector('.js-avatar');
  if (el !== null) {
    var props = JSON.parse(el.getAttribute('data'));

    new __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__["a" /* default */]({
      render: function render(h) {
        return h(__WEBPACK_IMPORTED_MODULE_2__avatar_Avatar_vue___default.a, { props: props });
      },
      mixins: [__WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__["a" /* default */]]
    }).$mount('.js-avatar');
  }
});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(107),
  /* template */
  __webpack_require__(139),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-5adf658a",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/avatar/Avatar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Avatar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5adf658a", Component.options)
  } else {
    hotAPI.reload("data-v-5adf658a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(105);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("fe66d87e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5adf658a\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Avatar.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5adf658a\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Avatar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(undefined);
// imports


// module
exports.push([module.i, "\n.user-photo[data-v-5adf658a] {\n  height: 300px;\n  width: 300px;\n  border: 1px solid black;\n}", ""]);

// exports


/***/ }),
/* 106 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_CropModal_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_CropModal_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_CropModal_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_js__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__images_400300_jpg__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__images_400300_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__images_400300_jpg__);
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    CropModal: __WEBPACK_IMPORTED_MODULE_0__components_CropModal_vue___default.a
  },
  mounted: function mounted() {
    //      this.currentImage = this.person.avatar.url;
  },

  props: ['person'],
  data: function data() {
    return {
      cropImage: null,
      image: '',
      currentImage: ''
    };
  },

  methods: {
    changeAvatar: function changeAvatar() {
      $('#cropModal').modal('show');
      this.cropImage = this.image;
    },
    setNewAvatar: function setNewAvatar(avatar) {
      this.currentImage = avatar.url;
    }
  }
});

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(111),
  /* template */
  __webpack_require__(137),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/avatar/components/CropModal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CropModal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b5b1e16", Component.options)
  } else {
    hotAPI.reload("data-v-3b5b1e16", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("1543cb7c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b5b1e16\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CropModal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b5b1e16\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CropModal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(undefined);
// imports


// module
exports.push([module.i, "\n.img-container {\n  max-width: 100%;\n  height: 500px;\n}\n.inputfile {\n  width: 0.1px;\n  height: 0.1px;\n  opacity: 0;\n  overflow: hidden;\n  position: absolute;\n  z-index: -1;\n}\n.drop-box {\n  position: absolute;\n  border: 2px dashed #666;\n  background-color: #ccc;\n  width: 95%;\n  height: 500px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.loading {\n  width: 95%;\n  height: 500px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.drop-box-text {\n  font-size: 26px;\n}\n.v-spinner {\n  position: absolute;\n  top: 50%;\n  margin: 0 auto;\n  width: 100%;\n}", ""]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_spinner_src_PulseLoader_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_spinner_src_PulseLoader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_spinner_src_PulseLoader_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model__ = __webpack_require__(60);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    VueCropper: __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default.a,
    PulseLoader: __WEBPACK_IMPORTED_MODULE_1_vue_spinner_src_PulseLoader_vue___default.a
  },
  props: ['image', 'person'],
  data: function data() {
    return {
      currentImage: {},
      cropperActive: false,
      cropperLoading: false,
      formData: new FormData()
    };
  },
  mounted: function mounted() {
    console.log('hello');
  },
  updated: function updated() {
    this.$refs.cropper.enable();
  },

  methods: {
    handleFileInput: function handleFileInput(event) {
      this.currentImage = event.target.files[0];
      this.$refs.cropper.reset();
      var reader = new FileReader();
      var self = this;
      reader.onload = function () {
        self.cropperLoading = false;
        self.$refs.cropper.replace(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.cropperActive = true;
      this.cropperLoading = true;
    },
    handleReset: function handleReset() {
      this.$refs.file.value = '';
      this.$refs.cropper.destroy();
      this.cropperActive = false;
    },
    handleSubmit: function handleSubmit() {
      var _this = this;

      $('#cropModal').modal('hide');
      var cropData = this.$refs.cropper.getData();
      var fd = new FormData();
      fd.append('crop_data', JSON.stringify(cropData));
      fd.append('avatar', this.currentImage);
      Object(__WEBPACK_IMPORTED_MODULE_2__model__["a" /* uploadAvatar */])(fd).then(function (x) {
        _this.$emit('submit', x);
      }).catch(function (x) {});
    }
  }
});

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Cropper.js v0.8.1
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2015-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-09-03T04:55:16.458Z
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _defaults = __webpack_require__(1);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _template = __webpack_require__(2);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _render = __webpack_require__(3);
	
	var _render2 = _interopRequireDefault(_render);
	
	var _preview = __webpack_require__(5);
	
	var _preview2 = _interopRequireDefault(_preview);
	
	var _events = __webpack_require__(6);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _handlers = __webpack_require__(7);
	
	var _handlers2 = _interopRequireDefault(_handlers);
	
	var _change = __webpack_require__(8);
	
	var _change2 = _interopRequireDefault(_change);
	
	var _methods = __webpack_require__(9);
	
	var _methods2 = _interopRequireDefault(_methods);
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Constants
	var NAMESPACE = 'cropper';
	
	// Classes
	var CLASS_HIDDEN = NAMESPACE + '-hidden';
	
	// Events
	var EVENT_ERROR = 'error';
	var EVENT_LOAD = 'load';
	var EVENT_READY = 'ready';
	var EVENT_CROP = 'crop';
	
	// RegExps
	var REGEXP_DATA_URL = /^data:/;
	var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg.*;base64,/;
	
	var AnotherCropper = void 0;
	
	var Cropper = function () {
	  function Cropper(element, options) {
	    _classCallCheck(this, Cropper);
	
	    var self = this;
	
	    self.element = element;
	    self.options = $.extend({}, _defaults2.default, $.isPlainObject(options) && options);
	    self.loaded = false;
	    self.ready = false;
	    self.complete = false;
	    self.rotated = false;
	    self.cropped = false;
	    self.disabled = false;
	    self.replaced = false;
	    self.limited = false;
	    self.wheeling = false;
	    self.isImg = false;
	    self.originalUrl = '';
	    self.canvasData = null;
	    self.cropBoxData = null;
	    self.previews = null;
	    self.init();
	  }
	
	  _createClass(Cropper, [{
	    key: 'init',
	    value: function init() {
	      var self = this;
	      var element = self.element;
	      var tagName = element.tagName.toLowerCase();
	      var url = void 0;
	
	      if ($.getData(element, NAMESPACE)) {
	        return;
	      }
	
	      $.setData(element, NAMESPACE, self);
	
	      if (tagName === 'img') {
	        self.isImg = true;
	
	        // e.g.: "img/picture.jpg"
	        self.originalUrl = url = element.getAttribute('src');
	
	        // Stop when it's a blank image
	        if (!url) {
	          return;
	        }
	
	        // e.g.: "http://example.com/img/picture.jpg"
	        url = element.src;
	      } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
	        url = element.toDataURL();
	      }
	
	      self.load(url);
	    }
	  }, {
	    key: 'load',
	    value: function load(url) {
	      var self = this;
	      var options = self.options;
	      var element = self.element;
	
	      if (!url) {
	        return;
	      }
	
	      self.url = url;
	      self.imageData = {};
	
	      if (!options.checkOrientation || !window.ArrayBuffer) {
	        self.clone();
	        return;
	      }
	
	      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
	      if (REGEXP_DATA_URL.test(url)) {
	        if (REGEXP_DATA_URL_JPEG) {
	          self.read($.dataURLToArrayBuffer(url));
	        } else {
	          self.clone();
	        }
	        return;
	      }
	
	      var xhr = new XMLHttpRequest();
	
	      xhr.onerror = xhr.onabort = function () {
	        self.clone();
	      };
	
	      xhr.onload = function () {
	        self.read(xhr.response);
	      };
	
	      if (options.checkCrossOrigin && $.isCrossOriginURL(url) && element.crossOrigin) {
	        url = $.addTimestamp(url);
	      }
	
	      xhr.open('get', url);
	      xhr.responseType = 'arraybuffer';
	      xhr.send();
	    }
	  }, {
	    key: 'read',
	    value: function read(arrayBuffer) {
	      var self = this;
	      var options = self.options;
	      var orientation = $.getOrientation(arrayBuffer);
	      var imageData = self.imageData;
	      var rotate = 0;
	      var scaleX = 1;
	      var scaleY = 1;
	
	      if (orientation > 1) {
	        self.url = $.arrayBufferToDataURL(arrayBuffer);
	
	        switch (orientation) {
	
	          // flip horizontal
	          case 2:
	            scaleX = -1;
	            break;
	
	          // rotate left 180°
	          case 3:
	            rotate = -180;
	            break;
	
	          // flip vertical
	          case 4:
	            scaleY = -1;
	            break;
	
	          // flip vertical + rotate right 90°
	          case 5:
	            rotate = 90;
	            scaleY = -1;
	            break;
	
	          // rotate right 90°
	          case 6:
	            rotate = 90;
	            break;
	
	          // flip horizontal + rotate right 90°
	          case 7:
	            rotate = 90;
	            scaleX = -1;
	            break;
	
	          // rotate left 90°
	          case 8:
	            rotate = -90;
	            break;
	        }
	      }
	
	      if (options.rotatable) {
	        imageData.rotate = rotate;
	      }
	
	      if (options.scalable) {
	        imageData.scaleX = scaleX;
	        imageData.scaleY = scaleY;
	      }
	
	      self.clone();
	    }
	  }, {
	    key: 'clone',
	    value: function clone() {
	      var self = this;
	      var element = self.element;
	      var url = self.url;
	      var crossOrigin = void 0;
	      var crossOriginUrl = void 0;
	      var start = void 0;
	      var stop = void 0;
	
	      if (self.options.checkCrossOrigin && $.isCrossOriginURL(url)) {
	        crossOrigin = element.crossOrigin;
	
	        if (crossOrigin) {
	          crossOriginUrl = url;
	        } else {
	          crossOrigin = 'anonymous';
	
	          // Bust cache when there is not a "crossOrigin" property
	          crossOriginUrl = $.addTimestamp(url);
	        }
	      }
	
	      self.crossOrigin = crossOrigin;
	      self.crossOriginUrl = crossOriginUrl;
	
	      var image = $.createElement('img');
	
	      if (crossOrigin) {
	        image.crossOrigin = crossOrigin;
	      }
	
	      image.src = crossOriginUrl || url;
	      self.image = image;
	      self.onStart = start = $.proxy(self.start, self);
	      self.onStop = stop = $.proxy(self.stop, self);
	
	      if (self.isImg) {
	        if (element.complete) {
	          self.start();
	        } else {
	          $.addListener(element, EVENT_LOAD, start);
	        }
	      } else {
	        $.addListener(image, EVENT_LOAD, start);
	        $.addListener(image, EVENT_ERROR, stop);
	        $.addClass(image, 'cropper-hide');
	        element.parentNode.insertBefore(image, element.nextSibling);
	      }
	    }
	  }, {
	    key: 'start',
	    value: function start(event) {
	      var self = this;
	      var image = self.isImg ? self.element : self.image;
	
	      if (event) {
	        $.removeListener(image, EVENT_LOAD, self.onStart);
	        $.removeListener(image, EVENT_ERROR, self.onStop);
	      }
	
	      $.getImageSize(image, function (naturalWidth, naturalHeight) {
	        $.extend(self.imageData, {
	          naturalWidth: naturalWidth,
	          naturalHeight: naturalHeight,
	          aspectRatio: naturalWidth / naturalHeight
	        });
	
	        self.loaded = true;
	        self.build();
	      });
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      var self = this;
	      var image = self.image;
	
	      $.removeListener(image, EVENT_LOAD, self.onStart);
	      $.removeListener(image, EVENT_ERROR, self.onStop);
	
	      $.removeChild(image);
	      self.image = null;
	    }
	  }, {
	    key: 'build',
	    value: function build() {
	      var self = this;
	      var options = self.options;
	      var element = self.element;
	      var image = self.image;
	      var container = void 0;
	      var cropper = void 0;
	      var canvas = void 0;
	      var dragBox = void 0;
	      var cropBox = void 0;
	      var face = void 0;
	
	      if (!self.loaded) {
	        return;
	      }
	
	      // Unbuild first when replace
	      if (self.ready) {
	        self.unbuild();
	      }
	
	      var template = $.createElement('div');
	      template.innerHTML = _template2.default;
	
	      // Create cropper elements
	      self.container = container = element.parentNode;
	      self.cropper = cropper = $.getByClass(template, 'cropper-container')[0];
	      self.canvas = canvas = $.getByClass(cropper, 'cropper-canvas')[0];
	      self.dragBox = dragBox = $.getByClass(cropper, 'cropper-drag-box')[0];
	      self.cropBox = cropBox = $.getByClass(cropper, 'cropper-crop-box')[0];
	      self.viewBox = $.getByClass(cropper, 'cropper-view-box')[0];
	      self.face = face = $.getByClass(cropBox, 'cropper-face')[0];
	
	      $.appendChild(canvas, image);
	
	      // Hide the original image
	      $.addClass(element, CLASS_HIDDEN);
	
	      // Inserts the cropper after to the current image
	      container.insertBefore(cropper, element.nextSibling);
	
	      // Show the image if is hidden
	      if (!self.isImg) {
	        $.removeClass(image, 'cropper-hide');
	      }
	
	      self.initPreview();
	      self.bind();
	
	      options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
	      options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
	
	      if (options.autoCrop) {
	        self.cropped = true;
	
	        if (options.modal) {
	          $.addClass(dragBox, 'cropper-modal');
	        }
	      } else {
	        $.addClass(cropBox, CLASS_HIDDEN);
	      }
	
	      if (!options.guides) {
	        $.addClass($.getByClass(cropBox, 'cropper-dashed'), CLASS_HIDDEN);
	      }
	
	      if (!options.center) {
	        $.addClass($.getByClass(cropBox, 'cropper-center'), CLASS_HIDDEN);
	      }
	
	      if (options.background) {
	        $.addClass(cropper, 'cropper-bg');
	      }
	
	      if (!options.highlight) {
	        $.addClass(face, 'cropper-invisible');
	      }
	
	      if (options.cropBoxMovable) {
	        $.addClass(face, 'cropper-move');
	        $.setData(face, 'action', 'all');
	      }
	
	      if (!options.cropBoxResizable) {
	        $.addClass($.getByClass(cropBox, 'cropper-line'), CLASS_HIDDEN);
	        $.addClass($.getByClass(cropBox, 'cropper-point'), CLASS_HIDDEN);
	      }
	
	      self.setDragMode(options.dragMode);
	      self.render();
	      self.ready = true;
	      self.setData(options.data);
	
	      // Call the "ready" option asynchronously to keep "image.cropper" is defined
	      self.completing = setTimeout(function () {
	        if ($.isFunction(options.ready)) {
	          $.addListener(element, EVENT_READY, options.ready, true);
	        }
	
	        $.dispatchEvent(element, EVENT_READY);
	        $.dispatchEvent(element, EVENT_CROP, self.getData());
	
	        self.complete = true;
	      }, 0);
	    }
	  }, {
	    key: 'unbuild',
	    value: function unbuild() {
	      var self = this;
	
	      if (!self.ready) {
	        return;
	      }
	
	      if (!self.complete) {
	        clearTimeout(self.completing);
	      }
	
	      self.ready = false;
	      self.complete = false;
	      self.initialImageData = null;
	
	      // Clear `initialCanvasData` is necessary when replace
	      self.initialCanvasData = null;
	      self.initialCropBoxData = null;
	      self.containerData = null;
	      self.canvasData = null;
	
	      // Clear `cropBoxData` is necessary when replace
	      self.cropBoxData = null;
	      self.unbind();
	
	      self.resetPreview();
	      self.previews = null;
	
	      self.viewBox = null;
	      self.cropBox = null;
	      self.dragBox = null;
	      self.canvas = null;
	      self.container = null;
	
	      $.removeChild(self.cropper);
	      self.cropper = null;
	    }
	  }], [{
	    key: 'noConflict',
	    value: function noConflict() {
	      window.Cropper = AnotherCropper;
	      return Cropper;
	    }
	  }, {
	    key: 'setDefaults',
	    value: function setDefaults(options) {
	      $.extend(_defaults2.default, $.isPlainObject(options) && options);
	    }
	  }]);
	
	  return Cropper;
	}();
	
	$.extend(Cropper.prototype, _render2.default);
	$.extend(Cropper.prototype, _preview2.default);
	$.extend(Cropper.prototype, _events2.default);
	$.extend(Cropper.prototype, _handlers2.default);
	$.extend(Cropper.prototype, _change2.default);
	$.extend(Cropper.prototype, _methods2.default);
	
	if (typeof window !== 'undefined') {
	  AnotherCropper = window.Cropper;
	  window.Cropper = Cropper;
	}
	
	exports.default = Cropper;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  // Define the view mode of the cropper
	  viewMode: 0, // 0, 1, 2, 3
	
	  // Define the dragging mode of the cropper
	  dragMode: 'crop', // 'crop', 'move' or 'none'
	
	  // Define the aspect ratio of the crop box
	  aspectRatio: NaN,
	
	  // An object with the previous cropping result data
	  data: null,
	
	  // A selector for adding extra containers to preview
	  preview: '',
	
	  // Re-render the cropper when resize the window
	  responsive: true,
	
	  // Restore the cropped area after resize the window
	  restore: true,
	
	  // Check if the current image is a cross-origin image
	  checkCrossOrigin: true,
	
	  // Check the current image's Exif Orientation information
	  checkOrientation: true,
	
	  // Show the black modal
	  modal: true,
	
	  // Show the dashed lines for guiding
	  guides: true,
	
	  // Show the center indicator for guiding
	  center: true,
	
	  // Show the white modal to highlight the crop box
	  highlight: true,
	
	  // Show the grid background
	  background: true,
	
	  // Enable to crop the image automatically when initialize
	  autoCrop: true,
	
	  // Define the percentage of automatic cropping area when initializes
	  autoCropArea: 0.8,
	
	  // Enable to move the image
	  movable: true,
	
	  // Enable to rotate the image
	  rotatable: true,
	
	  // Enable to scale the image
	  scalable: true,
	
	  // Enable to zoom the image
	  zoomable: true,
	
	  // Enable to zoom the image by dragging touch
	  zoomOnTouch: true,
	
	  // Enable to zoom the image by wheeling mouse
	  zoomOnWheel: true,
	
	  // Define zoom ratio when zoom the image by wheeling mouse
	  wheelZoomRatio: 0.1,
	
	  // Enable to move the crop box
	  cropBoxMovable: true,
	
	  // Enable to resize the crop box
	  cropBoxResizable: true,
	
	  // Toggle drag mode between "crop" and "move" when click twice on the cropper
	  toggleDragModeOnDblclick: true,
	
	  // Size limitation
	  minCanvasWidth: 0,
	  minCanvasHeight: 0,
	  minCropBoxWidth: 0,
	  minCropBoxHeight: 0,
	  minContainerWidth: 200,
	  minContainerHeight: 100,
	
	  // Shortcuts of events
	  ready: null,
	  cropstart: null,
	  cropmove: null,
	  cropend: null,
	  crop: null,
	  zoom: null
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = '<div class="cropper-container">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-action="e"></span>' + '<span class="cropper-line line-n" data-action="n"></span>' + '<span class="cropper-line line-w" data-action="w"></span>' + '<span class="cropper-line line-s" data-action="s"></span>' + '<span class="cropper-point point-e" data-action="e"></span>' + '<span class="cropper-point point-n" data-action="n"></span>' + '<span class="cropper-point point-w" data-action="w"></span>' + '<span class="cropper-point point-s" data-action="s"></span>' + '<span class="cropper-point point-ne" data-action="ne"></span>' + '<span class="cropper-point point-nw" data-action="nw"></span>' + '<span class="cropper-point point-sw" data-action="sw"></span>' + '<span class="cropper-point point-se" data-action="se"></span>' + '</div>' + '</div>';

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.default = {
	  render: function render() {
	    var self = this;
	
	    self.initContainer();
	    self.initCanvas();
	    self.initCropBox();
	
	    self.renderCanvas();
	
	    if (self.cropped) {
	      self.renderCropBox();
	    }
	  },
	  initContainer: function initContainer() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var container = self.container;
	    var cropper = self.cropper;
	    var containerData = void 0;
	
	    $.addClass(cropper, 'cropper-hidden');
	    $.removeClass(element, 'cropper-hidden');
	
	    self.containerData = containerData = {
	      width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
	      height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
	    };
	
	    $.setStyle(cropper, {
	      width: containerData.width,
	      height: containerData.height
	    });
	
	    $.addClass(element, 'cropper-hidden');
	    $.removeClass(cropper, 'cropper-hidden');
	  },
	
	
	  // Canvas (image wrapper)
	  initCanvas: function initCanvas() {
	    var self = this;
	    var viewMode = self.options.viewMode;
	    var containerData = self.containerData;
	    var imageData = self.imageData;
	    var rotated = Math.abs(imageData.rotate) === 90;
	    var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
	    var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
	    var aspectRatio = naturalWidth / naturalHeight;
	    var canvasWidth = containerData.width;
	    var canvasHeight = containerData.height;
	
	    if (containerData.height * aspectRatio > containerData.width) {
	      if (viewMode === 3) {
	        canvasWidth = containerData.height * aspectRatio;
	      } else {
	        canvasHeight = containerData.width / aspectRatio;
	      }
	    } else if (viewMode === 3) {
	      canvasHeight = containerData.width / aspectRatio;
	    } else {
	      canvasWidth = containerData.height * aspectRatio;
	    }
	
	    var canvasData = {
	      naturalWidth: naturalWidth,
	      naturalHeight: naturalHeight,
	      aspectRatio: aspectRatio,
	      width: canvasWidth,
	      height: canvasHeight
	    };
	
	    canvasData.oldLeft = canvasData.left = (containerData.width - canvasWidth) / 2;
	    canvasData.oldTop = canvasData.top = (containerData.height - canvasHeight) / 2;
	
	    self.canvasData = canvasData;
	    self.limited = viewMode === 1 || viewMode === 2;
	    self.limitCanvas(true, true);
	    self.initialImageData = $.extend({}, imageData);
	    self.initialCanvasData = $.extend({}, canvasData);
	  },
	  limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
	    var self = this;
	    var options = self.options;
	    var viewMode = options.viewMode;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var aspectRatio = canvasData.aspectRatio;
	    var cropBoxData = self.cropBoxData;
	    var cropped = self.cropped && cropBoxData;
	    var minCanvasWidth = void 0;
	    var minCanvasHeight = void 0;
	    var newCanvasLeft = void 0;
	    var newCanvasTop = void 0;
	
	    if (sizeLimited) {
	      minCanvasWidth = Number(options.minCanvasWidth) || 0;
	      minCanvasHeight = Number(options.minCanvasHeight) || 0;
	
	      if (viewMode > 1) {
	        minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
	        minCanvasHeight = Math.max(minCanvasHeight, containerData.height);
	
	        if (viewMode === 3) {
	          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	            minCanvasWidth = minCanvasHeight * aspectRatio;
	          } else {
	            minCanvasHeight = minCanvasWidth / aspectRatio;
	          }
	        }
	      } else if (viewMode > 0) {
	        if (minCanvasWidth) {
	          minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
	        } else if (minCanvasHeight) {
	          minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
	        } else if (cropped) {
	          minCanvasWidth = cropBoxData.width;
	          minCanvasHeight = cropBoxData.height;
	
	          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	            minCanvasWidth = minCanvasHeight * aspectRatio;
	          } else {
	            minCanvasHeight = minCanvasWidth / aspectRatio;
	          }
	        }
	      }
	
	      if (minCanvasWidth && minCanvasHeight) {
	        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	          minCanvasHeight = minCanvasWidth / aspectRatio;
	        } else {
	          minCanvasWidth = minCanvasHeight * aspectRatio;
	        }
	      } else if (minCanvasWidth) {
	        minCanvasHeight = minCanvasWidth / aspectRatio;
	      } else if (minCanvasHeight) {
	        minCanvasWidth = minCanvasHeight * aspectRatio;
	      }
	
	      canvasData.minWidth = minCanvasWidth;
	      canvasData.minHeight = minCanvasHeight;
	      canvasData.maxWidth = Infinity;
	      canvasData.maxHeight = Infinity;
	    }
	
	    if (positionLimited) {
	      if (viewMode) {
	        newCanvasLeft = containerData.width - canvasData.width;
	        newCanvasTop = containerData.height - canvasData.height;
	
	        canvasData.minLeft = Math.min(0, newCanvasLeft);
	        canvasData.minTop = Math.min(0, newCanvasTop);
	        canvasData.maxLeft = Math.max(0, newCanvasLeft);
	        canvasData.maxTop = Math.max(0, newCanvasTop);
	
	        if (cropped && self.limited) {
	          canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
	          canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
	          canvasData.maxLeft = cropBoxData.left;
	          canvasData.maxTop = cropBoxData.top;
	
	          if (viewMode === 2) {
	            if (canvasData.width >= containerData.width) {
	              canvasData.minLeft = Math.min(0, newCanvasLeft);
	              canvasData.maxLeft = Math.max(0, newCanvasLeft);
	            }
	
	            if (canvasData.height >= containerData.height) {
	              canvasData.minTop = Math.min(0, newCanvasTop);
	              canvasData.maxTop = Math.max(0, newCanvasTop);
	            }
	          }
	        }
	      } else {
	        canvasData.minLeft = -canvasData.width;
	        canvasData.minTop = -canvasData.height;
	        canvasData.maxLeft = containerData.width;
	        canvasData.maxTop = containerData.height;
	      }
	    }
	  },
	  renderCanvas: function renderCanvas(changed) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var imageData = self.imageData;
	    var rotate = imageData.rotate;
	    var aspectRatio = void 0;
	    var rotatedData = void 0;
	
	    if (self.rotated) {
	      self.rotated = false;
	
	      // Computes rotated sizes with image sizes
	      rotatedData = $.getRotatedSizes({
	        width: imageData.width,
	        height: imageData.height,
	        degree: rotate
	      });
	
	      aspectRatio = rotatedData.width / rotatedData.height;
	
	      if (aspectRatio !== canvasData.aspectRatio) {
	        canvasData.left -= (rotatedData.width - canvasData.width) / 2;
	        canvasData.top -= (rotatedData.height - canvasData.height) / 2;
	        canvasData.width = rotatedData.width;
	        canvasData.height = rotatedData.height;
	        canvasData.aspectRatio = aspectRatio;
	        canvasData.naturalWidth = imageData.naturalWidth;
	        canvasData.naturalHeight = imageData.naturalHeight;
	
	        // Computes rotated sizes with natural image sizes
	        if (rotate % 180) {
	          rotatedData = $.getRotatedSizes({
	            width: imageData.naturalWidth,
	            height: imageData.naturalHeight,
	            degree: rotate
	          });
	
	          canvasData.naturalWidth = rotatedData.width;
	          canvasData.naturalHeight = rotatedData.height;
	        }
	
	        self.limitCanvas(true, false);
	      }
	    }
	
	    if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
	      canvasData.left = canvasData.oldLeft;
	    }
	
	    if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
	      canvasData.top = canvasData.oldTop;
	    }
	
	    canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
	    canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
	
	    self.limitCanvas(false, true);
	
	    canvasData.oldLeft = canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
	    canvasData.oldTop = canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
	
	    $.setStyle(self.canvas, {
	      width: canvasData.width,
	      height: canvasData.height,
	      left: canvasData.left,
	      top: canvasData.top
	    });
	
	    self.renderImage();
	
	    if (self.cropped && self.limited) {
	      self.limitCropBox(true, true);
	    }
	
	    if (changed) {
	      self.output();
	    }
	  },
	  renderImage: function renderImage(changed) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var imageData = self.imageData;
	    var newImageData = void 0;
	    var reversedData = void 0;
	    var reversedWidth = void 0;
	    var reversedHeight = void 0;
	
	    if (imageData.rotate) {
	      reversedData = $.getRotatedSizes({
	        width: canvasData.width,
	        height: canvasData.height,
	        degree: imageData.rotate,
	        aspectRatio: imageData.aspectRatio
	      }, true);
	
	      reversedWidth = reversedData.width;
	      reversedHeight = reversedData.height;
	
	      newImageData = {
	        width: reversedWidth,
	        height: reversedHeight,
	        left: (canvasData.width - reversedWidth) / 2,
	        top: (canvasData.height - reversedHeight) / 2
	      };
	    }
	
	    $.extend(imageData, newImageData || {
	      width: canvasData.width,
	      height: canvasData.height,
	      left: 0,
	      top: 0
	    });
	
	    var transform = $.getTransform(imageData);
	
	    $.setStyle(self.image, {
	      width: imageData.width,
	      height: imageData.height,
	      marginLeft: imageData.left,
	      marginTop: imageData.top,
	      WebkitTransform: transform,
	      msTransform: transform,
	      transform: transform
	    });
	
	    if (changed) {
	      self.output();
	    }
	  },
	  initCropBox: function initCropBox() {
	    var self = this;
	    var options = self.options;
	    var aspectRatio = options.aspectRatio;
	    var autoCropArea = Number(options.autoCropArea) || 0.8;
	    var canvasData = self.canvasData;
	    var cropBoxData = {
	      width: canvasData.width,
	      height: canvasData.height
	    };
	
	    if (aspectRatio) {
	      if (canvasData.height * aspectRatio > canvasData.width) {
	        cropBoxData.height = cropBoxData.width / aspectRatio;
	      } else {
	        cropBoxData.width = cropBoxData.height * aspectRatio;
	      }
	    }
	
	    self.cropBoxData = cropBoxData;
	    self.limitCropBox(true, true);
	
	    // Initialize auto crop area
	    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
	
	    // The width/height of auto crop area must large than "minWidth/Height"
	    cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
	    cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
	    cropBoxData.oldLeft = cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
	    cropBoxData.oldTop = cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
	
	    self.initialCropBoxData = $.extend({}, cropBoxData);
	  },
	  limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
	    var self = this;
	    var options = self.options;
	    var aspectRatio = options.aspectRatio;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var limited = self.limited;
	    var minCropBoxWidth = void 0;
	    var minCropBoxHeight = void 0;
	    var maxCropBoxWidth = void 0;
	    var maxCropBoxHeight = void 0;
	
	    if (sizeLimited) {
	      minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
	      minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
	
	      // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
	      minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
	      minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);
	      maxCropBoxWidth = Math.min(containerData.width, limited ? canvasData.width : containerData.width);
	      maxCropBoxHeight = Math.min(containerData.height, limited ? canvasData.height : containerData.height);
	
	      if (aspectRatio) {
	        if (minCropBoxWidth && minCropBoxHeight) {
	          if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
	            minCropBoxHeight = minCropBoxWidth / aspectRatio;
	          } else {
	            minCropBoxWidth = minCropBoxHeight * aspectRatio;
	          }
	        } else if (minCropBoxWidth) {
	          minCropBoxHeight = minCropBoxWidth / aspectRatio;
	        } else if (minCropBoxHeight) {
	          minCropBoxWidth = minCropBoxHeight * aspectRatio;
	        }
	
	        if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
	          maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
	        } else {
	          maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
	        }
	      }
	
	      // The minWidth/Height must be less than maxWidth/Height
	      cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
	      cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
	      cropBoxData.maxWidth = maxCropBoxWidth;
	      cropBoxData.maxHeight = maxCropBoxHeight;
	    }
	
	    if (positionLimited) {
	      if (limited) {
	        cropBoxData.minLeft = Math.max(0, canvasData.left);
	        cropBoxData.minTop = Math.max(0, canvasData.top);
	        cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
	        cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
	      } else {
	        cropBoxData.minLeft = 0;
	        cropBoxData.minTop = 0;
	        cropBoxData.maxLeft = containerData.width - cropBoxData.width;
	        cropBoxData.maxTop = containerData.height - cropBoxData.height;
	      }
	    }
	  },
	  renderCropBox: function renderCropBox() {
	    var self = this;
	    var options = self.options;
	    var containerData = self.containerData;
	    var cropBoxData = self.cropBoxData;
	
	    if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
	      cropBoxData.left = cropBoxData.oldLeft;
	    }
	
	    if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
	      cropBoxData.top = cropBoxData.oldTop;
	    }
	
	    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	    cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
	
	    self.limitCropBox(false, true);
	
	    cropBoxData.oldLeft = cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
	    cropBoxData.oldTop = cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
	
	    if (options.movable && options.cropBoxMovable) {
	      // Turn to move the canvas when the crop box is equal to the container
	      $.setData(self.face, 'action', cropBoxData.width === containerData.width && cropBoxData.height === containerData.height ? 'move' : 'all');
	    }
	
	    $.setStyle(self.cropBox, {
	      width: cropBoxData.width,
	      height: cropBoxData.height,
	      left: cropBoxData.left,
	      top: cropBoxData.top
	    });
	
	    if (self.cropped && self.limited) {
	      self.limitCanvas(true, true);
	    }
	
	    if (!self.disabled) {
	      self.output();
	    }
	  },
	  output: function output() {
	    var self = this;
	
	    self.preview();
	
	    if (self.complete) {
	      $.dispatchEvent(self.element, 'crop', self.getData());
	    }
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.typeOf = typeOf;
	exports.isNumber = isNumber;
	exports.isUndefined = isUndefined;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.isFunction = isFunction;
	exports.isArray = isArray;
	exports.toArray = toArray;
	exports.trim = trim;
	exports.each = each;
	exports.extend = extend;
	exports.proxy = proxy;
	exports.setStyle = setStyle;
	exports.hasClass = hasClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.toggleClass = toggleClass;
	exports.hyphenate = hyphenate;
	exports.getData = getData;
	exports.setData = setData;
	exports.removeData = removeData;
	exports.removeListener = removeListener;
	exports.dispatchEvent = dispatchEvent;
	exports.getEvent = getEvent;
	exports.getOffset = getOffset;
	exports.getTouchesCenter = getTouchesCenter;
	exports.getByTag = getByTag;
	exports.getByClass = getByClass;
	exports.createElement = createElement;
	exports.appendChild = appendChild;
	exports.removeChild = removeChild;
	exports.empty = empty;
	exports.isCrossOriginURL = isCrossOriginURL;
	exports.addTimestamp = addTimestamp;
	exports.getImageSize = getImageSize;
	exports.getTransform = getTransform;
	exports.getRotatedSizes = getRotatedSizes;
	exports.getSourceCanvas = getSourceCanvas;
	exports.getStringFromCharCode = getStringFromCharCode;
	exports.getOrientation = getOrientation;
	exports.dataURLToArrayBuffer = dataURLToArrayBuffer;
	exports.arrayBufferToDataURL = arrayBufferToDataURL;
	// RegExps
	var REGEXP_DATA_URL_HEAD = /^data:([^;]+);base64,/;
	var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
	var REGEXP_ORIGINS = /^(https?:)\/\/([^:\/\?#]+):?(\d*)/i;
	var REGEXP_SPACES = /\s+/;
	var REGEXP_SUFFIX = /^(width|height|left|top|marginLeft|marginTop)$/;
	var REGEXP_TRIM = /^\s+(.*)\s+$/;
	var REGEXP_USERAGENT = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i;
	var navigator = window.navigator;
	var IS_SAFARI_OR_UIWEBVIEW = navigator && REGEXP_USERAGENT.test(navigator.userAgent);
	
	// Utilities
	var objectProto = Object.prototype;
	var toString = objectProto.toString;
	var hasOwnProperty = objectProto.hasOwnProperty;
	var slice = Array.prototype.slice;
	var fromCharCode = String.fromCharCode;
	
	function typeOf(obj) {
	  return toString.call(obj).slice(8, -1).toLowerCase();
	}
	
	function isNumber(num) {
	  return typeof num === 'number' && !isNaN(num);
	}
	
	function isUndefined(obj) {
	  return typeof obj === 'undefined';
	}
	
	function isObject(obj) {
	  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
	}
	
	function isPlainObject(obj) {
	  if (!isObject(obj)) {
	    return false;
	  }
	
	  try {
	    var _constructor = obj.constructor;
	    var prototype = _constructor.prototype;
	
	    return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	  } catch (e) {
	    return false;
	  }
	}
	
	function isFunction(fn) {
	  return typeOf(fn) === 'function';
	}
	
	function isArray(arr) {
	  return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
	}
	
	function toArray(obj, offset) {
	  offset = offset >= 0 ? offset : 0;
	
	  if (Array.from) {
	    return Array.from(obj).slice(offset);
	  }
	
	  return slice.call(obj, offset);
	}
	
	function trim(str) {
	  if (typeof str === 'string') {
	    str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '$1');
	  }
	
	  return str;
	}
	
	function each(obj, callback) {
	  if (obj && isFunction(callback)) {
	    var i = void 0;
	
	    if (isArray(obj) || isNumber(obj.length) /* array-like */) {
	        var length = obj.length;
	
	        for (i = 0; i < length; i++) {
	          if (callback.call(obj, obj[i], i, obj) === false) {
	            break;
	          }
	        }
	      } else if (isObject(obj)) {
	      Object.keys(obj).forEach(function (key) {
	        callback.call(obj, obj[key], key, obj);
	      });
	    }
	  }
	
	  return obj;
	}
	
	function extend() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var deep = args[0] === true;
	  var data = deep ? args[1] : args[0];
	
	  if (args.length > 1) {
	    // if (Object.assign) {
	    //   return Object.assign.apply(Object, args);
	    // }
	
	    args.shift();
	
	    args.forEach(function (arg) {
	      if (isObject(arg)) {
	        Object.keys(arg).forEach(function (key) {
	          if (deep && isObject(data[key])) {
	            extend(true, data[key], arg[key]);
	          } else {
	            data[key] = arg[key];
	          }
	        });
	      }
	    });
	  }
	
	  return data;
	}
	
	function proxy(fn, context) {
	  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	    args[_key2 - 2] = arguments[_key2];
	  }
	
	  return function () {
	    for (var _len3 = arguments.length, args2 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args2[_key3] = arguments[_key3];
	    }
	
	    return fn.apply(context, args.concat(args2));
	  };
	}
	
	function setStyle(element, styles) {
	  var style = element.style;
	
	  each(styles, function (value, property) {
	    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
	      value += 'px';
	    }
	
	    style[property] = value;
	  });
	}
	
	function hasClass(element, value) {
	  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
	}
	
	function addClass(element, value) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      addClass(elem, value);
	    });
	    return;
	  }
	
	  if (element.classList) {
	    element.classList.add(value);
	    return;
	  }
	
	  var className = trim(element.className);
	
	  if (!className) {
	    element.className = value;
	  } else if (className.indexOf(value) < 0) {
	    element.className = className + ' ' + value;
	  }
	}
	
	function removeClass(element, value) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      removeClass(elem, value);
	    });
	    return;
	  }
	
	  if (element.classList) {
	    element.classList.remove(value);
	    return;
	  }
	
	  if (element.className.indexOf(value) >= 0) {
	    element.className = element.className.replace(value, '');
	  }
	}
	
	function toggleClass(element, value, added) {
	  if (isNumber(element.length)) {
	    each(element, function (elem) {
	      toggleClass(elem, value, added);
	    });
	    return;
	  }
	
	  // IE10-11 doesn't support the second parameter of `classList.toggle`
	  if (added) {
	    addClass(element, value);
	  } else {
	    removeClass(element, value);
	  }
	}
	
	function hyphenate(str) {
	  return str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
	}
	
	function getData(element, name) {
	  if (isObject(element[name])) {
	    return element[name];
	  } else if (element.dataset) {
	    return element.dataset[name];
	  }
	
	  return element.getAttribute('data-' + hyphenate(name));
	}
	
	function setData(element, name, data) {
	  if (isObject(data)) {
	    element[name] = data;
	  } else if (element.dataset) {
	    element.dataset[name] = data;
	  } else {
	    element.setAttribute('data-' + hyphenate(name), data);
	  }
	}
	
	function removeData(element, name) {
	  if (isObject(element[name])) {
	    delete element[name];
	  } else if (element.dataset) {
	    delete element.dataset[name];
	  } else {
	    element.removeAttribute('data-' + hyphenate(name));
	  }
	}
	
	function removeListener(element, type, handler) {
	  var types = trim(type).split(REGEXP_SPACES);
	
	  if (types.length > 1) {
	    each(types, function (t) {
	      removeListener(element, t, handler);
	    });
	    return;
	  }
	
	  if (element.removeEventListener) {
	    element.removeEventListener(type, handler, false);
	  } else if (element.detachEvent) {
	    element.detachEvent('on' + type, handler);
	  }
	}
	
	function addListener(element, type, _handler, once) {
	  var types = trim(type).split(REGEXP_SPACES);
	  var originalHandler = _handler;
	
	  if (types.length > 1) {
	    each(types, function (t) {
	      addListener(element, t, _handler);
	    });
	    return;
	  }
	
	  if (once) {
	    _handler = function handler() {
	      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }
	
	      removeListener(element, type, _handler);
	
	      return originalHandler.apply(element, args);
	    };
	  }
	
	  if (element.addEventListener) {
	    element.addEventListener(type, _handler, false);
	  } else if (element.attachEvent) {
	    element.attachEvent('on${type}', _handler);
	  }
	}
	
	exports.addListener = addListener;
	function dispatchEvent(element, type, data) {
	  if (element.dispatchEvent) {
	    var event = void 0;
	
	    // Event and CustomEvent on IE9-11 are global objects, not constructors
	    if (isFunction(Event) && isFunction(CustomEvent)) {
	      if (isUndefined(data)) {
	        event = new Event(type, {
	          bubbles: true,
	          cancelable: true
	        });
	      } else {
	        event = new CustomEvent(type, {
	          detail: data,
	          bubbles: true,
	          cancelable: true
	        });
	      }
	    } else if (isUndefined(data)) {
	      event = document.createEvent('Event');
	      event.initEvent(type, true, true);
	    } else {
	      event = document.createEvent('CustomEvent');
	      event.initCustomEvent(type, true, true, data);
	    }
	
	    // IE9+
	    return element.dispatchEvent(event);
	  } else if (element.fireEvent) {
	    // IE6-10 (native events only)
	    return element.fireEvent('on' + type);
	  }
	
	  return true;
	}
	
	function getEvent(event) {
	  var e = event || window.event;
	
	  // Fix target property (IE8)
	  if (!e.target) {
	    e.target = e.srcElement || document;
	  }
	
	  if (!isNumber(e.pageX) && isNumber(e.clientX)) {
	    var eventDoc = event.target.ownerDocument || document;
	    var doc = eventDoc.documentElement;
	    var body = eventDoc.body;
	
	    e.pageX = e.clientX + ((doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
	    e.pageY = e.clientY + ((doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0));
	  }
	
	  return e;
	}
	
	function getOffset(element) {
	  var doc = document.documentElement;
	  var box = element.getBoundingClientRect();
	
	  return {
	    left: box.left + ((window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0)),
	    top: box.top + ((window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0))
	  };
	}
	
	function getTouchesCenter(touches) {
	  var length = touches.length;
	  var pageX = 0;
	  var pageY = 0;
	
	  if (length) {
	    each(touches, function (touch) {
	      pageX += touch.pageX;
	      pageY += touch.pageY;
	    });
	
	    pageX /= length;
	    pageY /= length;
	  }
	
	  return {
	    pageX: pageX,
	    pageY: pageY
	  };
	}
	
	function getByTag(element, tagName) {
	  return element.getElementsByTagName(tagName);
	}
	
	function getByClass(element, className) {
	  return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
	}
	
	function createElement(tagName) {
	  return document.createElement(tagName);
	}
	
	function appendChild(element, elem) {
	  element.appendChild(elem);
	}
	
	function removeChild(element) {
	  if (element.parentNode) {
	    element.parentNode.removeChild(element);
	  }
	}
	
	function empty(element) {
	  while (element.firstChild) {
	    element.removeChild(element.firstChild);
	  }
	}
	
	function isCrossOriginURL(url) {
	  var parts = url.match(REGEXP_ORIGINS);
	
	  return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
	}
	
	function addTimestamp(url) {
	  var timestamp = 'timestamp=' + new Date().getTime();
	
	  return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
	}
	
	function getImageSize(image, callback) {
	  // Modern browsers (ignore Safari)
	  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
	    callback(image.naturalWidth, image.naturalHeight);
	    return;
	  }
	
	  // IE8: Don't use `new Image()` here
	  var newImage = createElement('img');
	
	  newImage.onload = function load() {
	    callback(this.width, this.height);
	  };
	
	  newImage.src = image.src;
	}
	
	function getTransform(data) {
	  var transforms = [];
	  var rotate = data.rotate;
	  var scaleX = data.scaleX;
	  var scaleY = data.scaleY;
	
	  // Rotate should come first before scale to match orientation transform
	  if (isNumber(rotate) && rotate !== 0) {
	    transforms.push('rotate(' + rotate + 'deg)');
	  }
	
	  if (isNumber(scaleX) && scaleX !== 1) {
	    transforms.push('scaleX(' + scaleX + ')');
	  }
	
	  if (isNumber(scaleY) && scaleY !== 1) {
	    transforms.push('scaleY(' + scaleY + ')');
	  }
	
	  return transforms.length ? transforms.join(' ') : 'none';
	}
	
	function getRotatedSizes(data, reversed) {
	  var deg = Math.abs(data.degree) % 180;
	  var arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180;
	  var sinArc = Math.sin(arc);
	  var cosArc = Math.cos(arc);
	  var width = data.width;
	  var height = data.height;
	  var aspectRatio = data.aspectRatio;
	  var newWidth = void 0;
	  var newHeight = void 0;
	
	  if (!reversed) {
	    newWidth = width * cosArc + height * sinArc;
	    newHeight = width * sinArc + height * cosArc;
	  } else {
	    newWidth = width / (cosArc + sinArc / aspectRatio);
	    newHeight = newWidth / aspectRatio;
	  }
	
	  return {
	    width: newWidth,
	    height: newHeight
	  };
	}
	
	function getSourceCanvas(image, data) {
	  var canvas = createElement('canvas');
	  var context = canvas.getContext('2d');
	  var dstX = 0;
	  var dstY = 0;
	  var dstWidth = data.naturalWidth;
	  var dstHeight = data.naturalHeight;
	  var rotate = data.rotate;
	  var scaleX = data.scaleX;
	  var scaleY = data.scaleY;
	  var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
	  var rotatable = isNumber(rotate) && rotate !== 0;
	  var advanced = rotatable || scalable;
	  var canvasWidth = dstWidth * Math.abs(scaleX || 1);
	  var canvasHeight = dstHeight * Math.abs(scaleY || 1);
	  var translateX = void 0;
	  var translateY = void 0;
	  var rotated = void 0;
	
	  if (scalable) {
	    translateX = canvasWidth / 2;
	    translateY = canvasHeight / 2;
	  }
	
	  if (rotatable) {
	    rotated = getRotatedSizes({
	      width: canvasWidth,
	      height: canvasHeight,
	      degree: rotate
	    });
	
	    canvasWidth = rotated.width;
	    canvasHeight = rotated.height;
	    translateX = canvasWidth / 2;
	    translateY = canvasHeight / 2;
	  }
	
	  canvas.width = canvasWidth;
	  canvas.height = canvasHeight;
	
	  if (advanced) {
	    dstX = -dstWidth / 2;
	    dstY = -dstHeight / 2;
	
	    context.save();
	    context.translate(translateX, translateY);
	  }
	
	  // Rotate should come first before scale as in the "getTransform" function
	  if (rotatable) {
	    context.rotate(rotate * Math.PI / 180);
	  }
	
	  if (scalable) {
	    context.scale(scaleX, scaleY);
	  }
	
	  context.drawImage(image, Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
	
	  if (advanced) {
	    context.restore();
	  }
	
	  return canvas;
	}
	
	function getStringFromCharCode(dataView, start, length) {
	  var str = '';
	  var i = start;
	
	  for (length += start; i < length; i++) {
	    str += fromCharCode(dataView.getUint8(i));
	  }
	
	  return str;
	}
	
	function getOrientation(arrayBuffer) {
	  var dataView = new DataView(arrayBuffer);
	  var length = dataView.byteLength;
	  var orientation = void 0;
	  var exifIDCode = void 0;
	  var tiffOffset = void 0;
	  var firstIFDOffset = void 0;
	  var littleEndian = void 0;
	  var endianness = void 0;
	  var app1Start = void 0;
	  var ifdStart = void 0;
	  var offset = void 0;
	  var i = void 0;
	
	  // Only handle JPEG image (start by 0xFFD8)
	  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
	    offset = 2;
	
	    while (offset < length) {
	      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
	        app1Start = offset;
	        break;
	      }
	
	      offset++;
	    }
	  }
	
	  if (app1Start) {
	    exifIDCode = app1Start + 4;
	    tiffOffset = app1Start + 10;
	
	    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
	      endianness = dataView.getUint16(tiffOffset);
	      littleEndian = endianness === 0x4949;
	
	      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
	          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
	            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
	
	            if (firstIFDOffset >= 0x00000008) {
	              ifdStart = tiffOffset + firstIFDOffset;
	            }
	          }
	        }
	    }
	  }
	
	  if (ifdStart) {
	    length = dataView.getUint16(ifdStart, littleEndian);
	
	    for (i = 0; i < length; i++) {
	      offset = ifdStart + i * 12 + 2;
	
	      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
	          // 8 is the offset of the current tag's value
	          offset += 8;
	
	          // Get the original orientation value
	          orientation = dataView.getUint16(offset, littleEndian);
	
	          // Override the orientation with its default value for Safari
	          if (IS_SAFARI_OR_UIWEBVIEW) {
	            dataView.setUint16(offset, 1, littleEndian);
	          }
	
	          break;
	        }
	    }
	  }
	
	  return orientation;
	}
	
	function dataURLToArrayBuffer(dataURL) {
	  var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
	  var binary = atob(base64);
	  var length = binary.length;
	  var arrayBuffer = new ArrayBuffer(length);
	  var dataView = new Uint8Array(arrayBuffer);
	  var i = void 0;
	
	  for (i = 0; i < length; i++) {
	    dataView[i] = binary.charCodeAt(i);
	  }
	
	  return arrayBuffer;
	}
	
	// Only available for JPEG image
	function arrayBufferToDataURL(arrayBuffer) {
	  var dataView = new Uint8Array(arrayBuffer);
	  var length = dataView.length;
	  var base64 = '';
	  var i = void 0;
	
	  for (i = 0; i < length; i++) {
	    base64 += fromCharCode(dataView[i]);
	  }
	
	  return 'data:image/jpeg;base64,' + btoa(base64);
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var DATA_PREVIEW = 'preview';
	
	exports.default = {
	  initPreview: function initPreview() {
	    var self = this;
	    var preview = self.options.preview;
	    var image = $.createElement('img');
	    var crossOrigin = self.crossOrigin;
	    var url = crossOrigin ? self.crossOriginUrl : self.url;
	
	    if (crossOrigin) {
	      image.crossOrigin = crossOrigin;
	    }
	
	    image.src = url;
	    $.appendChild(self.viewBox, image);
	    self.image2 = image;
	
	    if (!preview) {
	      return;
	    }
	
	    var previews = document.querySelectorAll(preview);
	
	    self.previews = previews;
	
	    $.each(previews, function (element) {
	      var img = $.createElement('img');
	
	      // Save the original size for recover
	      $.setData(element, DATA_PREVIEW, {
	        width: element.offsetWidth,
	        height: element.offsetHeight,
	        html: element.innerHTML
	      });
	
	      if (crossOrigin) {
	        img.crossOrigin = crossOrigin;
	      }
	
	      img.src = url;
	
	      /**
	       * Override img element styles
	       * Add `display:block` to avoid margin top issue
	       * Add `height:auto` to override `height` attribute on IE8
	       * (Occur only when margin-top <= -height)
	       */
	
	      img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
	
	      $.empty(element);
	      $.appendChild(element, img);
	    });
	  },
	  resetPreview: function resetPreview() {
	    $.each(this.previews, function (element) {
	      var data = $.getData(element, DATA_PREVIEW);
	
	      $.setStyle(element, {
	        width: data.width,
	        height: data.height
	      });
	
	      element.innerHTML = data.html;
	      $.removeData(element, DATA_PREVIEW);
	    });
	  },
	  preview: function preview() {
	    var self = this;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var cropBoxWidth = cropBoxData.width;
	    var cropBoxHeight = cropBoxData.height;
	    var width = imageData.width;
	    var height = imageData.height;
	    var left = cropBoxData.left - canvasData.left - imageData.left;
	    var top = cropBoxData.top - canvasData.top - imageData.top;
	    var transform = $.getTransform(imageData);
	    var transforms = {
	      WebkitTransform: transform,
	      msTransform: transform,
	      transform: transform
	    };
	
	    if (!self.cropped || self.disabled) {
	      return;
	    }
	
	    $.setStyle(self.image2, $.extend({
	      width: width,
	      height: height,
	      marginLeft: -left,
	      marginTop: -top
	    }, transforms));
	
	    $.each(self.previews, function (element) {
	      var data = $.getData(element, DATA_PREVIEW);
	      var originalWidth = data.width;
	      var originalHeight = data.height;
	      var newWidth = originalWidth;
	      var newHeight = originalHeight;
	      var ratio = 1;
	
	      if (cropBoxWidth) {
	        ratio = originalWidth / cropBoxWidth;
	        newHeight = cropBoxHeight * ratio;
	      }
	
	      if (cropBoxHeight && newHeight > originalHeight) {
	        ratio = originalHeight / cropBoxHeight;
	        newWidth = cropBoxWidth * ratio;
	        newHeight = originalHeight;
	      }
	
	      $.setStyle(element, {
	        width: newWidth,
	        height: newHeight
	      });
	
	      $.setStyle($.getByTag(element, 'img')[0], $.extend({
	        width: width * ratio,
	        height: height * ratio,
	        marginLeft: -left * ratio,
	        marginTop: -top * ratio
	      }, transforms));
	    });
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// Events
	var EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
	var EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
	var EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel' + ' MSPointerUp MSPointerCancel';
	var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
	var EVENT_DBLCLICK = 'dblclick';
	var EVENT_RESIZE = 'resize';
	var EVENT_CROP_START = 'cropstart';
	var EVENT_CROP_MOVE = 'cropmove';
	var EVENT_CROP_END = 'cropend';
	var EVENT_CROP = 'crop';
	var EVENT_ZOOM = 'zoom';
	
	exports.default = {
	  bind: function bind() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var cropper = self.cropper;
	
	    if ($.isFunction(options.cropstart)) {
	      $.addListener(element, EVENT_CROP_START, options.cropstart);
	    }
	
	    if ($.isFunction(options.cropmove)) {
	      $.addListener(element, EVENT_CROP_MOVE, options.cropmove);
	    }
	
	    if ($.isFunction(options.cropend)) {
	      $.addListener(element, EVENT_CROP_END, options.cropend);
	    }
	
	    if ($.isFunction(options.crop)) {
	      $.addListener(element, EVENT_CROP, options.crop);
	    }
	
	    if ($.isFunction(options.zoom)) {
	      $.addListener(element, EVENT_ZOOM, options.zoom);
	    }
	
	    $.addListener(cropper, EVENT_MOUSE_DOWN, self.onCropStart = $.proxy(self.cropStart, self));
	
	    if (options.zoomable && options.zoomOnWheel) {
	      $.addListener(cropper, EVENT_WHEEL, self.onWheel = $.proxy(self.wheel, self));
	    }
	
	    if (options.toggleDragModeOnDblclick) {
	      $.addListener(cropper, EVENT_DBLCLICK, self.onDblclick = $.proxy(self.dblclick, self));
	    }
	
	    $.addListener(document, EVENT_MOUSE_MOVE, self.onCropMove = $.proxy(self.cropMove, self));
	    $.addListener(document, EVENT_MOUSE_UP, self.onCropEnd = $.proxy(self.cropEnd, self));
	
	    if (options.responsive) {
	      $.addListener(window, EVENT_RESIZE, self.onResize = $.proxy(self.resize, self));
	    }
	  },
	  unbind: function unbind() {
	    var self = this;
	    var options = self.options;
	    var element = self.element;
	    var cropper = self.cropper;
	
	    if ($.isFunction(options.cropstart)) {
	      $.removeListener(element, EVENT_CROP_START, options.cropstart);
	    }
	
	    if ($.isFunction(options.cropmove)) {
	      $.removeListener(element, EVENT_CROP_MOVE, options.cropmove);
	    }
	
	    if ($.isFunction(options.cropend)) {
	      $.removeListener(element, EVENT_CROP_END, options.cropend);
	    }
	
	    if ($.isFunction(options.crop)) {
	      $.removeListener(element, EVENT_CROP, options.crop);
	    }
	
	    if ($.isFunction(options.zoom)) {
	      $.removeListener(element, EVENT_ZOOM, options.zoom);
	    }
	
	    $.removeListener(cropper, EVENT_MOUSE_DOWN, self.onCropStart);
	
	    if (options.zoomable && options.zoomOnWheel) {
	      $.removeListener(cropper, EVENT_WHEEL, self.onWheel);
	    }
	
	    if (options.toggleDragModeOnDblclick) {
	      $.removeListener(cropper, EVENT_DBLCLICK, self.onDblclick);
	    }
	
	    $.removeListener(document, EVENT_MOUSE_MOVE, self.onCropMove);
	    $.removeListener(document, EVENT_MOUSE_UP, self.onCropEnd);
	
	    if (options.responsive) {
	      $.removeListener(window, EVENT_RESIZE, self.onResize);
	    }
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REGEXP_ACTIONS = undefined;
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var REGEXP_ACTIONS = exports.REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;
	
	exports.default = {
	  resize: function resize() {
	    var self = this;
	    var restore = self.options.restore;
	    var container = self.container;
	    var containerData = self.containerData;
	
	    // Check `container` is necessary for IE8
	    if (self.disabled || !containerData) {
	      return;
	    }
	
	    var ratio = container.offsetWidth / containerData.width;
	    var canvasData = void 0;
	    var cropBoxData = void 0;
	
	    // Resize when width changed or height changed
	    if (ratio !== 1 || container.offsetHeight !== containerData.height) {
	      if (restore) {
	        canvasData = self.getCanvasData();
	        cropBoxData = self.getCropBoxData();
	      }
	
	      self.render();
	
	      if (restore) {
	        self.setCanvasData($.each(canvasData, function (n, i) {
	          canvasData[i] = n * ratio;
	        }));
	        self.setCropBoxData($.each(cropBoxData, function (n, i) {
	          cropBoxData[i] = n * ratio;
	        }));
	      }
	    }
	  },
	  dblclick: function dblclick() {
	    var self = this;
	
	    if (self.disabled) {
	      return;
	    }
	
	    self.setDragMode($.hasClass(self.dragBox, 'cropper-crop') ? 'move' : 'crop');
	  },
	  wheel: function wheel(event) {
	    var self = this;
	    var e = $.getEvent(event);
	    var ratio = Number(self.options.wheelZoomRatio) || 0.1;
	    var delta = 1;
	
	    if (self.disabled) {
	      return;
	    }
	
	    e.preventDefault();
	
	    // Limit wheel speed to prevent zoom too fast (#21)
	    if (self.wheeling) {
	      return;
	    }
	
	    self.wheeling = true;
	
	    setTimeout(function () {
	      self.wheeling = false;
	    }, 50);
	
	    if (e.deltaY) {
	      delta = e.deltaY > 0 ? 1 : -1;
	    } else if (e.wheelDelta) {
	      delta = -e.wheelDelta / 120;
	    } else if (e.detail) {
	      delta = e.detail > 0 ? 1 : -1;
	    }
	
	    self.zoom(-delta * ratio, e);
	  },
	  cropStart: function cropStart(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var touches = e.touches;
	    var touchesLength = void 0;
	    var touch = void 0;
	    var action = void 0;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (touches) {
	      touchesLength = touches.length;
	
	      if (touchesLength > 1) {
	        if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	          touch = touches[1];
	          self.startX2 = touch.pageX;
	          self.startY2 = touch.pageY;
	          action = 'zoom';
	        } else {
	          return;
	        }
	      }
	
	      touch = touches[0];
	    }
	
	    action = action || $.getData(e.target, 'action');
	
	    if (REGEXP_ACTIONS.test(action)) {
	      if ($.dispatchEvent(self.element, 'cropstart', {
	        originalEvent: e,
	        action: action
	      }) === false) {
	        return;
	      }
	
	      e.preventDefault();
	
	      self.action = action;
	      self.cropping = false;
	
	      self.startX = touch ? touch.pageX : e.pageX;
	      self.startY = touch ? touch.pageY : e.pageY;
	
	      if (action === 'crop') {
	        self.cropping = true;
	        $.addClass(self.dragBox, 'cropper-modal');
	      }
	    }
	  },
	  cropMove: function cropMove(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var touches = e.touches;
	    var action = self.action;
	    var touchesLength = void 0;
	    var touch = void 0;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (touches) {
	      touchesLength = touches.length;
	
	      if (touchesLength > 1) {
	        if (options.zoomable && options.zoomOnTouch && touchesLength === 2) {
	          touch = touches[1];
	          self.endX2 = touch.pageX;
	          self.endY2 = touch.pageY;
	        } else {
	          return;
	        }
	      }
	
	      touch = touches[0];
	    }
	
	    if (action) {
	      if ($.dispatchEvent(self.element, 'cropmove', {
	        originalEvent: e,
	        action: action
	      }) === false) {
	        return;
	      }
	
	      e.preventDefault();
	
	      self.endX = touch ? touch.pageX : e.pageX;
	      self.endY = touch ? touch.pageY : e.pageY;
	
	      self.change(e.shiftKey, action === 'zoom' ? e : null);
	    }
	  },
	  cropEnd: function cropEnd(event) {
	    var self = this;
	    var options = self.options;
	    var e = $.getEvent(event);
	    var action = self.action;
	
	    if (self.disabled) {
	      return;
	    }
	
	    if (action) {
	      e.preventDefault();
	
	      if (self.cropping) {
	        self.cropping = false;
	        $.toggleClass(self.dragBox, 'cropper-modal', self.cropped && options.modal);
	      }
	
	      self.action = '';
	
	      $.dispatchEvent(self.element, 'cropend', {
	        originalEvent: e,
	        action: action
	      });
	    }
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// Actions
	var ACTION_EAST = 'e';
	var ACTION_WEST = 'w';
	var ACTION_SOUTH = 's';
	var ACTION_NORTH = 'n';
	var ACTION_SOUTH_EAST = 'se';
	var ACTION_SOUTH_WEST = 'sw';
	var ACTION_NORTH_EAST = 'ne';
	var ACTION_NORTH_WEST = 'nw';
	
	exports.default = {
	  change: function change(shiftKey, originalEvent) {
	    var self = this;
	    var options = self.options;
	    var containerData = self.containerData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var aspectRatio = options.aspectRatio;
	    var action = self.action;
	    var width = cropBoxData.width;
	    var height = cropBoxData.height;
	    var left = cropBoxData.left;
	    var top = cropBoxData.top;
	    var right = left + width;
	    var bottom = top + height;
	    var minLeft = 0;
	    var minTop = 0;
	    var maxWidth = containerData.width;
	    var maxHeight = containerData.height;
	    var renderable = true;
	    var offset = void 0;
	
	    // Locking aspect ratio in "free mode" by holding shift key
	    if (!aspectRatio && shiftKey) {
	      aspectRatio = width && height ? width / height : 1;
	    }
	
	    if (self.limited) {
	      minLeft = cropBoxData.minLeft;
	      minTop = cropBoxData.minTop;
	      maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
	      maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
	    }
	
	    var range = {
	      x: self.endX - self.startX,
	      y: self.endY - self.startY
	    };
	
	    if (aspectRatio) {
	      range.X = range.y * aspectRatio;
	      range.Y = range.x / aspectRatio;
	    }
	
	    switch (action) {
	      // Move crop box
	      case 'all':
	        left += range.x;
	        top += range.y;
	        break;
	
	      // Resize crop box
	      case ACTION_EAST:
	        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }
	
	        width += range.x;
	
	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top -= range.Y / 2;
	        }
	
	        if (width < 0) {
	          action = ACTION_WEST;
	          width = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH:
	        if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }
	
	        height -= range.y;
	        top += range.y;
	
	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left += range.X / 2;
	        }
	
	        if (height < 0) {
	          action = ACTION_SOUTH;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_WEST:
	        if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }
	
	        width -= range.x;
	        left += range.x;
	
	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top += range.Y / 2;
	        }
	
	        if (width < 0) {
	          action = ACTION_EAST;
	          width = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH:
	        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }
	
	        height += range.y;
	
	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left -= range.X / 2;
	        }
	
	        if (height < 0) {
	          action = ACTION_NORTH;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH_EAST:
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
	            renderable = false;
	            break;
	          }
	
	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }
	
	          if (range.y <= 0) {
	            if (top > minTop) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_SOUTH_WEST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_NORTH_WEST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_SOUTH_EAST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_NORTH_WEST:
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
	            renderable = false;
	            break;
	          }
	
	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	          left += range.X;
	        } else {
	          if (range.x <= 0) {
	            if (left > minLeft) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }
	
	          if (range.y <= 0) {
	            if (top > minTop) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_SOUTH_EAST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_NORTH_EAST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_SOUTH_WEST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH_WEST:
	        if (aspectRatio) {
	          if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }
	
	          width -= range.x;
	          left += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x <= 0) {
	            if (left > minLeft) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }
	
	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_NORTH_EAST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_SOUTH_EAST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_NORTH_WEST;
	          height = 0;
	        }
	
	        break;
	
	      case ACTION_SOUTH_EAST:
	        if (aspectRatio) {
	          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }
	
	          width += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }
	
	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }
	
	        if (width < 0 && height < 0) {
	          action = ACTION_NORTH_WEST;
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          action = ACTION_SOUTH_WEST;
	          width = 0;
	        } else if (height < 0) {
	          action = ACTION_NORTH_EAST;
	          height = 0;
	        }
	
	        break;
	
	      // Move canvas
	      case 'move':
	        self.move(range.x, range.y);
	        renderable = false;
	        break;
	
	      // Zoom canvas
	      case 'zoom':
	        self.zoom(function (x1, y1, x2, y2) {
	          var z1 = Math.sqrt(x1 * x1 + y1 * y1);
	          var z2 = Math.sqrt(x2 * x2 + y2 * y2);
	
	          return (z2 - z1) / z1;
	        }(Math.abs(self.startX - self.startX2), Math.abs(self.startY - self.startY2), Math.abs(self.endX - self.endX2), Math.abs(self.endY - self.endY2)), originalEvent);
	        self.startX2 = self.endX2;
	        self.startY2 = self.endY2;
	        renderable = false;
	        break;
	
	      // Create crop box
	      case 'crop':
	        if (!range.x || !range.y) {
	          renderable = false;
	          break;
	        }
	
	        offset = $.getOffset(self.cropper);
	        left = self.startX - offset.left;
	        top = self.startY - offset.top;
	        width = cropBoxData.minWidth;
	        height = cropBoxData.minHeight;
	
	        if (range.x > 0) {
	          action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
	        } else if (range.x < 0) {
	          left -= width;
	          action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
	        }
	
	        if (range.y < 0) {
	          top -= height;
	        }
	
	        // Show the crop box if is hidden
	        if (!self.cropped) {
	          $.removeClass(self.cropBox, 'cropper-hidden');
	          self.cropped = true;
	
	          if (self.limited) {
	            self.limitCropBox(true, true);
	          }
	        }
	
	        break;
	
	      // No default
	    }
	
	    if (renderable) {
	      cropBoxData.width = width;
	      cropBoxData.height = height;
	      cropBoxData.left = left;
	      cropBoxData.top = top;
	      self.action = action;
	
	      self.renderCropBox();
	    }
	
	    // Override
	    self.startX = self.endX;
	    self.startY = self.endY;
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(4);
	
	var $ = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	exports.default = {
	  // Show the crop box manually
	  crop: function crop() {
	    var self = this;
	
	    if (self.ready && !self.disabled) {
	      if (!self.cropped) {
	        self.cropped = true;
	        self.limitCropBox(true, true);
	
	        if (self.options.modal) {
	          $.addClass(self.dragBox, 'cropper-modal');
	        }
	
	        $.removeClass(self.cropBox, 'cropper-hidden');
	      }
	
	      self.setCropBoxData(self.initialCropBoxData);
	    }
	
	    return self;
	  },
	
	
	  // Reset the image and crop box to their initial states
	  reset: function reset() {
	    var self = this;
	
	    if (self.ready && !self.disabled) {
	      self.imageData = $.extend({}, self.initialImageData);
	      self.canvasData = $.extend({}, self.initialCanvasData);
	      self.cropBoxData = $.extend({}, self.initialCropBoxData);
	
	      self.renderCanvas();
	
	      if (self.cropped) {
	        self.renderCropBox();
	      }
	    }
	
	    return self;
	  },
	
	
	  // Clear the crop box
	  clear: function clear() {
	    var self = this;
	
	    if (self.cropped && !self.disabled) {
	      $.extend(self.cropBoxData, {
	        left: 0,
	        top: 0,
	        width: 0,
	        height: 0
	      });
	
	      self.cropped = false;
	      self.renderCropBox();
	
	      self.limitCanvas();
	
	      // Render canvas after crop box rendered
	      self.renderCanvas();
	
	      $.removeClass(self.dragBox, 'cropper-modal');
	      $.addClass(self.cropBox, 'cropper-hidden');
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Replace the image's src and rebuild the cropper
	   *
	   * @param {String} url
	   * @param {Boolean} onlyColorChanged (optional)
	   */
	  replace: function replace(url, onlyColorChanged) {
	    var self = this;
	
	    if (!self.disabled && url) {
	      if (self.isImg) {
	        self.element.src = url;
	      }
	
	      if (onlyColorChanged) {
	        self.url = url;
	        self.image.src = url;
	
	        if (self.ready) {
	          self.image2.src = url;
	
	          $.each(self.previews, function (element) {
	            $.getByTag(element, 'img')[0].src = url;
	          });
	        }
	      } else {
	        if (self.isImg) {
	          self.replaced = true;
	        }
	
	        // Clear previous data
	        self.options.data = null;
	        self.load(url);
	      }
	    }
	
	    return self;
	  },
	
	
	  // Enable (unfreeze) the cropper
	  enable: function enable() {
	    var self = this;
	
	    if (self.ready) {
	      self.disabled = false;
	      $.removeClass(self.cropper, 'cropper-disabled');
	    }
	
	    return self;
	  },
	
	
	  // Disable (freeze) the cropper
	  disable: function disable() {
	    var self = this;
	
	    if (self.ready) {
	      self.disabled = true;
	      $.addClass(self.cropper, 'cropper-disabled');
	    }
	
	    return self;
	  },
	
	
	  // Destroy the cropper and remove the instance from the image
	  destroy: function destroy() {
	    var self = this;
	    var element = self.element;
	    var image = self.image;
	
	    if (self.loaded) {
	      if (self.isImg && self.replaced) {
	        element.src = self.originalUrl;
	      }
	
	      self.unbuild();
	      $.removeClass(element, 'cropper-hidden');
	    } else if (self.isImg) {
	      $.removeListener(element, 'load', self.start);
	    } else if (image) {
	      $.removeChild(image);
	    }
	
	    $.removeData(element, 'cropper');
	
	    return self;
	  },
	
	
	  /**
	   * Move the canvas with relative offsets
	   *
	   * @param {Number} offsetX
	   * @param {Number} offsetY (optional)
	   */
	  move: function move(offsetX, offsetY) {
	    var self = this;
	    var canvasData = self.canvasData;
	
	    return self.moveTo($.isUndefined(offsetX) ? offsetX : canvasData.left + Number(offsetX), $.isUndefined(offsetY) ? offsetY : canvasData.top + Number(offsetY));
	  },
	
	
	  /**
	   * Move the canvas to an absolute point
	   *
	   * @param {Number} x
	   * @param {Number} y (optional)
	   */
	  moveTo: function moveTo(x, y) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var changed = false;
	
	    // If "y" is not present, its default value is "x"
	    if ($.isUndefined(y)) {
	      y = x;
	    }
	
	    x = Number(x);
	    y = Number(y);
	
	    if (self.ready && !self.disabled && self.options.movable) {
	      if ($.isNumber(x)) {
	        canvasData.left = x;
	        changed = true;
	      }
	
	      if ($.isNumber(y)) {
	        canvasData.top = y;
	        changed = true;
	      }
	
	      if (changed) {
	        self.renderCanvas(true);
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Zoom the canvas with a relative ratio
	   *
	   * @param {Number} ratio
	   * @param {Event} _originalEvent (private)
	   */
	  zoom: function zoom(ratio, _originalEvent) {
	    var self = this;
	    var canvasData = self.canvasData;
	
	    ratio = Number(ratio);
	
	    if (ratio < 0) {
	      ratio = 1 / (1 - ratio);
	    } else {
	      ratio = 1 + ratio;
	    }
	
	    return self.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, _originalEvent);
	  },
	
	
	  /**
	   * Zoom the canvas to an absolute ratio
	   *
	   * @param {Number} ratio
	   * @param {Event} _originalEvent (private)
	   */
	  zoomTo: function zoomTo(ratio, _originalEvent) {
	    var self = this;
	    var options = self.options;
	    var canvasData = self.canvasData;
	    var width = canvasData.width;
	    var height = canvasData.height;
	    var naturalWidth = canvasData.naturalWidth;
	    var naturalHeight = canvasData.naturalHeight;
	    var newWidth = void 0;
	    var newHeight = void 0;
	    var offset = void 0;
	    var center = void 0;
	
	    ratio = Number(ratio);
	
	    if (ratio >= 0 && self.ready && !self.disabled && options.zoomable) {
	      newWidth = naturalWidth * ratio;
	      newHeight = naturalHeight * ratio;
	
	      if ($.dispatchEvent(self.element, 'zoom', {
	        originalEvent: _originalEvent,
	        oldRatio: width / naturalWidth,
	        ratio: newWidth / naturalWidth
	      }) === false) {
	        return self;
	      }
	
	      if (_originalEvent) {
	        offset = $.getOffset(self.cropper);
	        center = _originalEvent.touches ? $.getTouchesCenter(_originalEvent.touches) : {
	          pageX: _originalEvent.pageX,
	          pageY: _originalEvent.pageY
	        };
	
	        // Zoom from the triggering point of the event
	        canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
	        canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
	      } else {
	        // Zoom from the center of the canvas
	        canvasData.left -= (newWidth - width) / 2;
	        canvasData.top -= (newHeight - height) / 2;
	      }
	
	      canvasData.width = newWidth;
	      canvasData.height = newHeight;
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Rotate the canvas with a relative degree
	   *
	   * @param {Number} degree
	   */
	  rotate: function rotate(degree) {
	    var self = this;
	
	    return self.rotateTo((self.imageData.rotate || 0) + Number(degree));
	  },
	
	
	  /**
	   * Rotate the canvas to an absolute degree
	   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
	   *
	   * @param {Number} degree
	   */
	  rotateTo: function rotateTo(degree) {
	    var self = this;
	
	    degree = Number(degree);
	
	    if ($.isNumber(degree) && self.ready && !self.disabled && self.options.rotatable) {
	      self.imageData.rotate = degree % 360;
	      self.rotated = true;
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Scale the image
	   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
	   *
	   * @param {Number} scaleX
	   * @param {Number} scaleY (optional)
	   */
	  scale: function scale(scaleX, scaleY) {
	    var self = this;
	    var imageData = self.imageData;
	    var changed = false;
	
	    // If "scaleY" is not present, its default value is "scaleX"
	    if ($.isUndefined(scaleY)) {
	      scaleY = scaleX;
	    }
	
	    scaleX = Number(scaleX);
	    scaleY = Number(scaleY);
	
	    if (self.ready && !self.disabled && self.options.scalable) {
	      if ($.isNumber(scaleX)) {
	        imageData.scaleX = scaleX;
	        changed = true;
	      }
	
	      if ($.isNumber(scaleY)) {
	        imageData.scaleY = scaleY;
	        changed = true;
	      }
	
	      if (changed) {
	        self.renderImage(true);
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Scale the abscissa of the image
	   *
	   * @param {Number} scaleX
	   */
	  scaleX: function scaleX(_scaleX) {
	    var self = this;
	    var scaleY = self.imageData.scaleY;
	
	    return self.scale(_scaleX, $.isNumber(scaleY) ? scaleY : 1);
	  },
	
	
	  /**
	   * Scale the ordinate of the image
	   *
	   * @param {Number} scaleY
	   */
	  scaleY: function scaleY(_scaleY) {
	    var self = this;
	    var scaleX = self.imageData.scaleX;
	
	    return self.scale($.isNumber(scaleX) ? scaleX : 1, _scaleY);
	  },
	
	
	  /**
	   * Get the cropped area position and size data (base on the original image)
	   *
	   * @param {Boolean} rounded (optional)
	   * @return {Object} data
	   */
	  getData: function getData(rounded) {
	    var self = this;
	    var options = self.options;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = self.cropBoxData;
	    var ratio = void 0;
	    var data = void 0;
	
	    if (self.ready && self.cropped) {
	      data = {
	        x: cropBoxData.left - canvasData.left,
	        y: cropBoxData.top - canvasData.top,
	        width: cropBoxData.width,
	        height: cropBoxData.height
	      };
	
	      ratio = imageData.width / imageData.naturalWidth;
	
	      $.each(data, function (n, i) {
	        n /= ratio;
	        data[i] = rounded ? Math.round(n) : n;
	      });
	    } else {
	      data = {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      };
	    }
	
	    if (options.rotatable) {
	      data.rotate = imageData.rotate || 0;
	    }
	
	    if (options.scalable) {
	      data.scaleX = imageData.scaleX || 1;
	      data.scaleY = imageData.scaleY || 1;
	    }
	
	    return data;
	  },
	
	
	  /**
	   * Set the cropped area position and size with new data
	   *
	   * @param {Object} data
	   */
	  setData: function setData(data) {
	    var self = this;
	    var options = self.options;
	    var imageData = self.imageData;
	    var canvasData = self.canvasData;
	    var cropBoxData = {};
	    var rotated = void 0;
	    var scaled = void 0;
	    var ratio = void 0;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && !self.disabled && $.isPlainObject(data)) {
	      if (options.rotatable) {
	        if ($.isNumber(data.rotate) && data.rotate !== imageData.rotate) {
	          imageData.rotate = data.rotate;
	          self.rotated = rotated = true;
	        }
	      }
	
	      if (options.scalable) {
	        if ($.isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
	          imageData.scaleX = data.scaleX;
	          scaled = true;
	        }
	
	        if ($.isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
	          imageData.scaleY = data.scaleY;
	          scaled = true;
	        }
	      }
	
	      if (rotated) {
	        self.renderCanvas();
	      } else if (scaled) {
	        self.renderImage();
	      }
	
	      ratio = imageData.width / imageData.naturalWidth;
	
	      if ($.isNumber(data.x)) {
	        cropBoxData.left = data.x * ratio + canvasData.left;
	      }
	
	      if ($.isNumber(data.y)) {
	        cropBoxData.top = data.y * ratio + canvasData.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        cropBoxData.width = data.width * ratio;
	      }
	
	      if ($.isNumber(data.height)) {
	        cropBoxData.height = data.height * ratio;
	      }
	
	      self.setCropBoxData(cropBoxData);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get the container size data
	   *
	   * @return {Object} data
	   */
	  getContainerData: function getContainerData() {
	    var self = this;
	
	    return self.ready ? self.containerData : {};
	  },
	
	
	  /**
	   * Get the image position and size data
	   *
	   * @return {Object} data
	   */
	  getImageData: function getImageData() {
	    var self = this;
	
	    return self.loaded ? self.imageData : {};
	  },
	
	
	  /**
	   * Get the canvas position and size data
	   *
	   * @return {Object} data
	   */
	  getCanvasData: function getCanvasData() {
	    var self = this;
	    var canvasData = self.canvasData;
	    var data = {};
	
	    if (self.ready) {
	      $.each(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
	        data[n] = canvasData[n];
	      });
	    }
	
	    return data;
	  },
	
	
	  /**
	   * Set the canvas position and size with new data
	   *
	   * @param {Object} data
	   */
	  setCanvasData: function setCanvasData(data) {
	    var self = this;
	    var canvasData = self.canvasData;
	    var aspectRatio = canvasData.aspectRatio;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && !self.disabled && $.isPlainObject(data)) {
	      if ($.isNumber(data.left)) {
	        canvasData.left = data.left;
	      }
	
	      if ($.isNumber(data.top)) {
	        canvasData.top = data.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        canvasData.width = data.width;
	        canvasData.height = data.width / aspectRatio;
	      } else if ($.isNumber(data.height)) {
	        canvasData.height = data.height;
	        canvasData.width = data.height * aspectRatio;
	      }
	
	      self.renderCanvas(true);
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get the crop box position and size data
	   *
	   * @return {Object} data
	   */
	  getCropBoxData: function getCropBoxData() {
	    var self = this;
	    var cropBoxData = self.cropBoxData;
	    var data = void 0;
	
	    if (self.ready && self.cropped) {
	      data = {
	        left: cropBoxData.left,
	        top: cropBoxData.top,
	        width: cropBoxData.width,
	        height: cropBoxData.height
	      };
	    }
	
	    return data || {};
	  },
	
	
	  /**
	   * Set the crop box position and size with new data
	   *
	   * @param {Object} data
	   */
	  setCropBoxData: function setCropBoxData(data) {
	    var self = this;
	    var cropBoxData = self.cropBoxData;
	    var aspectRatio = self.options.aspectRatio;
	    var widthChanged = void 0;
	    var heightChanged = void 0;
	
	    if ($.isFunction(data)) {
	      data = data.call(self.element);
	    }
	
	    if (self.ready && self.cropped && !self.disabled && $.isPlainObject(data)) {
	      if ($.isNumber(data.left)) {
	        cropBoxData.left = data.left;
	      }
	
	      if ($.isNumber(data.top)) {
	        cropBoxData.top = data.top;
	      }
	
	      if ($.isNumber(data.width)) {
	        widthChanged = true;
	        cropBoxData.width = data.width;
	      }
	
	      if ($.isNumber(data.height)) {
	        heightChanged = true;
	        cropBoxData.height = data.height;
	      }
	
	      if (aspectRatio) {
	        if (widthChanged) {
	          cropBoxData.height = cropBoxData.width / aspectRatio;
	        } else if (heightChanged) {
	          cropBoxData.width = cropBoxData.height * aspectRatio;
	        }
	      }
	
	      self.renderCropBox();
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Get a canvas drawn the cropped image
	   *
	   * @param {Object} options (optional)
	   * @return {HTMLCanvasElement} canvas
	   */
	  getCroppedCanvas: function getCroppedCanvas(options) {
	    var self = this;
	
	    if (!self.ready || !window.HTMLCanvasElement) {
	      return null;
	    }
	
	    // Return the whole canvas if not cropped
	    if (!self.cropped) {
	      return $.getSourceCanvas(self.image, self.imageData);
	    }
	
	    if (!$.isPlainObject(options)) {
	      options = {};
	    }
	
	    var data = self.getData();
	    var originalWidth = data.width;
	    var originalHeight = data.height;
	    var aspectRatio = originalWidth / originalHeight;
	    var scaledWidth = void 0;
	    var scaledHeight = void 0;
	    var scaledRatio = void 0;
	
	    if ($.isPlainObject(options)) {
	      scaledWidth = options.width;
	      scaledHeight = options.height;
	
	      if (scaledWidth) {
	        scaledHeight = scaledWidth / aspectRatio;
	        scaledRatio = scaledWidth / originalWidth;
	      } else if (scaledHeight) {
	        scaledWidth = scaledHeight * aspectRatio;
	        scaledRatio = scaledHeight / originalHeight;
	      }
	    }
	
	    // The canvas element will use `Math.floor` on a float number, so floor first
	    var canvasWidth = Math.floor(scaledWidth || originalWidth);
	    var canvasHeight = Math.floor(scaledHeight || originalHeight);
	
	    var canvas = $.createElement('canvas');
	    var context = canvas.getContext('2d');
	
	    canvas.width = canvasWidth;
	    canvas.height = canvasHeight;
	
	    if (options.fillColor) {
	      context.fillStyle = options.fillColor;
	      context.fillRect(0, 0, canvasWidth, canvasHeight);
	    }
	
	    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	    var parameters = function () {
	      var source = $.getSourceCanvas(self.image, self.imageData);
	      var sourceWidth = source.width;
	      var sourceHeight = source.height;
	      var canvasData = self.canvasData;
	      var params = [source];
	
	      // Source canvas
	      var srcX = data.x + canvasData.naturalWidth * (Math.abs(data.scaleX || 1) - 1) / 2;
	      var srcY = data.y + canvasData.naturalHeight * (Math.abs(data.scaleY || 1) - 1) / 2;
	      var srcWidth = void 0;
	      var srcHeight = void 0;
	
	      // Destination canvas
	      var dstX = void 0;
	      var dstY = void 0;
	      var dstWidth = void 0;
	      var dstHeight = void 0;
	
	      if (srcX <= -originalWidth || srcX > sourceWidth) {
	        srcX = srcWidth = dstX = dstWidth = 0;
	      } else if (srcX <= 0) {
	        dstX = -srcX;
	        srcX = 0;
	        srcWidth = dstWidth = Math.min(sourceWidth, originalWidth + srcX);
	      } else if (srcX <= sourceWidth) {
	        dstX = 0;
	        srcWidth = dstWidth = Math.min(originalWidth, sourceWidth - srcX);
	      }
	
	      if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
	        srcY = srcHeight = dstY = dstHeight = 0;
	      } else if (srcY <= 0) {
	        dstY = -srcY;
	        srcY = 0;
	        srcHeight = dstHeight = Math.min(sourceHeight, originalHeight + srcY);
	      } else if (srcY <= sourceHeight) {
	        dstY = 0;
	        srcHeight = dstHeight = Math.min(originalHeight, sourceHeight - srcY);
	      }
	
	      params.push(Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight));
	
	      // Scale destination sizes
	      if (scaledRatio) {
	        dstX *= scaledRatio;
	        dstY *= scaledRatio;
	        dstWidth *= scaledRatio;
	        dstHeight *= scaledRatio;
	      }
	
	      // Avoid "IndexSizeError" in IE and Firefox
	      if (dstWidth > 0 && dstHeight > 0) {
	        params.push(Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
	      }
	
	      return params;
	    }();
	
	    context.drawImage.apply(context, _toConsumableArray(parameters));
	
	    return canvas;
	  },
	
	
	  /**
	   * Change the aspect ratio of the crop box
	   *
	   * @param {Number} aspectRatio
	   */
	  setAspectRatio: function setAspectRatio(aspectRatio) {
	    var self = this;
	    var options = self.options;
	
	    if (!self.disabled && !$.isUndefined(aspectRatio)) {
	      // 0 -> NaN
	      options.aspectRatio = Math.max(0, aspectRatio) || NaN;
	
	      if (self.ready) {
	        self.initCropBox();
	
	        if (self.cropped) {
	          self.renderCropBox();
	        }
	      }
	    }
	
	    return self;
	  },
	
	
	  /**
	   * Change the drag mode
	   *
	   * @param {String} mode (optional)
	   */
	  setDragMode: function setDragMode(mode) {
	    var self = this;
	    var options = self.options;
	    var dragBox = self.dragBox;
	    var face = self.face;
	    var croppable = void 0;
	    var movable = void 0;
	
	    if (self.loaded && !self.disabled) {
	      croppable = mode === 'crop';
	      movable = options.movable && mode === 'move';
	      mode = croppable || movable ? mode : 'none';
	
	      $.setData(dragBox, 'action', mode);
	      $.toggleClass(dragBox, 'cropper-crop', croppable);
	      $.toggleClass(dragBox, 'cropper-move', movable);
	
	      if (!options.cropBoxMovable) {
	        // Sync drag mode to crop box when it is not movable
	        $.setData(face, 'action', mode);
	        $.toggleClass(face, 'cropper-crop', croppable);
	        $.toggleClass(face, 'cropper-move', movable);
	      }
	    }
	
	    return self;
	  }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cropper.js.map

/***/ }),
/* 113 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at runLoaders (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:194:19)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:364:11\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:170:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:27:11)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at runLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:362:2)\n    at NormalModule.doBuild (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:181:3)\n    at NormalModule.build (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:274:15)\n    at Compilation.buildModule (/Users/domi91c/Kitboxer/node_modules/webpack/lib/Compilation.js:146:10)\n    at moduleFactory.create (/Users/domi91c/Kitboxer/node_modules/webpack/lib/Compilation.js:433:9)\n    at factory (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:253:5)\n    at applyPluginsAsyncWaterfall (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:99:14)\n    at /Users/domi91c/Kitboxer/node_modules/tapable/lib/Tapable.js:204:11\n    at NormalModuleFactory.params.normalModuleFactory.plugin (/Users/domi91c/Kitboxer/node_modules/webpack/lib/CompatibilityPlugin.js:52:5)\n    at NormalModuleFactory.applyPluginsAsyncWaterfall (/Users/domi91c/Kitboxer/node_modules/tapable/lib/Tapable.js:208:13)\n    at resolver (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:74:11)\n    at process.nextTick (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:205:8)\n    at _combinedTickCallback (internal/process/next_tick.js:73:7)\n    at process._tickCallback (internal/process/next_tick.js:104:9)");

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(115)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(117),
  /* template */
  __webpack_require__(118),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/node_modules/vue-spinner/src/PulseLoader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] PulseLoader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f1b26ce", Component.options)
  } else {
    hotAPI.reload("data-v-2f1b26ce", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(116);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("f678a90c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../css-loader/index.js?{\"minimize\":false}!../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2f1b26ce\",\"scoped\":false,\"hasInlineConfig\":false}!../../postcss-loader/lib/index.js?{\"sourceMap\":true}!../../resolve-url-loader/index.js!../../vue-loader/lib/selector.js?type=styles&index=0!./PulseLoader.vue", function() {
     var newContent = require("!!../../css-loader/index.js?{\"minimize\":false}!../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2f1b26ce\",\"scoped\":false,\"hasInlineConfig\":false}!../../postcss-loader/lib/index.js?{\"sourceMap\":true}!../../resolve-url-loader/index.js!../../vue-loader/lib/selector.js?type=styles&index=0!./PulseLoader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(undefined);
// imports


// module
exports.push([module.i, "/*.v-spinner\n{\n    margin: 100px auto;\n    text-align: center;\n}\n*/\n@-webkit-keyframes v-pulseStretchDelay {\n0%, 80% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    -webkit-opacity: 1;\n    opacity: 1;\n}\n45% {\n    -webkit-transform: scale(0.1);\n    transform: scale(0.1);\n    -webkit-opacity: 0.7;\n    opacity: 0.7;\n}\n}\n@keyframes v-pulseStretchDelay {\n0%, 80% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    -webkit-opacity: 1;\n    opacity: 1;\n}\n45% {\n    -webkit-transform: scale(0.1);\n    transform: scale(0.1);\n    -webkit-opacity: 0.7;\n    opacity: 0.7;\n}\n}", ""]);

// exports


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

  name: 'PulseLoader',

  props: {
    loading: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#5dc596'
    },
    size: {
      type: String,
      default: '15px'
    },
    margin: {
      type: String,
      default: '2px'
    },
    radius: {
      type: String,
      default: '100%'
    }
  },
  data: function data() {
    return {
      spinnerStyle: {
        backgroundColor: this.color,
        width: this.size,
        height: this.size,
        margin: this.margin,
        borderRadius: this.radius,
        display: 'inline-block',
        animationName: 'v-pulseStretchDelay',
        animationDuration: '0.75s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'cubic-bezier(.2,.68,.18,1.08)',
        animationFillMode: 'both'
      },
      spinnerDelay1: {
        animationDelay: '0.12s'
      },
      spinnerDelay2: {
        animationDelay: '0.24s'
      },
      spinnerDelay3: {
        animationDelay: '0.36s'
      }
    };
  }
});

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.loading),
      expression: "loading"
    }],
    staticClass: "v-spinner"
  }, [_c('div', {
    staticClass: "v-pulse v-pulse1",
    style: ([_vm.spinnerStyle, _vm.spinnerDelay1])
  }), _c('div', {
    staticClass: "v-pulse v-pulse2",
    style: ([_vm.spinnerStyle, _vm.spinnerDelay2])
  }), _c('div', {
    staticClass: "v-pulse v-pulse3",
    style: ([_vm.spinnerStyle, _vm.spinnerDelay3])
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2f1b26ce", module.exports)
  }
}

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var bind = __webpack_require__(62);
var Axios = __webpack_require__(121);
var defaults = __webpack_require__(41);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(66);
axios.CancelToken = __webpack_require__(135);
axios.isCancel = __webpack_require__(65);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(136);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 120 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(41);
var utils = __webpack_require__(9);
var InterceptorManager = __webpack_require__(130);
var dispatchRequest = __webpack_require__(131);
var isAbsoluteURL = __webpack_require__(133);
var combineURLs = __webpack_require__(134);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(64);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var transformData = __webpack_require__(132);
var isCancel = __webpack_require__(65);
var defaults = __webpack_require__(41);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(66);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal fade",
    attrs: {
      "id": "cropModal",
      "role": "dialog",
      "aria-labelledby": "modalLabel",
      "tabindex": "-1"
    }
  }, [_c('div', {
    staticClass: "modal-dialog modal-lg",
    attrs: {
      "role": "document"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('div', {
    staticClass: "modal-body"
  }, [_c('div', {
    staticClass: "img-container text-center"
  }, [(!_vm.cropperActive) ? _c('label', {
    staticClass: "drop-box ",
    attrs: {
      "for": "file"
    }
  }, [_c('p', {
    staticClass: "drop-box-text text-center"
  }, [_vm._v("Drop image here")])]) : _vm._e(), _vm._v(" "), _c('input', {
    ref: "file",
    staticClass: "inputfile",
    attrs: {
      "type": "file",
      "name": "file",
      "id": "file"
    },
    on: {
      "change": _vm.handleFileInput
    }
  }), _vm._v(" "), _c('vue-cropper', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.cropperLoading),
      expression: "!cropperLoading"
    }],
    ref: "cropper",
    attrs: {
      "aspect-ratio": 309 / 278,
      "guides": false,
      "minContainerWidth": 520,
      "minContainerHeight": 500,
      "view-mode": 1,
      "drag-mode": 'crop',
      "auto-crop-area": 0.5,
      "background": false,
      "rotatable": true
    }
  }), _vm._v(" "), _c('pulse-loader', {
    attrs: {
      "loading": _vm.cropperLoading
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('button', {
    staticClass: "btn btn-primary mt-2",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit()
      }
    }
  }, [_vm._v("Crop")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-warning mt-2",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.handleReset()
      }
    }
  }, [_vm._v("Reset")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-default mt-2",
    attrs: {
      "type": "button",
      "data-dismiss": "modal"
    }
  }, [_vm._v("Close")])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3b5b1e16", module.exports)
  }
}

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = "/packs-test/400300.jpg";

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {}, [_c('div', {
    staticClass: "user-photo",
    on: {
      "click": _vm.changeAvatar
    }
  }, [_c('img', {
    attrs: {
      "src": this.currentImage
    }
  })]), _vm._v(" "), _c('crop-modal', {
    attrs: {
      "image": _vm.image,
      "person": _vm.person
    },
    on: {
      "submit": _vm.setNewAvatar
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5adf658a", module.exports)
  }
}

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bootstrap_vue__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap_vue_dist_bootstrap_vue_css__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap_vue_dist_bootstrap_vue_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bootstrap_vue_dist_bootstrap_vue_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_turbolinks__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__image_uploader_ImageUploader_vue__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__image_uploader_ImageUploader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__image_uploader_ImageUploader_vue__);






__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_bootstrap_vue__["a" /* default */]);

document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('.js-image-uploader');
  if (el !== null) {
    var props = JSON.parse(el.getAttribute('data'));

    new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]({
      render: function render(h) {
        return h(__WEBPACK_IMPORTED_MODULE_4__image_uploader_ImageUploader_vue___default.a, { props: props });
      },
      mixins: [__WEBPACK_IMPORTED_MODULE_3_vue_turbolinks__["a" /* default */]]
    }).$mount(el);
  }
});

/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {function concat(){return Array.prototype.concat.apply([],arguments)}function readonlyDescriptor(){return{enumerable:!0,configurable:!1,writable:!1}}function identity(t){return t}function copyProps(t,e){if(void 0===e&&(e=identity),isArray(t))return t.map(e);var n={};for(var i in t)t.hasOwnProperty(i)&&(n[e(i)]="object"==typeof i?assign({},t[i]):t[i]);return n}function lowerFirst(t){return"string"!=typeof t&&(t=String(t)),t.charAt(0).toLowerCase()+t.slice(1)}function concat$1(){return Array.prototype.concat.apply([],arguments)}function mergeData(){for(var t=arguments,e=__assign({},arguments[0]),n=1;n<arguments.length;n++)for(var i=0,r=keys$1(arguments[n]);i<r.length;i++){var o=r[i];if(void 0!==e[o])switch(o){case"class":case"style":case"directives":e[o]=concat$1(e[o],t[n][o]);break;case"staticClass":e[o]&&(e[o]=e[o].trim()+" "),e[o]+=t[n][o].trim();break;case"on":case"nativeOn":for(var s=0,a=keys$1(arguments[n][o]);s<a.length;s++){var l=a[s];e[o][l]?e[o][l]=concat$1(t[n][o][l],e[o][l]):e[o][l]=t[n][o][l]}break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":e[o]=__assign({},e[o],t[n][o]);break;case"slot":case"key":case"ref":case"tag":case"show":case"keepAlive":default:e[o]=t[n][o]}else e[o]=t[n][o]}return e}function memoize(t){var e=create(null);return function(){var n=JSON.stringify(arguments);return e[n]=e[n]||t.apply(null,arguments)}}function observeDOM(t,e,n){var i=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,r=window.addEventListener;i?new i(function(t){(t[0].addedNodes.length>0||t[0].removedNodes.length>0)&&e()}).observe(t,assign({childList:!0,subtree:!0},n)):r&&(t.addEventListener("DOMNodeInserted",e,!1),t.addEventListener("DOMNodeRemoved",e,!1))}function pluckProps(t,e,n){return void 0===n&&(n=identity),(isArray(t)?t.slice():keys(t)).reduce(function(t,i){return t[n(i)]=e[i],t},{})}function upperFirst(t){return"string"!=typeof t&&(t=String(t)),t.charAt(0).toUpperCase()+t.slice(1)}function prefixPropName(t,e){return t+upperFirst(e)}function suffixPropName(t,e){return e+(t?upperFirst(t):"")}function unPrefixPropName(t,e){return lowerFirst(e.replace(t,""))}function warn(t){console.warn("[Bootstrap-Vue warn]: "+t)}function propsFactory(){return{href:{type:String,default:null},rel:{type:String,default:null},target:{type:String,default:"_self"},active:{type:Boolean,default:!1},activeClass:{type:String,default:"active"},append:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},event:{type:[String,Array],default:"click"},exact:{type:Boolean,default:!1},exactActiveClass:{type:String,default:"active"},replace:{type:Boolean,default:!1},routerTag:{type:String,default:"a"},to:{type:[String,Object],default:null}}}function computeTag(t){return t.to&&!t.disabled?"router-link":"a"}function computeHref(t){var e=t.disabled,n=t.href,i=t.to;return e?"#":n||(i&&"string"==typeof i?i:"#")}function computeRel(t){var e=t.target,n=t.rel;return"_blank"===e&&null===n?"noopener":n||null}function clickHandlerFactory(t){var e=t.disabled,n=t.tag,i=t.href,r=t.suppliedHandler,o=t.parent,s="router-link"===n;return function(t){e&&t instanceof Event?(t.stopPropagation(),t.stopImmediatePropagation()):(o.$root.$emit("clicked::link",t),s&&t.target.__vue__&&t.target.__vue__.$emit("click",t),"function"==typeof r&&r.apply(void 0,arguments)),(!s&&"#"===i||e)&&t.preventDefault()}}function handleFocus(t){"focusin"===t.type?t.target.classList.add("focus"):"focusout"===t.type&&t.target.classList.remove("focus")}function isVisible(t){return t&&(t.offsetWidth>0||t.offsetHeight>0)}function microtaskDebounce(t){var e=!1,n=0,i=document.createElement("span");return new MutationObserver(function(){t(),e=!1}).observe(i,{attributes:!0}),function(){e||(e=!0,i.setAttribute("x-index",n),n+=1)}}function taskDebounce(t){var e=!1;return function(){e||(e=!0,setTimeout(function(){e=!1,t()},timeoutDuration))}}function isFunction(t){var e={};return t&&"[object Function]"===e.toString.call(t)}function getStyleComputedProperty(t,e){if(1!==t.nodeType)return[];var n=window.getComputedStyle(t,null);return e?n[e]:n}function getParentNode(t){return"HTML"===t.nodeName?t:t.parentNode||t.host}function getScrollParent(t){if(!t||-1!==["HTML","BODY","#document"].indexOf(t.nodeName))return window.document.body;var e=getStyleComputedProperty(t),n=e.overflow,i=e.overflowX,r=e.overflowY;return/(auto|scroll)/.test(n+r+i)?t:getScrollParent(getParentNode(t))}function getOffsetParent(t){var e=t&&t.offsetParent,n=e&&e.nodeName;return n&&"BODY"!==n&&"HTML"!==n?-1!==["TD","TABLE"].indexOf(e.nodeName)&&"static"===getStyleComputedProperty(e,"position")?getOffsetParent(e):e:window.document.documentElement}function isOffsetContainer(t){var e=t.nodeName;return"BODY"!==e&&("HTML"===e||getOffsetParent(t.firstElementChild)===t)}function getRoot(t){return null!==t.parentNode?getRoot(t.parentNode):t}function findCommonOffsetParent(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return window.document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?t:e,r=n?e:t,o=document.createRange();o.setStart(i,0),o.setEnd(r,0);var s=o.commonAncestorContainer;if(t!==s&&e!==s||i.contains(r))return isOffsetContainer(s)?s:getOffsetParent(s);var a=getRoot(t);return a.host?findCommonOffsetParent(a.host,e):findCommonOffsetParent(t,getRoot(e).host)}function getScroll(t){var e="top"===(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top")?"scrollTop":"scrollLeft",n=t.nodeName;if("BODY"===n||"HTML"===n){var i=window.document.documentElement;return(window.document.scrollingElement||i)[e]}return t[e]}function includeScroll(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=getScroll(e,"top"),r=getScroll(e,"left"),o=n?-1:1;return t.top+=i*o,t.bottom+=i*o,t.left+=r*o,t.right+=r*o,t}function getBordersSize(t,e){var n="x"===e?"Left":"Top",i="Left"===n?"Right":"Bottom";return+t["border"+n+"Width"].split("px")[0]+ +t["border"+i+"Width"].split("px")[0]}function getSize(t,e,n,i){return Math.max(e["offset"+t],e["scroll"+t],n["client"+t],n["offset"+t],n["scroll"+t],isIE10$1()?n["offset"+t]+i["margin"+("Height"===t?"Top":"Left")]+i["margin"+("Height"===t?"Bottom":"Right")]:0)}function getWindowSizes(){var t=window.document.body,e=window.document.documentElement,n=isIE10$1()&&window.getComputedStyle(e);return{height:getSize("Height",t,e,n),width:getSize("Width",t,e,n)}}function getClientRect(t){return _extends({},t,{right:t.left+t.width,bottom:t.top+t.height})}function getBoundingClientRect(t){var e={};if(isIE10$1())try{e=t.getBoundingClientRect();var n=getScroll(t,"top"),i=getScroll(t,"left");e.top+=n,e.left+=i,e.bottom+=n,e.right+=i}catch(t){}else e=t.getBoundingClientRect();var r={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},o="HTML"===t.nodeName?getWindowSizes():{},s=o.width||t.clientWidth||r.right-r.left,a=o.height||t.clientHeight||r.bottom-r.top,l=t.offsetWidth-s,u=t.offsetHeight-a;if(l||u){var d=getStyleComputedProperty(t);l-=getBordersSize(d,"x"),u-=getBordersSize(d,"y"),r.width-=l,r.height-=u}return getClientRect(r)}function getOffsetRectRelativeToArbitraryNode(t,e){var n=isIE10$1(),i="HTML"===e.nodeName,r=getBoundingClientRect(t),o=getBoundingClientRect(e),s=getScrollParent(t),a=getStyleComputedProperty(e),l=+a.borderTopWidth.split("px")[0],u=+a.borderLeftWidth.split("px")[0],d=getClientRect({top:r.top-o.top-l,left:r.left-o.left-u,width:r.width,height:r.height});if(d.marginTop=0,d.marginLeft=0,!n&&i){var c=+a.marginTop.split("px")[0],p=+a.marginLeft.split("px")[0];d.top-=l-c,d.bottom-=l-c,d.left-=u-p,d.right-=u-p,d.marginTop=c,d.marginLeft=p}return(n?e.contains(s):e===s&&"BODY"!==s.nodeName)&&(d=includeScroll(d,e)),d}function getViewportOffsetRectRelativeToArtbitraryNode(t){var e=window.document.documentElement,n=getOffsetRectRelativeToArbitraryNode(t,e),i=Math.max(e.clientWidth,window.innerWidth||0),r=Math.max(e.clientHeight,window.innerHeight||0),o=getScroll(e),s=getScroll(e,"left");return getClientRect({top:o-n.top+n.marginTop,left:s-n.left+n.marginLeft,width:i,height:r})}function isFixed(t){var e=t.nodeName;return"BODY"!==e&&"HTML"!==e&&("fixed"===getStyleComputedProperty(t,"position")||isFixed(getParentNode(t)))}function getBoundaries(t,e,n,i){var r={top:0,left:0},o=findCommonOffsetParent(t,e);if("viewport"===i)r=getViewportOffsetRectRelativeToArtbitraryNode(o);else{var s=void 0;"scrollParent"===i?"BODY"===(s=getScrollParent(getParentNode(t))).nodeName&&(s=window.document.documentElement):s="window"===i?window.document.documentElement:i;var a=getOffsetRectRelativeToArbitraryNode(s,o);if("HTML"!==s.nodeName||isFixed(o))r=a;else{var l=getWindowSizes(),u=l.height,d=l.width;r.top+=a.top-a.marginTop,r.bottom=u+a.top,r.left+=a.left-a.marginLeft,r.right=d+a.left}}return r.left+=n,r.top+=n,r.right-=n,r.bottom-=n,r}function getArea(t){return t.width*t.height}function computeAutoPlacement(t,e,n,i,r){var o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var s=getBoundaries(n,i,o,r),a={top:{width:s.width,height:e.top-s.top},right:{width:s.right-e.right,height:s.height},bottom:{width:s.width,height:s.bottom-e.bottom},left:{width:e.left-s.left,height:s.height}},l=Object.keys(a).map(function(t){return _extends({key:t},a[t],{area:getArea(a[t])})}).sort(function(t,e){return e.area-t.area}),u=l.filter(function(t){var e=t.width,i=t.height;return e>=n.clientWidth&&i>=n.clientHeight}),d=u.length>0?u[0].key:l[0].key,c=t.split("-")[1];return d+(c?"-"+c:"")}function getReferenceOffsets(t,e,n){return getOffsetRectRelativeToArbitraryNode(n,findCommonOffsetParent(e,n))}function getOuterSizes(t){var e=window.getComputedStyle(t),n=parseFloat(e.marginTop)+parseFloat(e.marginBottom),i=parseFloat(e.marginLeft)+parseFloat(e.marginRight);return{width:t.offsetWidth+i,height:t.offsetHeight+n}}function getOppositePlacement(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,function(t){return e[t]})}function getPopperOffsets(t,e,n){n=n.split("-")[0];var i=getOuterSizes(t),r={width:i.width,height:i.height},o=-1!==["right","left"].indexOf(n),s=o?"top":"left",a=o?"left":"top",l=o?"height":"width",u=o?"width":"height";return r[s]=e[s]+e[l]/2-i[l]/2,r[a]=n===a?e[a]-i[u]:e[getOppositePlacement(a)],r}function find(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function findIndex(t,e,n){if(Array.prototype.findIndex)return t.findIndex(function(t){return t[e]===n});var i=find(t,function(t){return t[e]===n});return t.indexOf(i)}function runModifiers(t,e,n){return(void 0===n?t:t.slice(0,findIndex(t,"name",n))).forEach(function(t){t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=t.function||t.fn;t.enabled&&isFunction(n)&&(e.offsets.popper=getClientRect(e.offsets.popper),e.offsets.reference=getClientRect(e.offsets.reference),e=n(e,t))}),e}function update(){if(!this.state.isDestroyed){var t={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=getReferenceOffsets(this.state,this.popper,this.reference),t.placement=computeAutoPlacement(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.offsets.popper=getPopperOffsets(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position="absolute",t=runModifiers(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t))}}function isModifierEnabled(t,e){return t.some(function(t){var n=t.name;return t.enabled&&n===e})}function getSupportedPropertyName(t){for(var e=[!1,"ms","Webkit","Moz","O"],n=t.charAt(0).toUpperCase()+t.slice(1),i=0;i<e.length-1;i++){var r=e[i],o=r?""+r+n:t;if(void 0!==window.document.body.style[o])return o}return null}function destroy(){return this.state.isDestroyed=!0,isModifierEnabled(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.left="",this.popper.style.position="",this.popper.style.top="",this.popper.style[getSupportedPropertyName("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function attachToScrollParents(t,e,n,i){var r="BODY"===t.nodeName,o=r?window:t;o.addEventListener(e,n,{passive:!0}),r||attachToScrollParents(getScrollParent(o.parentNode),e,n,i),i.push(o)}function setupEventListeners(t,e,n,i){n.updateBound=i,window.addEventListener("resize",n.updateBound,{passive:!0});var r=getScrollParent(t);return attachToScrollParents(r,"scroll",n.updateBound,n.scrollParents),n.scrollElement=r,n.eventsEnabled=!0,n}function enableEventListeners(){this.state.eventsEnabled||(this.state=setupEventListeners(this.reference,this.options,this.state,this.scheduleUpdate))}function removeEventListeners(t,e){return window.removeEventListener("resize",e.updateBound),e.scrollParents.forEach(function(t){t.removeEventListener("scroll",e.updateBound)}),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e}function disableEventListeners(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=removeEventListeners(this.reference,this.state))}function isNumeric(t){return""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function setStyles(t,e){Object.keys(e).forEach(function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&isNumeric(e[n])&&(i="px"),t.style[n]=e[n]+i})}function setAttributes(t,e){Object.keys(e).forEach(function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n)})}function applyStyle(t){return setStyles(t.instance.popper,t.styles),setAttributes(t.instance.popper,t.attributes),t.arrowElement&&Object.keys(t.arrowStyles).length&&setStyles(t.arrowElement,t.arrowStyles),t}function applyStyleOnLoad(t,e,n,i,r){var o=getReferenceOffsets(r,e,t),s=computeAutoPlacement(n.placement,o,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",s),setStyles(e,{position:"absolute"}),n}function computeStyle(t,e){var n=e.x,i=e.y,r=t.offsets.popper,o=find(t.instance.modifiers,function(t){return"applyStyle"===t.name}).gpuAcceleration;void 0!==o&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var s=void 0!==o?o:e.gpuAcceleration,a=getBoundingClientRect(getOffsetParent(t.instance.popper)),l={position:r.position},u={left:Math.floor(r.left),top:Math.floor(r.top),bottom:Math.floor(r.bottom),right:Math.floor(r.right)},d="bottom"===n?"top":"bottom",c="right"===i?"left":"right",p=getSupportedPropertyName("transform"),f=void 0,h=void 0;if(h="bottom"===d?-a.height+u.bottom:u.top,f="right"===c?-a.width+u.right:u.left,s&&p)l[p]="translate3d("+f+"px, "+h+"px, 0)",l[d]=0,l[c]=0,l.willChange="transform";else{var m="bottom"===d?-1:1,g="right"===c?-1:1;l[d]=h*m,l[c]=f*g,l.willChange=d+", "+c}var b={"x-placement":t.placement};return t.attributes=_extends({},b,t.attributes),t.styles=_extends({},l,t.styles),t.arrowStyles=_extends({},t.offsets.arrow,t.arrowStyles),t}function isModifierRequired(t,e,n){var i=find(t,function(t){return t.name===e}),r=!!i&&t.some(function(t){return t.name===n&&t.enabled&&t.order<i.order});if(!r){var o="`"+e+"`",s="`"+n+"`";console.warn(s+" modifier is required by "+o+" modifier in order to work, be sure to include it before "+o+"!")}return r}function arrow(t,e){if(!isModifierRequired(t.instance.modifiers,"arrow","keepTogether"))return t;var n=e.element;if("string"==typeof n){if(!(n=t.instance.popper.querySelector(n)))return t}else if(!t.instance.popper.contains(n))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),t;var i=t.placement.split("-")[0],r=t.offsets,o=r.popper,s=r.reference,a=-1!==["left","right"].indexOf(i),l=a?"height":"width",u=a?"Top":"Left",d=u.toLowerCase(),c=a?"left":"top",p=a?"bottom":"right",f=getOuterSizes(n)[l];s[p]-f<o[d]&&(t.offsets.popper[d]-=o[d]-(s[p]-f)),s[d]+f>o[p]&&(t.offsets.popper[d]+=s[d]+f-o[p]);var h=s[d]+s[l]/2-f/2,m=getStyleComputedProperty(t.instance.popper,"margin"+u).replace("px",""),g=h-getClientRect(t.offsets.popper)[d]-m;return g=Math.max(Math.min(o[l]-f,g),0),t.arrowElement=n,t.offsets.arrow={},t.offsets.arrow[d]=Math.round(g),t.offsets.arrow[c]="",t}function getOppositeVariation(t){return"end"===t?"start":"start"===t?"end":t}function clockwise(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=validPlacements.indexOf(t),i=validPlacements.slice(n+1).concat(validPlacements.slice(0,n));return e?i.reverse():i}function flip(t,e){if(isModifierEnabled(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=getBoundaries(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement),i=t.placement.split("-")[0],r=getOppositePlacement(i),o=t.placement.split("-")[1]||"",s=[];switch(e.behavior){case BEHAVIORS.FLIP:s=[i,r];break;case BEHAVIORS.CLOCKWISE:s=clockwise(i);break;case BEHAVIORS.COUNTERCLOCKWISE:s=clockwise(i,!0);break;default:s=e.behavior}return s.forEach(function(a,l){if(i!==a||s.length===l+1)return t;i=t.placement.split("-")[0],r=getOppositePlacement(i);var u=t.offsets.popper,d=t.offsets.reference,c=Math.floor,p="left"===i&&c(u.right)>c(d.left)||"right"===i&&c(u.left)<c(d.right)||"top"===i&&c(u.bottom)>c(d.top)||"bottom"===i&&c(u.top)<c(d.bottom),f=c(u.left)<c(n.left),h=c(u.right)>c(n.right),m=c(u.top)<c(n.top),g=c(u.bottom)>c(n.bottom),b="left"===i&&f||"right"===i&&h||"top"===i&&m||"bottom"===i&&g,v=-1!==["top","bottom"].indexOf(i),y=!!e.flipVariations&&(v&&"start"===o&&f||v&&"end"===o&&h||!v&&"start"===o&&m||!v&&"end"===o&&g);(p||b||y)&&(t.flipped=!0,(p||b)&&(i=s[l+1]),y&&(o=getOppositeVariation(o)),t.placement=i+(o?"-"+o:""),t.offsets.popper=_extends({},t.offsets.popper,getPopperOffsets(t.instance.popper,t.offsets.reference,t.placement)),t=runModifiers(t.instance.modifiers,t,"flip"))}),t}function keepTogether(t){var e=t.offsets,n=e.popper,i=e.reference,r=t.placement.split("-")[0],o=Math.floor,s=-1!==["top","bottom"].indexOf(r),a=s?"right":"bottom",l=s?"left":"top",u=s?"width":"height";return n[a]<o(i[l])&&(t.offsets.popper[l]=o(i[l])-n[u]),n[l]>o(i[a])&&(t.offsets.popper[l]=o(i[a])),t}function toValue(t,e,n,i){var r=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),o=+r[1],s=r[2];if(!o)return t;if(0===s.indexOf("%")){var a=void 0;switch(s){case"%p":a=n;break;case"%":case"%r":default:a=i}return getClientRect(a)[e]/100*o}if("vh"===s||"vw"===s){return("vh"===s?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*o}return o}function parseOffset(t,e,n,i){var r=[0,0],o=-1!==["right","left"].indexOf(i),s=t.split(/(\+|\-)/).map(function(t){return t.trim()}),a=s.indexOf(find(s,function(t){return-1!==t.search(/,|\s/)}));s[a]&&-1===s[a].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,u=-1!==a?[s.slice(0,a).concat([s[a].split(l)[0]]),[s[a].split(l)[1]].concat(s.slice(a+1))]:[s];return(u=u.map(function(t,i){var r=(1===i?!o:o)?"height":"width",s=!1;return t.reduce(function(t,e){return""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,s=!0,t):s?(t[t.length-1]+=e,s=!1,t):t.concat(e)},[]).map(function(t){return toValue(t,r,e,n)})})).forEach(function(t,e){t.forEach(function(n,i){isNumeric(n)&&(r[e]+=n*("-"===t[i-1]?-1:1))})}),r}function offset(t,e){var n=e.offset,i=t.placement,r=t.offsets,o=r.popper,s=r.reference,a=i.split("-")[0],l=void 0;return l=isNumeric(+n)?[+n,0]:parseOffset(n,o,s,a),"left"===a?(o.top+=l[0],o.left-=l[1]):"right"===a?(o.top+=l[0],o.left+=l[1]):"top"===a?(o.left+=l[0],o.top-=l[1]):"bottom"===a&&(o.left+=l[0],o.top+=l[1]),t.popper=o,t}function preventOverflow(t,e){var n=e.boundariesElement||getOffsetParent(t.instance.popper);t.instance.reference===n&&(n=getOffsetParent(n));var i=getBoundaries(t.instance.popper,t.instance.reference,e.padding,n);e.boundaries=i;var r=e.priority,o=t.offsets.popper,s={primary:function(t){var n=o[t];return o[t]<i[t]&&!e.escapeWithReference&&(n=Math.max(o[t],i[t])),defineProperty$1({},t,n)},secondary:function(t){var n="right"===t?"left":"top",r=o[n];return o[t]>i[t]&&!e.escapeWithReference&&(r=Math.min(o[n],i[t]-("right"===t?o.width:o.height))),defineProperty$1({},n,r)}};return r.forEach(function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";o=_extends({},o,s[e](t))}),t.offsets.popper=o,t}function shift(t){var e=t.placement,n=e.split("-")[0],i=e.split("-")[1];if(i){var r=t.offsets,o=r.reference,s=r.popper,a=-1!==["bottom","top"].indexOf(n),l=a?"left":"top",u=a?"width":"height",d={start:defineProperty$1({},l,o[l]),end:defineProperty$1({},l,o[l]+o[u]-s[u])};t.offsets.popper=_extends({},s,d[i])}return t}function hide(t){if(!isModifierRequired(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=find(t.instance.modifiers,function(t){return"preventOverflow"===t.name}).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]=""}else{if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1}return t}function inner(t){var e=t.placement,n=e.split("-")[0],i=t.offsets,r=i.popper,o=i.reference,s=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return r[s?"left":"top"]=o[n]-(a?r[s?"width":"height"]:0),t.placement=getOppositePlacement(e),t.offsets.popper=getClientRect(r),t}function isVisible$1(t){return t&&(t.offsetWidth>0||t.offsetHeight>0)}function filterVisible(t){return(t||[]).filter(isVisible$1)}function pickLinkProps(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];return keys(props$10).reduce(function(e,n){return arrayIncludes(t,n)&&(e[n]=props$10[n]),e},{})}function getTransisionEndEvent(t){for(var e in TransitionEndEvents)if(void 0!==t.style[e])return TransitionEndEvents[e];return null}function makeBlankImgSrc(t,e,n){return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(BLANK_TEMPLATE.replace("%{w}",String(t)).replace("%{h}",String(e)).replace("%{f}",n))}function boolStrNum(){return{type:[Boolean,String,Number],default:!1}}function strNum(){return{type:[String,Number],default:null}}function isVisible$2(t){return t&&(t.offsetWidth>0||t.offsetHeight>0)}function findFirstVisible(t,e){if(!t||!t.querySelectorAll||!e)return null;for(var n=from(t.querySelectorAll(e)),i=n.find?n.find(function(t){return isVisible$2(t)}):null,r=0;!i&&r<n.length;r++)isVisible$2(n[r])&&(i=n[r]);return i}function isVisible$3(t){return t&&(t.offsetWidth>0||t.offsetHeight>0)}function makePageArray(t,e){return range(e).map(function(e,n){return{number:n+t,className:null}})}function isVisible$4(t){return t&&(t.offsetWidth>0||t.offsetHeight>0)}function makePageArray$1(t,e){return range(e).map(function(e,n){return{number:n+t,className:null}})}function generateId(t){return"__BV_"+t+"_"+NEXTID+++"__"}function arrayReduce(t,e,n,i){var r=-1,o=t?t.length:0;for(i&&o&&(n=t[++r]);++r<o;)n=e(n,t[r],r,t);return n}function asciiToArray(t){return t.split("")}function asciiWords(t){return t.match(reAsciiWord)||[]}function basePropertyOf(t){return function(e){return null==t?void 0:t[e]}}function hasUnicode(t){return reHasUnicode.test(t)}function hasUnicodeWord(t){return reHasUnicodeWord.test(t)}function stringToArray(t){return hasUnicode(t)?unicodeToArray(t):asciiToArray(t)}function unicodeToArray(t){return t.match(reUnicode)||[]}function unicodeWords(t){return t.match(reUnicodeWord)||[]}function baseSlice(t,e,n){var i=-1,r=t.length;e<0&&(e=-e>r?0:r+e),(n=n>r?r:n)<0&&(n+=r),r=e>n?0:n-e>>>0,e>>>=0;for(var o=Array(r);++i<r;)o[i]=t[i+e];return o}function baseToString(t){if("string"==typeof t)return t;if(isSymbol(t))return symbolToString?symbolToString.call(t):"";var e=t+"";return"0"==e&&1/t==-INFINITY?"-0":e}function castSlice(t,e,n){var i=t.length;return n=void 0===n?i:n,!e&&n>=i?t:baseSlice(t,e,n)}function createCaseFirst(t){return function(e){var n=hasUnicode(e=toString$1(e))?stringToArray(e):void 0,i=n?n[0]:e.charAt(0),r=n?castSlice(n,1).join(""):e.slice(1);return i[t]()+r}}function createCompounder(t){return function(e){return arrayReduce(words(deburr(e).replace(reApos,"")),t,"")}}function isObjectLike(t){return!!t&&"object"==typeof t}function isSymbol(t){return"symbol"==typeof t||isObjectLike(t)&&objectToString.call(t)==symbolTag}function toString$1(t){return null==t?"":baseToString(t)}function deburr(t){return(t=toString$1(t))&&t.replace(reLatin,deburrLetter).replace(reComboMark,"")}function words(t,e,n){return t=toString$1(t),void 0===(e=n?void 0:e)?hasUnicodeWord(t)?unicodeWords(t):asciiWords(t):t.match(e)||[]}function targets(t,e,n,i){var r=keys(e.modifiers||{}).filter(function(t){return!all_listen_types[t]});e.value&&r.push(e.value);var o=function(){i({targets:r,vnode:t})};return keys(all_listen_types).forEach(function(i){(n[i]||e.modifiers[i])&&t.elm.addEventListener(i,o)}),r}function isElement(t){return t.nodeType}function closest(t,e){var n=t.closest(e);return n===t?null:n}function $QSA(t,e){return e||(e=document),isElement(e)?from(e.querySelectorAll(t)):[]}function $QS(t,e){return e||(e=document),isElement(e)?e.querySelector(t)||null:null}function getVm(t){return t?t.__vue__:null}function toType(t){return{}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function typeCheckConfig(t,e,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var r=n[i],o=e[i],s=o&&isElement(o)?"element":toType(o);new RegExp(r).test(s)||console.error(t+': Option "'+i+'" provided type "'+s+'" but expected type "'+r+'"')}}function ScrollSpy(t,e,n){this._$el=t,this._selector=[Selector$2.NAV_LINKS,Selector$2.LIST_ITEMS,Selector$2.DROPDOWN_ITEMS].join(","),this._config=assign({},Default),this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,this._$root=n.context.$root||null,this._resizeTimeout=null,this.updateConfig(e)}function parseBindings(t){var e={};"string"==typeof t.value?e.title=t.value:"function"==typeof t.value?e.title=t.value:"object"==typeof t.value&&(e=assign(t.value)),t.arg&&(e.container="#"+t.arg),keys(t.modifiers).forEach(function(t){if(/^html$/.test(t))e.html=!0;else if(/^nofade$/.test(t))e.animation=!1;else if(/^(auto|top|bottom|left|right)$/.test(t))e.placement=t;else if(/^d\d+$/.test(t)){var n=parseInt(t.slice(1),10)||0;n&&(e.delay=n)}else if(/^o\d+$/.test(t)){var i=parseInt(t.slice(1),10)||0;i&&(e.offset=i)}});var n={};return("string"==typeof e.trigger?e.trigger.trim().split(/\s+/):[]).forEach(function(t){validTriggers[t]&&(n[t]=!0)}),keys(validTriggers).forEach(function(e){t.modifiers[e]&&(n[e]=!0)}),e.trigger=keys(n).join(" "),e.trigger||delete e.trigger,e}function applyBVTT(t,e,n){inBrowser$3&&(Popper?t[BVTT]?t[BVTT].updateConfig(parseBindings(e)):t[BVTT]=new ToolTip(t,parseBindings(e),n.context.$root):warn("v-b-tooltip: Popper.js is required for tooltips to work"))}function removeBVTT(t){inBrowser$3&&t[BVTT]&&(t[BVTT].destroy(),t[BVTT]=null,delete t[BVTT])}function parseBindings$1(t){var e={};"string"==typeof t.value?e.content=t.value:"function"==typeof t.value?e.content=t.value:"object"==typeof t.value&&(e=assign(t.value)),t.arg&&(e.container="#"+t.arg),keys(t.modifiers).forEach(function(t){if(/^html$/.test(t))e.html=!0;else if(/^nofade$/.test(t))e.animation=!1;else if(/^(auto|top|bottom|left|right)$/.test(t))e.placement=t;else if(/^d\d+$/.test(t)){var n=parseInt(t.slice(1),10)||0;n&&(e.delay=n)}else if(/^o\d+$/.test(t)){var i=parseInt(t.slice(1),10)||0;i&&(e.offset=i)}});var n={};return("string"==typeof e.trigger?e.trigger.trim().split(/\s+/):[]).forEach(function(t){validTriggers$1[t]&&(n[t]=!0)}),keys(validTriggers$1).forEach(function(e){t.modifiers[e]&&(n[e]=!0)}),e.trigger=keys(n).join(" "),e.trigger||delete e.trigger,e}function applyBVPO(t,e,n){inBrowser$4&&(Popper?t[BVPO]?t[BVPO].updateConfig(parseBindings$1(e)):t[BVPO]=new PopOver(t,parseBindings$1(e),n.context.$root):warn("v-b-popover: Popper.js is required for popovers to work"))}function removeBVPO(t){inBrowser$4&&t[BVPO]&&(t[BVPO].destroy(),t[BVPO]=null,delete t[BVPO])}Array.from||(Array.from=function(){var t=Object.prototype.toString,e=function(e){return"function"==typeof e||"[object Function]"===t.call(e)},n=function(t){var e=Number(t);return isNaN(e)?0:0!==e&&isFinite(e)?(e>0?1:-1)*Math.floor(Math.abs(e)):e},i=Math.pow(2,53)-1,r=function(t){return Math.min(Math.max(n(t),0),i)};return function(t){var n=this,i=Object(t);if(null==t)throw new TypeError("Array.from requires an array-like object - not null or undefined");var o,s=arguments.length>1?arguments[1]:void 0;if(void 0!==s){if(!e(s))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(o=arguments[2])}for(var a,l=r(i.length),u=e(n)?Object(new n(l)):new Array(l),d=0;d<l;)a=i[d],u[d]=s?void 0===o?s(a,d):s.call(o,a,d):a,d+=1;return u.length=l,u}}()),Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)});var from=Array.from,isArray=Array.isArray,arrayIncludes=function(t,e){return-1!==t.indexOf(e)};"function"!=typeof Object.assign&&(Object.assign=function(t,e){var n=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),r=1;r<arguments.length;r++){var o=n[r];if(null!=o)for(var s in o)Object.prototype.hasOwnProperty.call(o,s)&&(i[s]=o[s])}return i});var assign=Object.assign,keys=Object.keys,defineProperties=Object.defineProperties,defineProperty=Object.defineProperty,create=Object.create,__assign=Object.assign||function(t){for(var e,n=arguments,i=1,r=arguments.length;i<r;i++){e=n[i];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},keys$1=Object.keys,lib_common=mergeData,alert={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.localShow?n("div",{class:t.classObject,attrs:{role:"alert","aria-live":"polite","aria-atomic":"true"}},[t.dismissible?n("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"alert","aria-label":t.dismissLabel},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.dismiss(e)}}},[n("span",{staticClass:"d-inline-block",attrs:{"aria-hidden":"true"}},[t._t("dismiss",[t._v("×")])],2)]):t._e(),t._t("default")],2):t._e()},staticRenderFns:[],model:{prop:"show",event:"input"},data:function(){return{countDownTimerId:null,dismissed:!1}},computed:{classObject:function(){return["alert",this.alertVariant,this.dismissible?"alert-dismissible":""]},alertVariant:function(){return"alert-"+this.variant},localShow:function(){return!this.dismissed&&(this.countDownTimerId||this.show)}},props:{variant:{type:String,default:"info"},dismissible:{type:Boolean,default:!1},dismissLabel:{type:String,default:"Close"},show:{type:[Boolean,Number],default:!1}},watch:{show:function(){this.showChanged()}},mounted:function(){this.showChanged()},destroyed:function(){this.clearCounter()},methods:{dismiss:function(){this.clearCounter(),this.dismissed=!0,this.$emit("dismissed"),this.$emit("input",!1),"number"==typeof this.show?(this.$emit("dismiss-count-down",0),this.$emit("input",0)):this.$emit("input",!1)},clearCounter:function(){this.countDownTimerId&&(clearInterval(this.countDownTimerId),this.countDownTimerId=null)},showChanged:function(){var t=this;if(this.clearCounter(),this.dismissed=!1,!0!==this.show&&!1!==this.show&&null!==this.show&&0!==this.show){var e=this.show;this.countDownTimerId=setInterval(function(){e<1?t.dismiss():(e--,t.$emit("dismiss-count-down",e),t.$emit("input",e))},1e3)}}}},props={tag:{type:String,default:"span"},variant:{type:String,default:"secondary"},pill:{type:Boolean,default:!1}},badge={functional:!0,props:props,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"badge",class:[n.variant?"badge-"+n.variant:"badge-secondary",{"badge-pill":Boolean(n.pill)}]}),r)}},props$4=propsFactory(),bLink={functional:!0,props:propsFactory(),render:function(t,e){var n=e.props,i=e.data,r=e.parent,o=e.children,s=computeTag(n),a=computeRel(n),l=computeHref(n),u="router-link"===s?"nativeOn":"on",d=(i[u]||{}).click,c={click:clickHandlerFactory({tag:s,href:l,disabled:n.disabled,suppliedHandler:d,parent:r})},p=lib_common(i,{class:[n.active?n.exact?n.exactActiveClass:n.activeClass:null,{disabled:n.disabled}],attrs:{rel:a,href:l,target:n.target,"aria-disabled":"a"===s?n.disabled?"true":"false":null},props:assign(n,{tag:n.routerTag})});return p[u]=assign(p[u]||{},c),t(s,p,o)}},props$3=assign(propsFactory(),{text:{type:String,default:null},active:{type:Boolean,default:!1},href:{type:String,default:"#"},ariaCurrent:{type:String,default:"location"}}),BreadcrumbLink={functional:!0,props:props$3,render:function(t,e){var n=e.props,i=e.data,r=e.children,o=n.active?"span":bLink,s={props:pluckProps(props$3,n),domProps:{innerHTML:n.text}};return n.active?s.attrs={"aria-current":n.ariaCurrent}:s.attrs={href:n.href},t(o,lib_common(i,s),r)}},props$2=assign({},props$3,{text:{type:String,default:null},href:{type:String,default:null}}),BreadcrumbItem={functional:!0,props:props$2,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t("li",lib_common(i,{staticClass:"breadcrumb-item",class:{active:n.active},attrs:{role:"presentation"}}),[t(BreadcrumbLink,{props:n},r)])}},props$1={items:{type:Array,default:null}},breadcrumb={functional:!0,props:props$1,render:function(t,e){var n=e.props,i=e.data,r=e.children;if(isArray(n.items)){var o=!1;r=n.items.map(function(e,i){"object"!=typeof e&&(e={text:e});var r=e.active;return r&&(o=!0),r||o||(r=i+1===n.items.length),t(BreadcrumbItem,{props:assign({},e,{active:r})})})}return t("ol",lib_common(i,{staticClass:"breadcrumb"}),r)}},btnProps={block:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},size:{type:String,default:null,validator:function(t){return arrayIncludes(["sm","","lg"],t)}},variant:{type:String,default:null},type:{type:String,default:"button"},pressed:{type:Boolean,default:null}},linkProps=propsFactory();delete linkProps.href.default,delete linkProps.to.default;for(var linkPropKeys=keys(linkProps),props$5=assign(linkProps,btnProps),bBtn={functional:!0,props:props$5,render:function(t,e){var n=e.props,i=e.data,r=e.listeners,o=e.children,s=Boolean(n.href||n.to),a="boolean"==typeof n.pressed,l={click:function(t){n.disabled&&t instanceof Event?(t.stopPropagation(),t.preventDefault()):a&&concat(r["update:pressed"]).forEach(function(t){"function"==typeof t&&t(!n.pressed)})}};a&&(l.focusin=handleFocus,l.focusout=handleFocus);var u,d={staticClass:"btn",class:[n.variant?"btn-"+n.variant:"btn-secondary",(u={"btn-block":n.block,disabled:n.disabled,active:n.pressed},u["btn-"+n.size]=Boolean(n.size),u)],props:s?pluckProps(linkPropKeys,n):null,attrs:{type:s?null:n.type,disabled:s?null:n.disabled,"data-toggle":a?"button":null,"aria-pressed":a?String(n.pressed):null,tabindex:n.disabled&&s?"-1":null},on:l};return t(s?bLink:"button",lib_common(i,d),o)}},ITEM_SELECTOR=[".btn:not(.disabled):not([disabled])",".form-control:not(.disabled):not([disabled])","select:not(.disabled):not([disabled])",'input[type="checkbox"]:not(.disabled)','input[type="radio"]:not(.disabled)'].join(","),buttonToolbar={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{class:t.classObject,attrs:{role:"toolbar",tabindex:t.keyNav?"0":null},on:{focusin:function(e){if(e.target!==e.currentTarget)return null;t.focusFirst(e)},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"left",37)?"button"in e&&0!==e.button?null:void t.focusNext(e,!0):null},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;t.focusNext(e,!0)},function(e){return"button"in e||!t._k(e.keyCode,"right",39)?"button"in e&&2!==e.button?null:void t.focusNext(e,!1):null},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;t.focusNext(e,!1)},function(e){return("button"in e||!t._k(e.keyCode,"left",37))&&e.shiftKey?"button"in e&&0!==e.button?null:void t.focusFirst(e):null},function(e){return("button"in e||!t._k(e.keyCode,"up",38))&&e.shiftKey?void t.focusFirst(e):null},function(e){return("button"in e||!t._k(e.keyCode,"right",39))&&e.shiftKey?"button"in e&&2!==e.button?null:void t.focusLast(e):null},function(e){return("button"in e||!t._k(e.keyCode,"down",40))&&e.shiftKey?void t.focusLast(e):null}]}},[t._t("default")],2)},staticRenderFns:[],computed:{classObject:function(){return["btn-toolbar",this.justify&&!this.vertical?"justify-content-between":""]}},props:{justify:{type:Boolean,default:!1},keyNav:{type:Boolean,default:!1}},methods:{setItemFocus:function(t){this.$nextTick(function(){t.focus()})},focusNext:function(t,e){if(this.keyNav){t.preventDefault(),t.stopPropagation();var n=this.getItems();if(!(n.length<1)){var i=n.indexOf(t.target);e&&i>0?i--:!e&&i<n.length-1&&i++,i<0&&(i=0),this.setItemFocus(n[i])}}},focusFirst:function(t){if(this.keyNav){t.preventDefault(),t.stopPropagation();var e=this.getItems();e.length>0&&this.setItemFocus(e[0])}},focusLast:function(t){if(this.keyNav){t.preventDefault(),t.stopPropagation();var e=this.getItems();e.length>0&&this.setItemFocus([e.length-1])}},getItems:function(){var t=from(this.$el.querySelectorAll(ITEM_SELECTOR));return t.forEach(function(t){t.tabIndex=-1}),t.filter(function(t){return isVisible(t)})}},mounted:function(){this.keyNav&&this.getItems()}},props$6={vertical:{type:Boolean,default:!1},size:{type:String,default:null,validator:function(t){return arrayIncludes(["sm","","lg"],t)}},tag:{type:String,default:"div"},ariaRole:{type:String,default:"group"}},buttonGroup={functional:!0,props:props$6,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"btn-group",class:(o={"btn-group-vertical":n.vertical},o["btn-group-"+n.size]=Boolean(n.size),o),attrs:{role:n.ariaRole}}),r);var o}},props$7={id:{type:String,default:null},tag:{type:String,default:"div"}},bInputGroupAddon={functional:!0,props:props$7,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"input-group-addon",attrs:{id:n.id}}),r)}},inputGroup={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n(t.tag,{tag:"component",class:t.classObject,attrs:{id:t.id||null,role:"group"}},[t._t("left",[t.left?n("b-input-group-addon",{attrs:{id:t.id?t.id+"_BV_addon_left_":null},domProps:{innerHTML:t._s(t.left)}}):t._e()]),t._t("default"),t._t("right",[t.right?n("b-input-group-addon",{attrs:{id:t.id?t.id+"_BV_addon_right_":null},domProps:{innerHTML:t._s(t.right)}}):t._e()])],2)},staticRenderFns:[],components:{bInputGroupAddon:bInputGroupAddon},computed:{classObject:function(){return["input-group",this.size?"input-group-"+this.size:"",this.state?"has-"+this.state:""]}},props:{id:{type:String,defualt:null},size:{type:String,default:null},state:{type:String,default:null},left:{type:String,default:null},right:{type:String,default:null},tag:{type:String,default:"div"}}},props$8={id:{type:String,default:null},tag:{type:String,default:"div"}},inputGroupButton={functional:!0,props:props$8,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"input-group-btn",attrs:{id:n.id}}),r)}},cardMixin={props:{tag:{type:String,default:"div"},bgVariant:{type:String,default:null},borderVariant:{type:String,default:null},textVariant:{type:String,default:null}}},clickoutMixin={mounted:function(){"undefined"!=typeof document&&document.documentElement.addEventListener("click",this._clickOutListener)},destroyed:function(){"undefined"!=typeof document&&document.removeEventListener("click",this._clickOutListener)},methods:{_clickOutListener:function(t){this.$el.contains(t.target)||this.clickOutListener&&this.clickOutListener()}}},nativeHints=["native code","[object MutationObserverConstructor]"],isNative=function(t){return nativeHints.some(function(e){return(t||"").toString().indexOf(e)>-1})},isBrowser="undefined"!=typeof window,longerTimeoutBrowsers=["Edge","Trident","Firefox"],timeoutDuration=0,i=0;i<longerTimeoutBrowsers.length;i+=1)if(isBrowser&&navigator.userAgent.indexOf(longerTimeoutBrowsers[i])>=0){timeoutDuration=1;break}var supportsNativeMutationObserver=isBrowser&&isNative(window.MutationObserver),debounce=supportsNativeMutationObserver?microtaskDebounce:taskDebounce,isIE10=void 0,isIE10$1=function(){return void 0===isIE10&&(isIE10=-1!==navigator.appVersion.indexOf("MSIE 10")),isIE10},classCallCheck=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),defineProperty$1=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},_extends=Object.assign||function(t){for(var e=arguments,n=1;n<arguments.length;n++){var i=e[n];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t},placements=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],validPlacements=placements.slice(3),BEHAVIORS={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"},modifiers={shift:{order:100,enabled:!0,fn:shift},offset:{order:200,enabled:!0,fn:offset,offset:0},preventOverflow:{order:300,enabled:!0,fn:preventOverflow,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:keepTogether},arrow:{order:500,enabled:!0,fn:arrow,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:flip,behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:inner},hide:{order:800,enabled:!0,fn:hide},computeStyle:{order:850,enabled:!0,fn:computeStyle,gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:applyStyle,onLoad:applyStyleOnLoad,gpuAcceleration:void 0}},Defaults={placement:"bottom",eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:modifiers},Popper=function(){function t(e,n){var i=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};classCallCheck(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=debounce(this.update.bind(this)),this.options=_extends({},t.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e.jquery?e[0]:e,this.popper=n.jquery?n[0]:n,this.options.modifiers={},Object.keys(_extends({},t.Defaults.modifiers,r.modifiers)).forEach(function(e){i.options.modifiers[e]=_extends({},t.Defaults.modifiers[e]||{},r.modifiers?r.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(t){return _extends({name:t},i.options.modifiers[t])}).sort(function(t,e){return t.order-e.order}),this.modifiers.forEach(function(t){t.enabled&&isFunction(t.onLoad)&&t.onLoad(i.reference,i.popper,i.options,t,i.state)}),this.update();var o=this.options.eventsEnabled;o&&this.enableEventListeners(),this.state.eventsEnabled=o}return createClass(t,[{key:"update",value:function(){return update.call(this)}},{key:"destroy",value:function(){return destroy.call(this)}},{key:"enableEventListeners",value:function(){return enableEventListeners.call(this)}},{key:"disableEventListeners",value:function(){return disableEventListeners.call(this)}}]),t}();Popper.Utils=("undefined"!=typeof window?window:global).PopperUtils,Popper.placements=placements,Popper.Defaults=Defaults;var BVRL="__BV_root_listeners__",listenOnRootMixin={methods:{listenOnRoot:function(t,e){return this[BVRL]&&isArray(this[BVRL])||(this[BVRL]=[]),this[BVRL].push({event:t,callback:e}),this.$root.$on(t,e),this},emitOnRoot:function(t){for(var e=[],n=arguments.length-1;n-- >0;)e[n]=arguments[n+1];return(i=this.$root).$emit.apply(i,[t].concat(e)),this;var i}},destroyed:function(){var t=this;if(this[BVRL]&&isArray(this[BVRL]))for(;this[BVRL].length>0;){var e=t[BVRL].shift(),n=e.event,i=e.callback;t.$root.$off(n,i)}}},this$1=void 0;"undefined"!=typeof document&&window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(t){var e,n=(this.document||this.ownerDocument).querySelectorAll(t),i=this;do{for(e=n.length;--e>=0&&n.item(e)!==i;);}while(e<0&&(i=i.parentElement));return i});var ITEM_SELECTOR$1=".dropdown-item:not(.disabled):not([disabled])",AttachmentMap={TOP:"top-start",TOPEND:"top-end",BOTTOM:"bottom-start",BOTTOMEND:"bottom-end"},dropdownMixin={mixins:[clickoutMixin,listenOnRootMixin],props:{disabled:{type:Boolean,default:!1},text:{type:String,default:""},dropup:{type:Boolean,default:!1},right:{type:Boolean,default:!1},offset:{type:[Number,String],default:0},noFlip:{type:Boolean,default:!1},popperOpts:{type:Object,default:function(){}}},data:function(){return{visible:!1,_popper:null,inNavbar:null}},created:function(){var t=this,e=function(e){e!==t&&(t.visible=!1)};this.listenOnRoot("shown::dropdown",e),this.listenOnRoot("clicked::link",e)},watch:{visible:function(t,e){t!==e&&(t?this.showMenu():this.hideMenu())}},computed:{toggler:function(){return this$1.$refs.toggle.$el||this$1.$refs.toggle}},destroyed:function(){this._popper&&this._popper.destroy(),this._popper=null,this.setTouchStart(!1)},methods:{showMenu:function(){if(!this.disabled){if(this.$emit("show"),this.emitOnRoot("shown::dropdown",this),"function"==typeof Popper){null===this.inNavbar&&this.isNav&&(this.inNavbar=Boolean(this.$el.closest(".navbar")));var t=this.dropup&&this.right||this.split||this.inNavbar?this.$el:this.$refs.toggle;t=t.$el||t,this._popper=new Popper(t,this.$refs.menu,this.getPopperConfig())}this.setTouchStart(!0),this.$emit("shown"),this.$nextTick(this.focusFirstItem)}},hideMenu:function(){this.$emit("hide"),this.emitOnRoot("hidden::dropdown",this),this._popper&&this._popper.destroy(),this._popper=null,this.setTouchStart(!1),this.$emit("hidden")},getPopperConfig:function(){var t=AttachmentMap.BOTTOM;this.dropup&&this.right?t=AttachmentMap.TOPEND:this.dropup?t=AttachmentMap.TOP:this.right&&(t=AttachmentMap.BOTTOMEND);var e={placement:t,modifiers:{offset:{offset:this.offset||0},flip:{enabled:!this.noFlip},applyStyle:{enabled:!this.inNavbar}}};return assign(e,this.popperOpts||{})},setTouchStart:function(t){var e=this;"ontouchstart"in document.documentElement&&from(document.body.children).forEach(function(n){t?n.addEventListener("mouseover",e.noop):n.removeEventListener("mouseover",e.noop)})},noop:function(){},clickOutListener:function(){this.visible=!1},click:function(t){this.disabled?this.visible=!1:this.$emit("click",t)},toggle:function(){this.disabled?this.visible=!1:this.visible=!this.visible},onTab:function(){this.visible&&(this.visible=!1)},onEsc:function(t){this.visible&&(this.visible=!1,t.preventDefault(),t.stopPropagation(),this.$nextTick(this.focusToggler))},onFocusOut:function(t){this.$refs.menu.contains(t.relatedTarget)||(this.visible=!1)},onMouseOver:function(t){var e=t.target;e.classList.contains("dropdown-item")&&!e.disabled&&!e.classList.contains("disabled")&&e.focus&&e.focus()},focusNext:function(t,e){var n=this;this.visible&&(t.preventDefault(),t.stopPropagation(),this.$nextTick(function(){var i=n.getItems();if(!(i.length<1)){var r=i.indexOf(t.target);e&&r>0?r--:!e&&r<i.length-1&&r++,r<0&&(r=0),n.focusItem(r,i)}}))},focusItem:function(t,e){var n=e.find(function(e,n){return n===t});n&&"-1"!==n.getAttribute("tabindex")&&n.focus()},getItems:function(){return filterVisible(from(this.$refs.menu.querySelectorAll(ITEM_SELECTOR$1)))},getFirstItem:function(){return this.getItems()[0]||null},focusFirstItem:function(){var t=this.getFirstItem();t&&this.focusItem(0,[t])},focusToggler:function(){var t=this.toggler;t&&t.focus&&t.focus()}}},formMixin={props:{name:{type:String},id:{type:String},disabled:{type:Boolean},required:{type:Boolean,default:!1}}},formCheckBoxMixin={computed:{checkboxClass:function(){return{"custom-control":this.custom,"form-check-inline":this.inline}}}},formCustomMixin={computed:{custom:function(){return!this.plain}},props:{plain:{type:Boolean,default:!1}}},formOptionsMixin={computed:{formOptions:function(){var t=this,e=this.options||{};return e=isArray(e)?e.map(function(e){return"object"==typeof e?{value:e[t.valueField],text:e[t.textField],disabled:e.disabled||!1}:{text:String(e),value:e||{}}}):keys(e).map(function(n){var i=e[n]||{};return"object"!=typeof i&&(i={text:String(i)}),i.value=i[t.valueField]||n,i.text=i[t.textField]||n,i})},selectedValue:function(){var t=this,e=this.formOptions;if(this.returnObject&&!this.multiple){for(var n=0;n<e.length;n++)if(e[n].value===t.localValue)return e[n];return null}return this.localValue}},props:{valueField:{type:String,default:"value"},textField:{type:String,default:"text"}},watch:{localValue:function(t,e){t!==e&&this.$emit("input",this.selectedValue)},value:function(t,e){t!==e&&(this.localValue=t)}}},formSizeMixin={props:{size:{type:String,default:null}},computed:{sizeFormClass:function(){return[this.size?"form-control-"+this.size:null]},sizeBtnClass:function(){return[this.size?"btn-"+this.size:null]}}},formStateMixin={props:{state:{type:[Boolean,String],default:null}},computed:{computedState:function(){var t=this.state;return!0===t||"valid"===t||!1!==t&&"invalid"!==t&&null},stateClass:function(){var t=this.computedState;return!0===t?"is-valid":!1===t?"is-invalid":null}}},idMixin={props:{id:{typ:String,default:null}},data:function(){return{localId_:null}},mounted:function(){this.$isServer||this.id||!this._uid||(this.localId_="__BVID__"+this._uid+"_")},methods:{safeId:function(t){void 0===t&&(t="");var e=this.id||this.localId_||null;return e?(t=String(t).replace(/\s+/g,"_"),Boolean(t)?e+"_"+t:e):null}}},props$10=propsFactory(),props$11=assign({},copyProps(cardMixin.props,prefixPropName.bind(null,"body")),{title:{type:String,default:null},titleTag:{type:String,default:"h4"},subTitle:{type:String,default:null},subTitleTag:{type:String,default:"h6"},overlay:{type:Boolean,default:!1}}),CardBody={functional:!0,props:props$11,render:function(t,e){var n=e.props,i=e.data,r=e.slots,o=[];return n.title&&o.push(t(n.titleTag,{staticClass:"card-title",domProps:{innerHTML:n.title}})),n.subTitle&&o.push(t(n.subTitleTag,{staticClass:"card-subtitle mb-2 text-muted",domProps:{innerHTML:n.subTitle}})),o.push(r().default),t(n.bodyTag,lib_common(i,{staticClass:"card-body",class:(s={"card-img-overlay":n.overlay},s["bg-"+n.bodyBgVariant]=Boolean(n.bodyBgVariant),s["border-"+n.bodyBorderVariant]=Boolean(n.bodyBorderVariant),s["text-"+n.bodyTextVariant]=Boolean(n.bodyTextVariant),s)}),o);var s}},props$12=assign({},copyProps(cardMixin.props,prefixPropName.bind(null,"header")),{header:{type:String,default:null},headerClass:{type:[String,Object,Array],default:null}}),CardHeader={functional:!0,props:props$12,render:function(t,e){var n=e.props,i=e.data,r=e.slots;return t(n.headerTag,lib_common(i,{staticClass:"card-header",class:[n.headerClass,(o={},o["bg-"+n.headerBgVariant]=Boolean(n.headerBgVariant),o["border-"+n.headerBorderVariant]=Boolean(n.headerBorderVariant),o["text-"+n.headerTextVariant]=Boolean(n.headerTextVariant),o)]}),r().default||[t("div",{domProps:{innerHTML:n.header}})]);var o}},props$13=assign({},copyProps(cardMixin.props,prefixPropName.bind(null,"footer")),{footer:{type:String,default:null},footerClass:{type:[String,Object,Array],default:null}}),CardFooter={functional:!0,props:props$13,render:function(t,e){var n=e.props,i=e.data,r=e.slots;return t(n.footerTag,lib_common(i,{staticClass:"card-footer",class:[n.footerClass,(o={},o["bg-"+n.footerBgVariant]=Boolean(n.footerBgVariant),o["border-"+n.footerBorderVariant]=Boolean(n.footerBorderVariant),o["text-"+n.footerTextVariant]=Boolean(n.footerTextVariant),o)]}),r().default||[t("div",{domProps:{innerHTML:n.footer}})]);var o}},props$14={src:{type:String,default:null,required:!0},alt:{type:String,default:null},top:{type:Boolean,default:!1},bottom:{type:Boolean,default:!1},fluid:{type:Boolean,default:!1}},CardImg={functional:!0,props:props$14,render:function(t,e){var n=e.props,i=e.data,r="card-img";return n.top?r+="-top":n.bottom&&(r+="-bottom"),t("img",lib_common(i,{staticClass:r,class:{"img-fluid":n.fluid},attrs:{src:n.src,alt:n.alt}}))}},cardImgProps=copyProps(props$14,prefixPropName.bind(null,"img"));cardImgProps.imgSrc.required=!1;var props$9=assign({},props$11,props$12,props$13,cardImgProps,copyProps(cardMixin.props),{align:{type:String,default:null},noBody:{type:Boolean,default:!1}}),card={functional:!0,props:props$9,render:function(t,e){var n=e.props,i=e.data,r=e.slots,o=[],s=n.imgSrc?t(CardImg,{props:pluckProps(cardImgProps,n,unPrefixPropName.bind(null,"img"))}):null;return s&&(!n.imgTop&&n.imgBottom||o.push(s)),(n.header||r().header)&&o.push(t(CardHeader,{props:pluckProps(props$12,n)},r().header)),n.noBody?o.push(r().default):o.push(t(CardBody,{props:pluckProps(props$11,n)},r().default)),(n.footer||r().footer)&&o.push(t(CardFooter,{props:pluckProps(props$13,n)},r().footer)),s&&n.imgBottom&&o.push(s),t(n.tag,lib_common(i,{staticClass:"card",class:(a={},a["text-"+n.align]=Boolean(n.align),a["bg-"+n.bgVariant]=Boolean(n.bgVariant),a["border-"+n.borderVariant]=Boolean(n.borderVariant),a["text-"+n.textVariant]=Boolean(n.textVariant),a)}),o);var a}},props$15={tag:{type:String,default:"div"},deck:{type:Boolean,default:!1},columns:{type:Boolean,default:!1}},cardGroup={functional:!0,props:props$15,render:function(t,e){var n=e.props,i=e.data,r=e.children,o="card-group";return n.columns&&(o="card-columns"),n.deck&&(o="card-deck"),t(n.tag,lib_common(i,{staticClass:o}),r)}},DIRECTION={next:{dirClass:"carousel-item-left",overlayClass:"carousel-item-next"},prev:{dirClass:"carousel-item-right",overlayClass:"carousel-item-prev"}},TRANS_DURATION=650,TransitionEndEvents={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend oTransitionEnd",transition:"transitionend"},carousel={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"carousel slide",style:{background:t.background},attrs:{role:"region",id:t.safeId(),"aria-busy":t.isSliding?"true":"false"},on:{mouseenter:t.pause,mouseleave:t.start,focusin:t.pause,focusout:t.restart,keydown:[function(e){return"button"in e||!t._k(e.keyCode,"left",37)?"button"in e&&0!==e.button?null:(e.stopPropagation(),e.preventDefault(),void t.prev(e)):null},function(e){return"button"in e||!t._k(e.keyCode,"right",39)?"button"in e&&2!==e.button?null:(e.stopPropagation(),e.preventDefault(),void t.next(e)):null}]}},[n("div",{ref:"inner",staticClass:"carousel-inner",attrs:{role:"list",id:t.safeId("__BV_inner_")}},[t._t("default")],2),t.controls?[n("a",{staticClass:"carousel-control-prev",attrs:{href:"#",role:"button","aria-controls":t.safeId("__BV_inner_")},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.prev(e)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.stopPropagation(),e.preventDefault(),t.prev(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.stopPropagation(),e.preventDefault(),t.prev(e)}]}},[n("span",{staticClass:"carousel-control-prev-icon",attrs:{"aria-hidden":"true"}}),t._v(" "),n("span",{staticClass:"sr-only"},[t._v(t._s(t.labelPrev))])]),n("a",{staticClass:"carousel-control-next",attrs:{href:"#",role:"button","aria-controls":t.safeId("__BV_inner_")},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.next(e)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.stopPropagation(),e.preventDefault(),t.next(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.stopPropagation(),e.preventDefault(),t.next(e)}]}},[n("span",{staticClass:"carousel-control-next-icon",attrs:{"aria-hidden":"true"}}),t._v(" "),n("span",{staticClass:"sr-only"},[t._v(t._s(t.labelNext))])])]:t._e(),n("ol",{directives:[{name:"show",rawName:"v-show",value:t.indicators,expression:"indicators"}],staticClass:"carousel-indicators",attrs:{role:"group",id:t.indicators?t.safeId("__BV_indicators_"):null,"aria-hidden":t.indicators?"false":"true","aria-label":t.indicators&&t.labelIndicators?t.labelIndicators:null,"aria-owns":t.indicators?t.safeId("__BV_inner_"):null}},t._l(t.slides.length,function(e){return n("li",{key:"slide_"+e,class:{active:e-1===t.index},attrs:{role:"button",id:t.safeId("__BV_indicator_"+e+"_"),tabindex:t.indicators?"0":"-1","aria-current":e-1===t.index?"true":"false","aria-label":t.labelGotoSlide+" "+e,"aria-describedby":t.slides[e-1].id||null,"aria-controls":t.safeId("__BV_inner_")},on:{click:function(n){t.setSlide(e-1)},keydown:[function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13))return null;n.stopPropagation(),n.preventDefault(),t.setSlide(e-1)},function(n){if(!("button"in n)&&t._k(n.keyCode,"space",32))return null;n.stopPropagation(),n.preventDefault(),t.setSlide(e-1)}]}})}))],2)},staticRenderFns:[],mixins:[idMixin],data:function(){return{index:this.value||0,isSliding:!1,intervalId:null,transitionEndEvent:null,slides:[]}},props:{labelPrev:{type:String,default:"Previous Slide"},labelNext:{type:String,default:"Next Slide"},labelGotoSlide:{type:String,default:"Goto Slide"},labelIndicators:{type:String,default:"Select a slide to display"},interval:{type:Number,default:5e3},indicators:{type:Boolean,default:!1},controls:{type:Boolean,default:!1},imgWidth:{type:[Number,String]},imgHeight:{type:[Number,String]},background:{type:String},value:{type:Number,default:0}},computed:{isCycling:function(){return Boolean(this.intervalId)}},methods:{setSlide:function(t){var e=this;if("undefined"==typeof document||!document.visibilityState||!document.hidden){var n=this.slides.length;0!==n&&(this.isSliding?this.$once("sliding-end",function(){return e.setSlide(t)}):(t=Math.floor(t),this.index=t>=n?0:t>=0?t:n-1))}},prev:function(){this.setSlide(this.index-1)},next:function(){this.setSlide(this.index+1)},pause:function(){this.isCycling&&(clearInterval(this.intervalId),this.intervalId=null,this.slides[this.index].tabIndex=0)},start:function(){var t=this;Boolean(this.interval)&&!this.isCycling&&(this.slides.forEach(function(t){t.tabIndex=-1}),this.intervalId=setInterval(function(){t.next()},Math.max(1e3,this.interval)))},restart:function(t){t.relatedTarget&&this.$el.contains(t.relatedTarget)||this.start()},updateSlides:function(){var t=this;this.pause(),this.slides=from(this.$refs.inner.querySelectorAll(".carousel-item"));var e=this.slides.length,n=Math.max(0,Math.min(Math.floor(this.index),e-1));this.slides.forEach(function(i,r){var o=r+1,s=t.safeId("__BV_indicator_"+o+"_");i.classList[r===n?"add":"remove"]("active"),i.setAttribute("aria-current",r===n?"true":"false"),i.setAttribute("aria-posinset",String(o)),i.setAttribute("aria-setsize",String(e)),i.tabIndex=-1,s&&i.setAttribute("aria-controlledby",s)}),this.setSlide(n),this.start()}},watch:{value:function(t,e){t!==e&&this.setSlide(t)},interval:function(t,e){t!==e&&(Boolean(t)?(this.pause(),this.start()):this.pause())},index:function(t,e){var n=this;if(t!==e&&!this.isSliding){var i=t>e?DIRECTION.next:DIRECTION.prev;0===e&&t===this.slides.length-1?i=DIRECTION.prev:e===this.slides.length-1&&0===t&&(i=DIRECTION.next);var r=this.slides[e],o=this.slides[t];if(r&&o){this.isSliding=!0,this.$emit("sliding-start",t),this.$emit("input",this.index),o.classList.add(i.overlayClass),r.classList.add(i.dirClass),o.classList.add(i.dirClass);var s=!1,a=function(e){s||(s=!0,n.transitionEndEvent&&n.transitionEndEvent.split(/\s+/).forEach(function(t){r.removeEventListener(t,a)}),n._animationTimeout=null,o.classList.remove(i.dirClass),o.classList.remove(i.overlayClass),o.classList.add("active"),r.classList.remove("active"),r.classList.remove(i.dirClass),r.classList.remove(i.overlayClass),r.setAttribute("aria-current","false"),o.setAttribute("aria-current","true"),r.setAttribute("aria-hidden","true"),o.setAttribute("aria-hidden","false"),r.tabIndex=-1,o.tabIndex=-1,n.isCycling||(o.tabIndex=0,n.$nextTick(function(){o.focus()})),n.isSliding=!1,n.$nextTick(function(){return n.$emit("sliding-end",t)}))};this.transitionEndEvent&&this.transitionEndEvent.split(/\s+/).forEach(function(t){r.addEventListener(t,a)}),this._animationTimeout=setTimeout(a,TRANS_DURATION)}}}},created:function(){this._animationTimeout=null},mounted:function(){this.transitionEndEvent=getTransisionEndEvent(this.$el)||null,this.updateSlides(),observeDOM(this.$refs.inner,this.updateSlides.bind(this),{subtree:!1,childList:!0,attributes:!0,attributeFilter:["id"]})},destroyed:function(){clearInterval(this.intervalId),clearTimeout(this._animationTimeout),this._animationTimeout=null}},BLANK_TEMPLATE='<svg width="%{w}" height="%{h}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %{w} %{h}" preserveAspectRatio="none"><rect width="100%" height="100%" style="fill:%{f};"></rect></svg>',props$16={src:{type:String,default:null},alt:{type:String,default:null},width:{type:[Number,String],default:null},height:{type:[Number,String],default:null},block:{type:Boolean,default:!1},fluid:{type:Boolean,default:!1},fluidGrow:{type:Boolean,default:!1},rounded:{type:[Boolean,String],default:!1},thumbnail:{type:Boolean,default:!1},left:{type:Boolean,default:!1},right:{type:Boolean,default:!1},center:{type:Boolean,default:!1},blank:{type:Boolean,default:!1},blankColor:{type:String,default:"transparent"}},bImg={functional:!0,props:props$16,render:function(t,e){var n=e.props,i=e.data,r=n.src,o=Boolean(parseInt(n.width,10))?parseInt(n.width,10):null,s=Boolean(parseInt(n.height,10))?parseInt(n.height,10):null,a=null,l=n.block;return n.blank&&(!s&&Boolean(o)?s=o:!o&&Boolean(s)&&(o=s),o||s||(o=1,s=1),r=makeBlankImgSrc(o,s,n.blankColor||"transparent")),n.left?a="float-left":n.right?a="float-right":n.center&&(a="mx-auto",l=!0),t("img",lib_common(i,{attrs:{src:r,alt:n.alt,width:o?String(o):null,height:s?String(s):null},class:(u={"img-thumbnail":n.thumbnail,"img-fluid":n.fluid||n.fluidGrow,"w-100":n.fluidGrow,rounded:""===n.rounded||!0===n.rounded,"d-block":l},u["rounded-"+n.rounded]="string"==typeof n.rounded&&""!==n.rounded,u[a]=Boolean(a),u)}));var u}},carouselSlide={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"carousel-item",style:{background:t.background},attrs:{role:"listitem",id:t.safeId()}},[t._t("img",[t.imgSrc||t.imgBlank?n("b-img",{attrs:{"fluid-grow":"",block:"",blank:t.imgBlank,"blank-color":t.imgBlankColor,src:t.imgSrc,width:t.computedWidth,height:t.computedHeight,alt:t.imgAlt}}):t._e()]),n(t.contentTag,{tag:"div",class:t.contentClasses},[t.caption?n(t.captionTag,{tag:"h3",domProps:{innerHTML:t._s(t.caption)}}):t._e(),t.text?n(t.textTag,{tag:"p",domProps:{innerHTML:t._s(t.text)}}):t._e(),t._t("default")],2)],2)},staticRenderFns:[],components:{bImg:bImg},mixins:[idMixin],props:{imgSrc:{type:String,default:function(){return this&&this.src?(warn("b-carousel-slide: prop 'src' has been deprecated. Use 'img-src' instead"),this.src):null}},src:{type:String},imgAlt:{type:String},imgWidth:{type:[Number,String]},imgHeight:{type:[Number,String]},imgBlank:{type:Boolean,default:!1},imgBlankColor:{type:String,default:"transparent"},contentVisibleUp:{type:String},contentTag:{type:String,default:"div"},caption:{type:String},captionTag:{type:String,default:"h3"},text:{type:String},textTag:{type:String,default:"p"},background:{type:String}},computed:{contentClasses:function(){return["carousel-caption",this.contentVisibleUp?"d-none":"",this.contentVisibleUp?"d-"+this.contentVisibleUp+"-block":""]},computedWidth:function(){return this.imgWidth||this.$parent.imgWidth},computedHeight:function(){return this.imgHeight||this.$parent.imgHeight}}},computeBkPtClass=memoize(function(t,e,n){var i=t;return e&&(i+="-"+e),!0===n?i.toLowerCase():(i+="-"+n).toLowerCase()}),BREAKPOINTS=["sm","md","lg","xl"],breakpointCol=BREAKPOINTS.reduce(function(t,e){return t[e]=boolStrNum(),t},create(null)),breakpointOffset=BREAKPOINTS.reduce(function(t,e){return t[suffixPropName(e,"offset")]=strNum(),t},create(null)),breakpointOrder=BREAKPOINTS.reduce(function(t,e){return t[suffixPropName(e,"order")]=strNum(),t},create(null)),breakpointPropMap=assign(create(null),{col:keys(breakpointCol),offset:keys(breakpointOffset),order:keys(breakpointOrder)}),props$17=assign({},breakpointCol,breakpointOffset,breakpointOrder,{tag:{type:String,default:"div"},col:{type:Boolean,default:!1},cols:strNum(),offset:strNum(),order:strNum(),alignSelf:{type:String,default:null,validator:function(t){return arrayIncludes(["auto","start","end","center","baseline","stretch"],t)}}}),col={functional:!0,props:props$17,render:function(t,e){var n=e.props,i=e.data,r=e.children,o=[];for(var s in breakpointPropMap)for(var a=breakpointPropMap[s],l=0;l<a.length;l++)n[a[l]]&&o.push(computeBkPtClass(s,a[l].replace(s,""),n[a[l]]));o.push((u={col:n.col||0===o.length&&!n.cols},u["col-"+n.cols]=n.cols,u["offset-"+n.offset]=n.offset,u["order-"+n.order]=n.order,u["align-self-"+n.alignSelf]=n.alignSelf,u));var u;return t(n.tag,lib_common(i,{class:o}),r)}},collapse={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{"enter-class":"","enter-active-class":"collapsing","enter-to-class":"","leave-class":"","leave-active-class":"collapsing","leave-to-class":""},on:{enter:t.onEnter,"after-enter":t.onAfterEnter,leave:t.onLeave,"after-leave":t.onAfterLeave}},[n(t.tag,{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],tag:"component",class:t.classObject,attrs:{id:t.id||null},on:{click:t.clickHandler}},[t._t("default")],2)],1)},staticRenderFns:[],mixins:[listenOnRootMixin],data:function(){return{show:this.visible,transitioning:!1}},model:{prop:"visible",event:"input"},props:{id:{type:String,required:!0},isNav:{type:Boolean,default:!1},accordion:{type:String,default:null},visible:{type:Boolean,default:!1},tag:{type:String,default:"div"}},watch:{visible:function(t){t!==this.show&&(this.show=t)},show:function(t,e){t!==e&&this.emitState()}},computed:{classObject:function(){return{"navbar-collapse":this.isNav,collapse:!this.transitioning,show:this.show&&!this.transitioning}}},methods:{toggle:function(){this.show=!this.show},onEnter:function(t){t.style.height=0,this.reflow(t),t.style.height=t.scrollHeight+"px",this.transitioning=!0,this.$emit("show")},onAfterEnter:function(t){t.style.height=null,this.transitioning=!1,this.$emit("shown")},onLeave:function(t){t.style.height="auto",t.style.display="block",t.style.height=t.getBoundingClientRect().height+"px",this.reflow(t),this.transitioning=!0,t.style.height=0,this.$emit("hide")},onAfterLeave:function(t){t.style.height=null,this.transitioning=!1,this.$emit("hidden")},reflow:function(t){t.offsetHeight},emitState:function(){this.$emit("input",this.show),this.$root.$emit("collapse::toggle::state",this.id,this.show),this.accordion&&this.show&&this.$root.$emit("accordion::toggle",this.id,this.accordion)},clickHandler:function(t){var e=t.target;this.isNav&&e&&"block"===getComputedStyle(this.$el).display&&(e.classList.contains("nav-link")||e.classList.contains("dropdown-item"))&&(this.show=!1)},handleToggleEvt:function(t){t===this.id&&this.toggle()},handleAccordionEvt:function(t,e){this.accordion&&e===this.accordion&&(t===this.id?this.show||this.toggle():this.show&&this.toggle())},handleResize:function(){this.show="block"===getComputedStyle(this.$el).display}},created:function(){this.listenOnRoot("collapse::toggle",this.handleToggleEvt),this.listenOnRoot("accordion::toggle",this.handleAccordionEvt)},mounted:function(){this.isNav&&"undefined"!=typeof document&&(window.addEventListener("resize",this.handleResize,!1),window.addEventListener("orientationchange",this.handleResize,!1),this.handleResize()),this.emitState()},destroyed:function(){this.isNav&&"undefined"!=typeof document&&(window.removeEventListener("resize",this.handleResize,!1),window.removeEventListener("orientationchange",this.handleResize,!1))}},props$18={tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},Container={functional:!0,props:props$18,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{class:{container:!n.fluid,"container-fluid":n.fluid}}),r)}},dropdown={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.dropdownClasses,attrs:{id:t.safeId()}},[t.split?n("b-button",{ref:"button",attrs:{id:t.safeId("_BV_button_"),"aria-haspopup":t.split?"true":null,"aria-expanded":t.split?t.visible?"true":"false":null,variant:t.variant,size:t.size,disabled:t.disabled},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.click(e)}}},[t._t("button-content",[t._t("text",[t._v(t._s(t.text))])])],2):t._e(),n("b-button",{ref:"toggle",class:["dropdown-toggle",{"dropdown-toggle-split":t.split}],attrs:{id:t.safeId("_BV_toggle_"),"aria-haspopup":t.split?null:"true","aria-expanded":t.split?null:t.visible?"true":"false",variant:t.variant,size:t.size,disabled:t.disabled},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.toggle(e)}}},[t.split?n("span",{staticClass:"sr-only"},[t._v(t._s(t.toggleText))]):t._t("button-content",[t._t("text",[t._v(t._s(t.text))])])],2),n("div",{ref:"menu",class:t.menuClasses,attrs:{role:t.role,"aria-labelledby":t.safeId(t.split?"_BV_toggle_":"_BV_button_")},on:{mouseover:t.onMouseOver,keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.onEsc(e)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"tab",9))return null;t.onTab(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;t.focusNext(e,!0)},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;t.focusNext(e,!1)}]}},[t._t("default")],2)],1)},staticRenderFns:[],mixins:[idMixin,dropdownMixin],components:{bButton:bBtn},props:{split:{type:Boolean,default:!1},toggleText:{type:String,default:"Toggle Dropdown"},size:{type:String,default:null},variant:{type:String,default:null},role:{type:String,default:"menu"}},computed:{dropdownClasses:function(){return["btn-group","b-dropdown","dropdown",this.dropup?"dropup":"",this.visible?"show":""]},menuClasses:function(){return["dropdown-menu",this.right?"dropdown-menu-right":"",this.visible?"show":""]}}},props$19=propsFactory(),dropdownItem={functional:!0,props:props$19,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(bLink,lib_common(i,{props:n,staticClass:"dropdown-item",attrs:{role:"menuitem"}}),r)}},props$20={disabled:{type:Boolean,default:!1}},dropdownItemButton={functional:!0,props:props$20,render:function(t,e){var n=e.props,i=e.data,r=e.parent,o=e.children;return t("button",lib_common(i,{props:n,staticClass:"dropdown-item",attrs:{role:"menuitem",type:"button",disabled:n.disabled},on:{click:function(t){r.$root.$emit("clicked::link",t)}}}),o)}},props$21={tag:{type:String,default:"div"}},dropdownDivider={functional:!0,props:props$21,render:function(t,e){var n=e.props,i=e.data;return t(n.tag,lib_common(i,{staticClass:"dropdown-divider",attrs:{role:"separator"}}))}},props$22={id:{type:String,default:null},tag:{type:String,default:"h6"}},dropdownHeader={functional:!0,props:props$22,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"dropdown-header",attrs:{id:n.id||null}}),r)}},props$23={id:{type:String,default:null},inline:{type:Boolean,default:!1},novalidate:{type:Boolean,default:!1},validated:{type:Boolean,default:!1}},Form={functional:!0,props:props$23,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t("form",lib_common(i,{class:{"form-inline":n.inline,"was-validated":n.validated},attrs:{id:n.id,novalidate:n.novalidate}}),r)}},props$24={tag:{type:String,default:"div"}},bFormRow={functional:!0,props:props$24,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"form-row"}),r)}},props$25={id:{type:String,default:null},tag:{type:String,default:"small"},textVariant:{type:String,default:"muted"},inline:{type:Boolean,default:!1}},bFormText={functional:!0,props:props$25,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{class:(o={"form-text":!Boolean(n.inline)},o["text-"+n.textVariant]=Boolean(n.textVariant),o),attrs:{id:n.id}}),r);var o}},props$26={id:{type:String,default:null},tag:{type:String,default:"div"}},bFormFeedback={functional:!0,props:props$26,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"invalid-feedback",attrs:{id:n.id}}),r)}},INPUT_SELECTOR=['[role="radiogroup"][id]',"input[id]","select[id]","textarea[id]",".form-control[id]",".form-control-plaintext[id]",".dropdown[id]",".dropup[id]"].join(","),formGroup={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-form-row",{class:t.groupClasses,attrs:{id:t.safeId(),role:"group","aria-describedby":t.describedByIds}},[t.label||t.$slots.label||t.horizontal?n("label",{class:t.labelClasses,attrs:{for:t.targetId,id:t.labelId}},[t._t("label",[n("span",{domProps:{innerHTML:t._s(t.label)}})])],2):t._e(),n("div",{ref:"content",class:t.inputLayoutClasses},[t._t("default"),n("b-form-feedback",{directives:[{name:"show",rawName:"v-show",value:t.feedback||t.$slots.feedback,expression:"feedback || $slots['feedback']"}],attrs:{id:t.feedbackId,role:"alert","aria-live":"assertive","aria-atomic":"true"}},[t._t("feedback",[n("span",{domProps:{innerHTML:t._s(t.feedback)}})])],2),t.description||t.$slots.description?n("b-form-text",{attrs:{id:t.descriptionId}},[t._t("description",[n("span",{domProps:{innerHTML:t._s(t.description)}})])],2):t._e()],2)])},staticRenderFns:[],mixins:[idMixin,formStateMixin],components:{bFormRow:bFormRow,bFormText:bFormText,bFormFeedback:bFormFeedback},data:function(){return{targetId:null}},props:{labelFor:{type:String,default:null},validated:{type:Boolean,value:!1},horizontal:{type:Boolean,default:!1},labelCols:{type:Number,default:3,validator:function(t){return t>=1&&t<=11||(warn("b-form-group: label-cols must be a value between 1 and 11"),!1)}},breakpoint:{type:String,default:"sm"},labelTextAlign:{type:String,default:null},label:{type:String,default:null},labelSrOnly:{type:Boolean,default:!1},description:{type:String,default:null},feedback:{type:String,default:null}},computed:{inputState:function(){return this.stateClass},groupClasses:function(){return["b-form-group","form-group",this.validated?"was-validated":null,this.inputState]},labelClasses:function(){return[this.labelSrOnly?"sr-only":"col-form-label",this.labelLayout,this.labelAlignClass]},labelLayout:function(){return this.labelSrOnly?null:this.horizontal?"col-"+this.breakpoint+"-"+this.labelCols:"col-12"},labelAlignClass:function(){return this.labelSrOnly?null:this.labelTextAlign?"text-"+this.labelTextAlign:null},inputLayoutClasses:function(){return[this.horizontal?"col-"+this.breakpoint+"-"+(12-this.labelCols):"col-12"]},labelId:function(){return this.label||this.$slots.label?this.safeId("_BV_label_"):null},descriptionId:function(){return this.description||this.$slots.description?this.safeId("_BV_description_"):null},feedbackId:function(){return this.feedback||this.$slots.feedback?this.safeId("_BV_feedback_"):null},describedByIds:function(){return this.id?[this.labelId,this.descriptionId,this.feedbackId].filter(function(t){return t}).join(" "):null}},methods:{updateTargetId:function(){if(this.labelFor)return this.labelFor;var t=this.$refs.content;if(!t)return null;var e=t.querySelector(INPUT_SELECTOR);this.targetId=e&&e.id?e.id:null}},mounted:function(){var t=this;this.$nextTick(function(){return t.updateTargetId()})},updated:function(){var t=this;this.$nextTick(function(){return t.updateTargetId()})}},formCheckbox={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("label",{class:t.button?t.btnLabelClasses:t.labelClasses,attrs:{"aria-pressed":t.button?t.isChecked?"true":"false":null}},[n("input",{ref:"check",class:t.checkClasses,attrs:{type:"checkbox",id:t.safeId(),name:t.name,disabled:t.disabled,required:t.required,autocomplete:"off","aria-required":t.required?"true":null},domProps:{value:t.value,checked:t.isChecked},on:{focus:t.handleFocus,blur:t.handleFocus,change:t.handleChange}}),t._v(" "),t.custom&&!t.button?n("span",{staticClass:"custom-control-indicator",attrs:{"aria-hidden":"true"}}):t._e(),t._v(" "),n("span",{class:t.custom&&!t.button?"custom-control-description":null},[t._t("default")],2)])},staticRenderFns:[],mixins:[idMixin,formMixin,formSizeMixin,formStateMixin,formCustomMixin,formCheckBoxMixin],model:{prop:"checked",event:"change"},props:{value:{default:!0},uncheckedValue:{default:!1},checked:{default:!0},indeterminate:{type:Boolean,default:!1},button:{type:Boolean,default:!1},buttonVariant:{type:String,default:"secondary"}},computed:{labelClasses:function(){return[this.sizeFormClass,this.custom?"custom-checkbox":"",this.checkboxClass]},btnLabelClasses:function(){return["btn","btn-"+this.buttonVariant,this.sizeBtnClass,this.isChecked?"active":"",this.disabled?"disabled":""]},checkClasses:function(){return[this.custom&&!this.button?"custom-control-input":null,this.stateClass]},isChecked:function(){return isArray(this.checked)?arrayIncludes(this.checked,this.value):this.checked===this.value}},watch:{indeterminate:function(t,e){this.setIndeterminate(t)}},methods:{handleChange:function(t){var e=this,n=t.target.checked;isArray(this.checked)?this.isChecked?this.$emit("change",this.checked.filter(function(t){return t!==e.value})):this.$emit("change",this.checked.concat([this.value])):this.$emit("change",n?this.value:this.uncheckedValue),this.$emit("update:indeterminate",this.$refs.check.indeterminate)},setIndeterminate:function(t){this.$refs.check.indeterminate=t,this.$emit("update:indeterminate",this.$refs.check.indeterminate)},handleFocus:function(t){if(this.button&&t.target&&t.target.parentElement){var e=t.target.parentElement;"focus"===t.type?e.classList.add("focus"):"blur"===t.type&&e.classList.remove("focus")}}},mounted:function(){this.setIndeterminate(this.indeterminate)}},formRadio={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.buttons?t.btnGroupClasses:t.radioGroupClasses,attrs:{id:t.safeId(),role:"radiogroup",tabindex:"-1","data-toggle":t.buttons?"buttons":null,"aria-required":t.required?"true":null,"aria-invalid":t.computedAriaInvalid}},t._l(t.formOptions,function(e,i){return n("label",{key:"radio_"+i,class:t.buttons?t.btnLabelClasses(e,i):t.labelClasses,attrs:{"aria-pressed":t.buttons?e.value===t.localValue?"true":"false":null}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.localValue,expression:"localValue"}],ref:"inputs",refInFor:!0,class:t.radioClasses,attrs:{id:t.safeId("_BV_radio_"+i),type:"radio",autocomplete:"off",name:t.name,required:t.name&&t.required,disabled:e.disabled||t.disabled},domProps:{value:e.value,checked:t._q(t.localValue,e.value)},on:{focus:t.handleFocus,blur:t.handleFocus,change:function(n){t.$emit("change",t.returnObject?e:e.value)},__c:function(n){t.localValue=e.value}}}),t._v(" "),t.custom&&!t.buttons?n("span",{staticClass:"custom-control-indicator",attrs:{"aria-hidden":"true"}}):t._e(),t._v(" "),n("span",{class:t.custom&&!t.buttons?"custom-control-description":null,domProps:{innerHTML:t._s(e.text)}})])}))},staticRenderFns:[],mixins:[idMixin,formMixin,formSizeMixin,formStateMixin,formCustomMixin,formCheckBoxMixin,formOptionsMixin],data:function(){return{localValue:this.value,localState:this.state}},props:{value:{},options:{type:[Array,Object],default:null,required:!0},validated:{type:Boolean,default:!1},ariaInvalid:{type:[Boolean,String],default:!1},stacked:{type:Boolean,default:!1},buttons:{type:Boolean,default:!1},buttonVariant:{type:String,default:"secondary"}},computed:{radioGroupClasses:function(){return[this.validated?"was-validated":"",this.sizeFormClass,this.stacked?"custom-controls-stacked":""]},btnGroupClasses:function(){return["btn-group",this.validated?"was-validated":"",this.sizeBtnClass,this.stacked?"btn-group-vertical":""]},radioClasses:function(){return[this.custom&&!this.buttons?"custom-control-input":null,this.stateClass]},labelClasses:function(){return[this.checkboxClass,this.custom?"custom-radio":null]},computedAriaInvalid:function(){return!0===this.ariaInvalid||"true"===this.AriaInvalid?"true":!1===this.computedState?"true":null},inline:function(){return!this.stacked}},methods:{btnLabelClasses:function(t,e){return["btn","btn-"+this.buttonVariant,t.disabled||this.disabled?"disabled":"",t.value===this.localValue?"active":null,this.stacked&&e===this.formOptions.length-1?"":"mb-0"]},handleFocus:function(t){if(this.buttons&&t.target&&t.target.parentElement){var e=t.target.parentElement;"focus"===t.type?e.classList.add("focus"):"blur"===t.type&&e.classList.remove("focus")}}}},formInput={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("input",{class:t.inputClass,attrs:{id:t.safeId(),name:t.name,type:t.localType,disabled:t.disabled,required:t.required,readonly:t.readonly||t.plaintext,placeholder:t.placeholder,autocomplete:t.autocomplete||null,"aria-required":t.required?"true":null,"aria-invalid":t.computedAriaInvalid},domProps:{value:t.localValue},on:{input:function(e){t.onInput(e.target.value,e)},change:function(e){t.onChange(e.target.value,e)}}})},staticRenderFns:[],mixins:[idMixin,formMixin,formSizeMixin,formStateMixin],data:function(){return{localValue:this.value}},props:{value:{default:null},type:{type:String,default:"text"},ariaInvalid:{type:[Boolean,String],default:!1},readonly:{type:Boolean,default:!1},plaintext:{type:Boolean,default:!1},autocomplete:{type:String,default:null},placeholder:{type:String,default:null},formatter:{type:Function},lazyFormatter:{type:Boolean,default:!1}},computed:{localType:function(){return"radio"===this.type||"checkbox"===this.type?"text":this.type||"text"},inputClass:function(){return[this.plaintext?"form-control-plaintext":"form-control",this.sizeFormClass,this.stateClass]},computedAriaInvalid:function(){return Boolean(this.ariaInvalid)&&"false"!==this.ariaInvalid?!0===this.ariaInvalid?"true":this.ariaInvalid:!1===this.computedState?"true":null}},watch:{value:function(t,e){t!==e&&(this.localValue=t)},localValue:function(t,e){t!==e&&this.$emit("input",t)}},methods:{format:function(t,e){if(this.formatter){var n=this.formatter(t,e);if(n!==t)return n}return t},onInput:function(t,e){this.lazyFormatter||(this.localValue=this.format(t,e))},onChange:function(t,e){this.localValue=this.format(t,e),this.$emit("change",this.localValue)},focus:function(){this.disabled||this.$el.focus()}}},formTextarea={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("textarea",{directives:[{name:"model",rawName:"v-model",value:t.localValue,expression:"localValue"}],class:t.inputClass,attrs:{id:t.safeId(),name:t.name,disabled:t.disabled,placeholder:t.placeholder,required:t.required,autocomplete:t.autocomplete||null,readonly:t.readonly||t.plaintext,rows:t.rowsCount,wrap:t.wrap||null,"aria-required":t.required?"true":null,"aria-invalid":t.computedAriaInvalid},domProps:{value:t.localValue},on:{input:function(e){e.target.composing||(t.localValue=e.target.value)}}})},staticRenderFns:[],mixins:[idMixin,formMixin,formSizeMixin,formStateMixin],data:function(){return{localValue:this.value}},props:{value:{type:String,default:""},ariaInvalid:{type:[Boolean,String],default:!1},readonly:{type:Boolean,default:!1},plaintext:{type:Boolean,default:!1},autocomplete:{type:String,default:null},placeholder:{type:String,default:null},rows:{type:Number,default:null},maxRows:{type:Number,default:null},wrap:{type:String,default:"soft"}},computed:{rowsCount:function(){var t=this.rows||1,e=(this.value||"").toString().split("\n").length;return this.maxRows?Math.min(this.maxRows,this.rows?t:e):Math.max(t,e)},inputClass:function(){return[this.plaintext?"form-control-plaintext":"form-control",this.sizeFormClass,this.stateClass]},computedAriaInvalid:function(){return Boolean(this.ariaInvalid)&&"false"!==this.ariaInvalid?!0===this.ariaInvalid?"true":this.ariaInvalid:!1===this.computedState?"true":null}},watch:{value:function(t,e){t!==e&&(this.localValue=t)},localValue:function(t,e){t!==e&&this.$emit("input",t)}},methods:{focus:function(){this.disabled||this.$el.focus()}}},formFile={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:[t.custom?"custom-file":null,t.state?"is-"+t.state:null],attrs:{id:t.safeId("_BV_file_outer_")},on:{dragover:function(e){e.stopPropagation(),e.preventDefault(),t.dragover(e)}}},[t.dragging&&t.custom?n("span",{staticClass:"drop-here",attrs:{"data-drop":t.dropLabel},on:{dragover:function(e){e.stopPropagation(),e.preventDefault(),t.dragover(e)},drop:function(e){e.stopPropagation(),e.preventDefault(),t.drop(e)},dragleave:function(e){e.stopPropagation(),e.preventDefault(),t.dragging=!1}}}):t._e(),n("input",{ref:"input",class:[t.custom?"custom-file-input":"form-control-file",t.stateClass],attrs:{type:"file",id:t.safeId(),name:t.name,disabled:t.disabled,required:t.required,capture:t.capture||null,"aria-required":t.required?"true":null,accept:t.accept||null,multiple:t.multiple,webkitdirectory:t.directory,"aria-describedby":t.custom?t.safeId("_BV_file_control_"):null},on:{change:t.onFileChange}}),t._v(" "),t.custom?n("span",{class:["custom-file-control",t.dragging?"dragging":null],attrs:{id:t.safeId("_BV_file_control_"),"data-choose":t.computedChooseLabel,"data-selected":t.selectedLabel}}):t._e()])},staticRenderFns:[],_scopeId:"data-v-c68bd5f8",mixins:[idMixin,formMixin,formStateMixin,formCustomMixin],data:function(){return{selectedFile:null,dragging:!1}},props:{accept:{type:String,default:""},capture:{type:Boolean,default:!1},placeholder:{type:String,default:null},chooseLabel:{type:String,default:null},multiple:{type:Boolean,default:!1},directory:{type:Boolean,default:!1},noTraverse:{type:Boolean,default:!1},selectedFormat:{type:String,default:":count Files"},noDrop:{type:Boolean,default:!1},dropLabel:{type:String,default:"Drop files here"}},computed:{selectedLabel:function(){return this.selectedFile&&0!==this.selectedFile.length?this.multiple?1===this.selectedFile.length?this.selectedFile[0].name:this.selectedFormat.replace(":names",this.selectedFile.map(function(t){return t.name}).join(",")).replace(":count",this.selectedFile.length):this.selectedFile.name:this.placeholder||"No file chosen"},computedChooseLabel:function(){return this.chooseLabel||(this.multiple?"Choose Files":"Choose File")}},watch:{selectedFile:function(t,e){t!==e&&(!t&&this.multiple?this.$emit("input",[]):this.$emit("input",t))}},methods:{reset:function(){try{this.$refs.input.value=""}catch(t){}this.$refs.input.type="",this.$refs.input.type="file",this.selectedFile=this.multiple?[]:null},onFileChange:function(t){var e=this;this.$emit("change",t);var n=t.dataTransfer&&t.dataTransfer.items;if(!n||this.noTraverse)this.setFiles(t.target.files||t.dataTransfer.files);else{for(var i=[],r=0;r<n.length;r++){var o=n[r].webkitGetAsEntry();o&&i.push(e.traverseFileTree(o))}Promise.all(i).then(function(t){e.setFiles(from(t))})}},setFiles:function(t){var e=this;if(t)if(this.multiple){for(var n=[],i=0;i<t.length;i++)t[i].type.match(e.accept)&&n.push(t[i]);this.selectedFile=n}else this.selectedFile=t[0];else this.selectedFile=null},dragover:function(t){!this.noDrop&&this.custom&&(this.dragging=!0,t.dataTransfer.dropEffect="copy")},drop:function(t){this.noDrop||(this.dragging=!1,t.dataTransfer.files&&t.dataTransfer.files.length>0&&this.onFileChange(t))},traverseFileTree:function(t,e){var n=this;return new Promise(function(i){e=e||"",t.isFile?t.file(function(t){t.$path=e,i(t)}):t.isDirectory&&t.createReader().readEntries(function(r){for(var o=[],s=0;s<r.length;s++)o.push(n.traverseFileTree(r[s],e+t.name+"/"));Promise.all(o).then(function(t){i(from(t))})})})}}},formSelect={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("select",{directives:[{name:"model",rawName:"v-model",value:t.localValue,expression:"localValue"}],ref:"input",class:t.inputClass,attrs:{name:t.name,id:t.safeId(),multiple:t.multiple||null,size:t.multiple||t.selectSize>1?t.selectSize:null,disabled:t.disabled,required:t.required,"aria-required":t.required?"true":null,"aria-invalid":t.computedAriaInvalid},on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.localValue=e.target.multiple?n:n[0]}}},[t._l(t.formOptions,function(e){return n("option",{key:e.value||e.text,attrs:{disabled:e.disabled},domProps:{value:e.value,innerHTML:t._s(e.text)}})}),t._t("default")],2)},staticRenderFns:[],mixins:[idMixin,formMixin,formSizeMixin,formStateMixin,formCustomMixin,formOptionsMixin],data:function(){return{localValue:this.multiple?this.value||[]:this.value}},props:{value:{},options:{type:[Array,Object],required:!0},multiple:{type:Boolean,default:!1},selectSize:{type:Number,default:0},ariaInvalid:{type:[Boolean,String],default:!1}},computed:{inputClass:function(){return["form-control",this.stateClass,this.sizeFormClass,this.plain||this.multiple||this.selectSize>1?null:"custom-select"]},computedAriaInvalid:function(){return!0===this.ariaInvalid||"true"===this.ariaInvalid?"true":!1===this.computedState?"true":null}}},props$27={fluid:{type:Boolean,default:!1},containerFluid:{type:Boolean,default:!1},header:{type:String,default:null},headerTag:{type:String,default:"h1"},headerLevel:{type:Number,default:3},lead:{type:String,default:null},leadTag:{type:String,default:"p"},tag:{type:String,default:"div"}},jumbotron={functional:!0,props:props$27,render:function(t,e){var n=e.props,i=e.data,r=e.slots,o=[];if(n.header||r().header){o.push(t(n.headerTag,{class:(s={},s["display-"+n.headerLevel]=Boolean(n.headerLevel),s)},r().header||n.header));var s}return(n.lead||r().lead)&&o.push(t(n.leadTag,{staticClass:"lead"},r().lead||n.lead)),r().default&&o.push(r().default),n.fluid&&(o=[t(Container,{props:{fluid:n.containerFluid}},o)]),t(n.tag,lib_common(i,{staticClass:"jumbotron",class:{"jumbotron-fluid":n.fluid}}),o)}},props$28={tag:{type:String,default:"div"},flush:{type:Boolean,default:!1}},listGroup={functional:!0,props:props$28,render:function(t,e){var n=e.props,i=e.data,r=e.children,o={staticClass:"list-group",class:{"list-group-flush":n.flush}};return t(n.tag,lib_common(i,o),r)}},actionTags=["a","router-link","button","b-link"],linkProps$1=propsFactory();delete linkProps$1.href.default,delete linkProps$1.to.default;var props$29=assign(linkProps$1,{tag:{type:String,default:"div"},action:{type:Boolean,default:null},variant:{type:String,default:null}}),listGroupItem={functional:!0,props:props$29,render:function(t,e){var n,i=e.props,r=e.data,o=e.children,s=i.href||i.to?bLink:i.tag,a={staticClass:"list-group-item",class:(n={"list-group-flush":i.flush,active:i.active,disabled:i.disabled,"list-group-item-action":Boolean(i.href||i.to||i.action||arrayIncludes(actionTags,i.tag))},n["list-group-item-"+i.variant]=Boolean(i.variant),n),props:pluckProps(linkProps$1,i)};return t(s,lib_common(r,a),o)}},props$31={tag:{type:String,default:"div"}},MediaBody={functional:!0,props:props$31,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"media-body"}),r)}},props$32={tag:{type:String,default:"div"},verticalAlign:{type:String,default:"top"}},MediaAside={functional:!0,props:props$32,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"d-flex",class:(o={},o["align-self-"+n.verticalAlign]=n.verticalAlign,o)}),r);var o}},props$30={tag:{type:String,default:"div"},rightAlign:{type:Boolean,default:!1},verticalAlign:{type:String,default:"top"},noBody:{type:Boolean,default:!1}},media={functional:!0,props:props$30,render:function(t,e){var n=e.props,i=e.data,r=e.slots,o=e.children,s=n.noBody?o:[];return n.noBody||(r().aside&&!n.rightAlign&&s.push(t(MediaAside,{staticClass:"mr-3",props:{verticalAlign:n.verticalAlign}},r().aside)),s.push(t(MediaBody,r().default)),r().aside&&n.rightAlign&&s.push(t(MediaAside,{staticClass:"ml-3",props:{verticalAlign:n.verticalAlign}},r().aside))),t(n.tag,lib_common(i,{staticClass:"media"}),s)}},FOCUS_SELECTOR=["button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","a:not([disabled]):not(.disabled)","[tabindex]:not([disabled]):not(.disabled)"].join(","),modal={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("transition-group",{attrs:{"enter-class":"hidden","enter-to-class":"","enter-active-class":"","leave-class":"show","leave-active-class":"","leave-to-class":"hidden"},on:{"after-enter":t.focusFirst}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.is_visible,expression:"is_visible"}],key:"modal",ref:"modal",class:["modal",{fade:!t.noFade,show:t.is_visible}],attrs:{id:t.id||null,role:"dialog"},on:{click:function(e){t.onClickOut()},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.onEsc()}}},[n("div",{class:["modal-dialog","modal-"+t.size]},[n("div",{ref:"content",staticClass:"modal-content",attrs:{tabindex:"-1",role:"document","aria-labelledby":t.hideHeader||!t.id?null:t.id+"__BV_header_","aria-describedby":t.id?t.id+"__BV_body_":null},on:{click:function(t){t.stopPropagation()}}},[t.hideHeader?t._e():n("header",{ref:"header",staticClass:"modal-header",attrs:{id:t.id?t.id+"__BV_header_":null}},[t._t("modal-header",[n(t.titleTag,{tag:"h5",staticClass:"modal-title"},[t._t("modal-title",[t._v(t._s(t.title))])],2),t.hideHeaderClose?t._e():n("button",{staticClass:"close",attrs:{type:"button","aria-label":t.headerCloseLabel},on:{click:t.hide}},[n("span",{attrs:{"aria-hidden":"true"}},[t._v("×")])])])],2),n("div",{ref:"body",staticClass:"modal-body",attrs:{id:t.id?t.id+"__BV_body_":null}},[t._t("default")],2),t.hideFooter?t._e():n("footer",{ref:"footer",staticClass:"modal-footer"},[t._t("modal-footer",[t.okOnly?t._e():n("b-btn",{attrs:{variant:"secondary",size:t.buttonSize},on:{click:function(e){t.hide(!1)}}},[t._t("modal-cancel",[t._v(t._s(t.closeTitle))])],2),n("b-btn",{attrs:{variant:"primary",size:t.buttonSize,disabled:t.okDisabled},on:{click:function(e){t.hide(!0)}}},[t._t("modal-ok",[t._v(t._s(t.okTitle))])],2)])],2)])])]),t.is_visible?n("div",{key:"modal-backdrop",class:["modal-backdrop",{fade:!t.noFade,show:t.is_visible}]}):t._e()])],1)},staticRenderFns:[],_scopeId:"data-v-1b4cbb68",mixins:[listenOnRootMixin],components:{bBtn:bBtn},data:function(){return{is_visible:!1,return_focus:this.returnFocus||null}},model:{prop:"visible",event:"change"},computed:{body:function(){if("undefined"!=typeof document)return document.querySelector("body")}},watch:{visible:function(t,e){t!==e&&(t?this.show():this.hide())}},props:{id:{type:String,default:null},title:{type:String,default:""},titleTag:{type:String,default:"h5"},size:{type:String,default:"md"},buttonSize:{type:String,default:""},noFade:{type:Boolean,default:!1},noCloseOnBackdrop:{type:Boolean,default:!1},noCloseOnEsc:{type:Boolean,default:!1},noAutoFocus:{type:Boolean,default:!1},noEnforceFocus:{type:Boolean,default:!1},hideHeader:{type:Boolean,default:!1},hideFooter:{type:Boolean,default:!1},hideHeaderClose:{type:Boolean,default:!1},okOnly:{type:Boolean,default:!1},okDisabled:{type:Boolean,default:!1},visible:{type:Boolean,default:!1},returnFocus:{default:null},headerCloseLabel:{type:String,default:"Close"},closeTitle:{type:String,default:"Close"},okTitle:{type:String,default:"OK"}},methods:{show:function(){this.is_visible||(this.$emit("show"),this.is_visible=!0,this.$root.$emit("shown::modal",this.id),this.body.classList.add("modal-open"),this.$emit("shown"),this.$emit("change",!0),"undefined"!=typeof document&&(document.removeEventListener("focusin",this.enforceFocus,!1),document.addEventListener("focusin",this.enforceFocus,!1)))},hide:function(t){if(this.is_visible){var e=!1,n={isOK:t,cancel:function(){e=!0}};this.$emit("change",!1),this.$emit("hide",n),!0===t?this.$emit("ok",n):!1===t&&this.$emit("cancel",n),e||("undefined"!=typeof document&&(document.removeEventListener("focusin",this.enforceFocus,!1),this.returnFocusTo()),this.is_visible=!1,this.$root.$emit("hidden::modal",this.id),this.$emit("hidden",n),this.body.classList.remove("modal-open"))}},onClickOut:function(){this.is_visible&&!this.noCloseOnBackdrop&&this.hide()},onEsc:function(){this.is_visible&&!this.noCloseOnEsc&&this.hide()},focusFirst:function(){var t=this;"undefined"!=typeof document&&this.$nextTick(function(){if(!document.activeElement||!t.$refs.content.contains(document.activeElement)){var e;t.noAutoFocus||(t.$refs.body&&(e=findFirstVisible(t.$refs.body,FOCUS_SELECTOR)),!e&&t.$refs.footer&&(e=findFirstVisible(t.$refs.footer,FOCUS_SELECTOR)),!e&&t.$refs.header&&(e=findFirstVisible(t.$refs.header,FOCUS_SELECTOR))),e||(e=t.$refs.content),e&&e.focus&&e.focus()}})},returnFocusTo:function(){var t=this.returnFocus||this.return_focus||null;t&&("string"==typeof t&&(t=document.querySelector(t)),t&&t.$el&&"function"==typeof t.$el.focus?t.$el.focus():t&&"function"==typeof t.focus&&t.focus())},enforceFocus:function(t){!this.noEnforceFocus&&this.is_visible&&document!==t.target&&this.$refs.content&&this.$refs.content!==t.target&&!this.$refs.content.contains(t.target)&&this.$refs.content.focus()},showHandler:function(t,e){t===this.id&&(this.return_focus=e||null,this.show())},hideHandler:function(t){t===this.id&&this.hide()}},created:function(){this.listenOnRoot("show::modal",this.showHandler),this.listenOnRoot("hide::modal",this.hideHandler)},mounted:function(){!0===this.visible&&this.show()},destroyed:function(){"undefined"!=typeof document&&document.removeEventListener("focusin",this.enforceFocus,!1)}},props$33={tag:{type:String,default:"ul"},fill:{type:Boolean,default:!1},justified:{type:Boolean,default:!1},tabs:{type:Boolean,default:!1},pills:{type:Boolean,default:!1},vertical:{type:Boolean,default:!1},isNavBar:{type:Boolean,default:!1}},nav={functional:!0,props:props$33,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"nav",class:{"navbar-nav":n.isNavBar,"nav-tabs":n.tabs,"nav-pills":n.pills,"flex-column":n.vertical,"nav-fill":n.fill,"nav-justified":n.justified}}),r)}},props$34=propsFactory(),navItem={functional:!0,props:props$34,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t("li",lib_common(i,{staticClass:"nav-item"}),[t(bLink,{staticClass:"nav-link",props:n},r)])}},navItemDropdown={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{class:t.dropdownClasses,attrs:{id:t.safeId()}},[n("a",{ref:"button",class:t.toggleClasses,attrs:{href:"#",id:t.safeId("_BV_button_"),"aria-haspopup":"true","aria-expanded":t.visible?"true":"false",disabled:t.disabled},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.toggle(e)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.stopPropagation(),e.preventDefault(),t.toggle(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.stopPropagation(),e.preventDefault(),t.toggle(e)}]}},[t._t("button-content",[t._t("text",[n("span",{domProps:{innerHTML:t._s(t.text)}})])])],2),n("div",{ref:"menu",class:t.menuClasses,attrs:{role:t.role,"aria-labelledby":t.safeId("_BV_button_")},on:{mouseover:t.onMouseOver,keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.onEsc(e)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"tab",9))return null;t.onTab(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;t.focusNext(e,!0)},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;t.focusNext(e,!1)}]}},[t._t("default")],2)])},staticRenderFns:[],mixins:[idMixin,dropdownMixin],computed:{isNav:function(){return!0},dropdownClasses:function(){return["nav-item","b-nav-dropdown","dropdown",this.dropup?"dropup":"",this.visible?"show":""]},toggleClasses:function(){return["nav-link",this.noCaret?"":"dropdown-toggle",this.disabled?disabled:""]},menuClasses:function(){return["dropdown-menu",this.right?"dropdown-menu-right":"dropdown-menu-left",this.visible?"show":""]}},props:{noCaret:{type:Boolean,default:!1},role:{type:String,default:"menu"}}},navToggle={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("button",{class:t.classObject,attrs:{type:"button","aria-label":t.label,"aria-controls":t.target.id?t.target.id:t.target,"aria-expanded":t.toggleState?"true":"false"},on:{click:t.onclick}},[t._t("default",[n("span",{staticClass:"navbar-toggler-icon"})])],2)},staticRenderFns:[],mixins:[listenOnRootMixin],computed:{classObject:function(){return["navbar-toggler","navbar-toggler-"+this.position]}},data:function(){return{toggleState:!1}},props:{label:{type:String,default:"Toggle navigation"},position:{type:String,default:"right"},target:{required:!0}},methods:{onclick:function(){var t=this.target;t.toggle&&t.toggle(),this.$root.$emit("collapse::toggle",this.target)},handleStateEvt:function(t,e){t!==this.target&&t!==this.target.id||(this.toggleState=e)}},created:function(){this.listenOnRoot("collapse::toggle::state",this.handleStateEvt)}},props$35={tag:{type:String,default:"nav"},type:{type:String,default:"light"},variant:{type:String},toggleable:{type:[Boolean,String],default:!1},toggleBreakpoint:{type:String,default:null},fixed:{type:String},sticky:{type:Boolean,default:!1}},navbar={functional:!0,props:props$35,render:function(t,e){var n=e.props,i=e.data,r=e.children,o=n.toggleBreakpoint||(!0===n.toggleable?"sm":n.toggleable)||"sm";return t(n.tag,lib_common(i,{staticClass:"navbar",class:(s={"sticky-top":n.sticky},s["navbar-"+n.type]=Boolean(n.type),s["bg-"+n.variant]=Boolean(n.variant),s["fixed-"+n.fixed]=Boolean(n.fixed),s["navbar-expand-"+o]=!1!==n.toggleable,s)}),r);var s}},linkProps$2=propsFactory();linkProps$2.href.default=void 0,linkProps$2.to.default=void 0;var props$36=assign(linkProps$2,{tag:{type:String,default:"div"}}),navbarBrand={functional:!0,props:props$36,render:function(t,e){var n=e.props,i=e.data,r=e.children,o=Boolean(n.to||n.href);return t(o?bLink:n.tag,lib_common(i,{staticClass:"navbar-brand",props:o?pluckProps(linkProps$2,n):{}}),r)}},props$37={tag:{type:String,default:"span"}},navText={functional:!0,props:props$37,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"navbar-text"}),r)}},navForm={functional:!0,props:{id:{type:String,default:null}},render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(Form,lib_common(i,{attrs:{id:n.id},props:{inline:!0}}),r)}},COMMON_ALIGNMENT=["start","end","center"],props$38={tag:{type:String,default:"div"},noGutters:{type:Boolean,default:!1},alignV:{type:String,default:null,validator:function(t){return arrayIncludes(COMMON_ALIGNMENT.concat(["baseline","stretch"]),t)}},alignH:{type:String,default:null,validator:function(t){return arrayIncludes(COMMON_ALIGNMENT.concat(["between","around"]),t)}},alignContent:{type:String,default:null,validator:function(t){return arrayIncludes(COMMON_ALIGNMENT.concat(["between","around","stretch"]),t)}}},row={functional:!0,props:props$38,render:function(t,e){var n=e.props,i=e.data,r=e.children;return t(n.tag,lib_common(i,{staticClass:"row",class:(o={"no-gutters":n.noGutters},o["align-items-"+n.alignV]=n.alignV,o["justify-content-"+n.alignH]=n.alignH,o["align-content-"+n.alignContent]=n.alignContent,o)}),r);var o}},range=function(t){return Array.apply(null,{length:t})},ELLIPSIS_THRESHOLD=3,pagination={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{class:["pagination",t.btnSize,t.alignment],attrs:{"aria-disabled":t.disabled?"true":"false","aria-label":t.ariaLabel?t.ariaLabel:null,role:"menubar"},on:{focusin:function(e){if(e.target!==e.currentTarget)return null;t.focusCurrent(e)},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"left",37)?"button"in e&&0!==e.button?null:(e.preventDefault(),void t.focusPrev(e)):null},function(e){return"button"in e||!t._k(e.keyCode,"right",39)?"button"in e&&2!==e.button?null:(e.preventDefault(),void t.focusNext(e)):null},function(e){return("button"in e||!t._k(e.keyCode,"left",37))&&e.shiftKey?"button"in e&&0!==e.button?null:(e.preventDefault(),void t.focusFirst(e)):null},function(e){return("button"in e||!t._k(e.keyCode,"right",39))&&e.shiftKey?"button"in e&&2!==e.button?null:(e.preventDefault(),void t.focusLast(e)):null}]}},[t.hideGotoEndButtons?t._e():[t.isActive(1)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.firstText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("a",{staticClass:"page-link",attrs:{"aria-label":t.labelFirstPage,"aria-controls":t.ariaControls||null,role:"menuitem",href:"#",tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.setPage(e,1)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.setPage(e,1)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.preventDefault(),t.setPage(e,1)}]}},[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.firstText)}})])])],t.isActive(1)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.prevText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("a",{staticClass:"page-link",attrs:{"aria-label":t.labelPrevPage,"aria-controls":t.ariaControls||null,role:"menuitem",href:"#",tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.setPage(e,t.currentPage-1)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.setPage(e,t.currentPage-1)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.preventDefault(),t.setPage(e,t.currentPage-1)}]}},[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.prevText)}})])]),t.showFirstDots?n("li",{staticClass:"page-item disabled d-none d-sm-flex",attrs:{role:"separator"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.ellipsisText)}})]):t._e(),t._l(t.pageList,function(e){return n("li",{key:e.number,class:t.pageItemClasses(e),attrs:{role:"none presentation"}},[n("a",{class:t.pageLinkClasses(e),attrs:{disabled:t.disabled,"aria-disabled":t.disabled?"true":null,"aria-label":t.labelPage+" "+e.number,"aria-checked":t.isActive(e.number)?"true":"false","aria-controls":t.ariaControls||null,"aria-posinset":e.number,"aria-setsize":t.numberOfPages,role:"menuitemradio",href:"#",tabindex:"-1"},on:{click:function(n){n.preventDefault(),t.setPage(n,e.number)},keydown:[function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13))return null;n.preventDefault(),t.setPage(n,e.number)},function(n){if(!("button"in n)&&t._k(n.keyCode,"space",32))return null;n.preventDefault(),t.setPage(n,e.number)}]}},[t._v(t._s(e.number))])])}),t.showLastDots?n("li",{staticClass:"page-item disabled d-none d-sm-flex",attrs:{role:"separator"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.ellipsisText)}})]):t._e(),t.isActive(t.numberOfPages)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.nextText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("a",{staticClass:"page-link",attrs:{"aria-label":t.labelNextPage,"aria-controls":t.ariaControls||null,role:"menuitem",href:"#",tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.setPage(e,t.currentPage+1)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.setPage(e,t.currentPage+1)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.preventDefault(),t.setPage(e,t.currentPage+1)}]}},[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.nextText)}})])]),t.hideGotoEndButtons?t._e():[t.isActive(t.numberOfPages)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.lastText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("a",{staticClass:"page-link",attrs:{"aria-label":t.labelLastPage,"aria-controls":t.ariaControls||null,role:"menuitem",href:"#",tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.setPage(e,t.numberOfPages)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.setPage(e,t.numberOfPages)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.preventDefault(),t.setPage(e,t.numberOfPages)}]}},[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.lastText)}})])])]],2)},staticRenderFns:[],_scopeId:"data-v-2792960b",data:function(){return{showFirstDots:!1,showLastDots:!1,currentPage:this.value}},computed:{numberOfPages:function(){var t=Math.ceil(this.totalRows/this.perPage);return t<1?1:t},btnSize:function(){return this.size?"pagination-"+this.size:""},alignment:function(){return"center"===this.align?"justify-content-center":"end"===this.align||"right"===this.align?"justify-content-end":""},pageList:function(){this.currentPage>this.numberOfPages?this.currentPage=this.numberOfPages:this.currentPage<1&&(this.currentPage=1),this.showFirstDots=!1,this.showLastDots=!1;var t=this.limit,e=1;this.numberOfPages<=this.limit?t=this.numberOfPages:this.currentPage<this.limit-1&&this.limit>ELLIPSIS_THRESHOLD?this.hideEllipsis||(t=this.limit-1,this.showLastDots=!0):this.numberOfPages-this.currentPage+2<this.limit&&this.limit>ELLIPSIS_THRESHOLD?(this.hideEllipsis||(this.showFirstDots=!0,t=this.limit-1),e=this.numberOfPages-t+1):(this.limit>ELLIPSIS_THRESHOLD&&!this.hideEllipsis&&(this.showFirstDots=!0,this.showLastDots=!0,t=this.limit-2),e=this.currentPage-Math.floor(t/2)),e<1?e=1:e>this.numberOfPages-t&&(e=this.numberOfPages-t+1);var n=makePageArray(e,t);if(n.length>3){var i=this.currentPage-e;if(0===i)for(var r=3;r<n.length;r++)n[r].className="d-none d-sm-flex";else if(i===n.length-1)for(var o=0;o<n.length-3;o++)n[o].className="d-none d-sm-flex";else{for(var s=0;s<i-1;s++)n[s].className="d-none d-sm-flex";for(var a=n.length-1;a>i+1;a--)n[a].className="d-none d-sm-flex"}}return n}},methods:{isActive:function(t){return t===this.currentPage},pageItemClasses:function(t){var e=this.isActive(t.number);return["page-item",this.disabled?"disabled":"",e?"active":"",t.className]},pageLinkClasses:function(t){var e=this.isActive(t.number);return["page-link",this.disabled?"disabled":"",e?"active":""]},setPage:function(t,e){var n=this;if(this.disabled)return t.preventDefault(),void t.stopPropagation();e>this.numberOfPages?this.currentPage=this.numberOfPages:e<1?this.currentpage=1:this.currentPage=e,this.$nextTick(function(){isVisible$3(t.target)&&t.target.focus?t.target.focus():n.focusCurrent()}),this.$emit("change",this.currentPage)},getButtons:function(){return from(this.$el.querySelectorAll("a.page-link")).filter(function(t){return isVisible$3(t)})},setBtnFocus:function(t){this.$nextTick(function(){t.focus()})},focusFirst:function(){var t=this.getButtons().find(function(t){return!t.disabled});t&&t.focus&&t!==document.activeElement&&this.setBtnFocus(t)},focusLast:function(){var t=this.getButtons().reverse().find(function(t){return!t.disabled});t&&t.focus&&t!==document.activeElement&&this.setBtnFocus(t)},focusCurrent:function(){var t=this,e=this.getButtons().find(function(e){return parseInt(e.getAttribute("aria-posinset"),10)===t.currentPage});e&&e.focus?this.setBtnFocus(e):this.focusFirst()},focusPrev:function(){var t=this.getButtons(),e=t.indexOf(document.activeElement);e>0&&!t[e-1].disabled&&t[e-1].focus&&this.setBtnFocus(t[e-1])},focusNext:function(){var t=this.getButtons(),e=t.indexOf(document.activeElement);e<t.length-1&&!t[e+1].disabled&&t[e+1].focus&&this.setBtnFocus(t[e+1])}},watch:{currentPage:function(t,e){t!==e&&this.$emit("input",t)},value:function(t,e){t!==e&&(this.currentPage=t)}},props:{disabled:{type:Boolean,default:!1},value:{type:Number,default:1},limit:{type:Number,default:5},perPage:{type:Number,default:20},totalRows:{type:Number,default:20},size:{type:String,default:"md"},align:{type:String,default:"left"},hideGotoEndButtons:{type:Boolean,default:!1},ariaLabel:{type:String,default:"Pagination"},labelFirstPage:{type:String,default:"Goto first page"},firstText:{type:String,default:"&laquo;"},labelPrevPage:{type:String,default:"Goto previous page"},prevText:{type:String,default:"&lsaquo;"},labelNextPage:{type:String,default:"Goto next page"},nextText:{type:String,default:"&rsaquo;"},labelLastPage:{type:String,default:"Goto last page"},lastText:{type:String,default:"&raquo;"},labelPage:{type:String,default:"Goto page"},hideEllipsis:{type:Boolean,default:!1},ellipsisText:{type:String,default:"&hellip;"},ariaControls:{type:String,default:null}}},ELLIPSIS_THRESHOLD$1=3,routerProps=pickLinkProps("activeClass","exactActiveClass","append","exact","replace","target","rel"),props$39=assign({numberOfPages:{type:Number,default:1},baseUrl:{type:String,default:"/"},useRouter:{type:Boolean,default:!1},linkGen:{type:Function,default:null},pageGen:{type:Function,default:null}},{disabled:{type:Boolean,default:!1},value:{type:Number,default:1},limit:{type:Number,default:5},size:{type:String,default:"md"},align:{type:String,default:"left"},hideGotoEndButtons:{type:Boolean,default:!1},ariaLabel:{type:String,default:"Pagination"},labelFirstPage:{type:String,default:"Goto first page"},firstText:{type:String,default:"&laquo;"},labelPrevPage:{type:String,default:"Goto previous page"},prevText:{type:String,default:"&lsaquo;"},labelNextPage:{type:String,default:"Goto next page"},nextText:{type:String,default:"&rsaquo;"},labelLastPage:{type:String,default:"Goto last page"},lastText:{type:String,default:"&raquo;"},labelPage:{type:String,default:"Goto page"},hideEllipsis:{type:Boolean,default:!1},ellipsisText:{type:String,default:"&hellip;"}},routerProps),paginationNav={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",[n("ul",{class:["pagination",t.btnSize,t.alignment],attrs:{"aria-disabled":t.disabled?"true":"false","aria-label":t.ariaLabel?t.ariaLabel:null,role:"menubar"},on:{focusin:function(e){if(e.target!==e.currentTarget)return null;t.focusCurrent(e)},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"left",37)?"button"in e&&0!==e.button?null:(e.preventDefault(),void t.focusPrev(e)):null},function(e){return"button"in e||!t._k(e.keyCode,"right",39)?"button"in e&&2!==e.button?null:(e.preventDefault(),void t.focusNext(e)):null},function(e){return("button"in e||!t._k(e.keyCode,"left",37))&&e.shiftKey?"button"in e&&0!==e.button?null:(e.preventDefault(),void t.focusFirst(e)):null},function(e){return("button"in e||!t._k(e.keyCode,"right",39))&&e.shiftKey?"button"in e&&2!==e.button?null:(e.preventDefault(),void t.focusLast(e)):null}]}},[t.hideGotoEndButtons?t._e():[t.isActive(1)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.firstText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("b-link",t._b({staticClass:"page-link",attrs:{"aria-label":t.labelFirstPage,role:"menuitem",tabindex:"-1"},on:{click:function(e){t.onClick(1)}}},"b-link",t.linkProps(1),!1),[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.firstText)}})])],1)],t.isActive(1)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.prevText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("b-link",t._b({staticClass:"page-link",attrs:{"aria-label":t.labelPrevPage,role:"menuitem",tabindex:"-1"},on:{click:function(e){t.onClick(t.currentPage-1)}}},"b-link",t.linkProps(t.currentPage-1),!1),[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.prevText)}})])],1),t.showFirstDots?n("li",{staticClass:"page-item disabled d-none d-sm-flex",attrs:{role:"separator"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.ellipsisText)}})]):t._e(),t._l(t.pageList,function(e){return n("li",{key:e.number,class:t.pageItemClasses(e),attrs:{role:"none presentation"}},[t.disabled?n("span",{staticClass:"page-link"},[t._v(t._s(e.number))]):n("b-link",t._b({class:t.pageLinkClasses(e),attrs:{disabled:t.disabled,"aria-disabled":t.disabled?"true":null,"aria-label":t.labelPage+" "+e.number,"aria-checked":t.isActive(e.number)?"true":"false","aria-posinset":e.number,"aria-setsize":t.numberOfPages,role:"menuitemradio",tabindex:"-1"},domProps:{innerHTML:t._s(t.makePage(e.number))},on:{click:function(n){t.onClick(e.number)}}},"b-link",t.linkProps(e.number),!1))],1)}),t.showLastDots?n("li",{staticClass:"page-item disabled d-none d-sm-flex",attrs:{role:"separator"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.ellipsisText)}})]):t._e(),t.isActive(t.numberOfPages)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.nextText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("b-link",t._b({staticClass:"page-link",attrs:{"aria-label":t.labelNextPage,role:"menuitem",tabindex:"-1"},on:{click:function(e){t.onClick(t.currentPage+1)}}},"b-link",t.linkProps(t.currentPage+1),!1),[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.nextText)}})])],1),t.hideGotoEndButtons?t._e():[t.isActive(t.numberOfPages)||t.disabled?n("li",{staticClass:"page-item disabled",attrs:{role:"none presentation","aria-hidden":"true"}},[n("span",{staticClass:"page-link",domProps:{innerHTML:t._s(t.lastText)}})]):n("li",{staticClass:"page-item",attrs:{role:"none presentation"}},[n("b-link",t._b({staticClass:"page-link",attrs:{"aria-label":t.labelLastPage,role:"menuitem"},on:{click:function(e){t.onClick(t.numberOfPages)}}},"b-link",t.linkProps(t.numberOfPages),!1),[n("span",{attrs:{"aria-hidden":"true"},domProps:{innerHTML:t._s(t.lastText)}})])],1)]],2)])},staticRenderFns:[],_scopeId:"data-v-20c4e761",components:{bLink:bLink},data:function(){return{showFirstDots:!1,showLastDots:!1,currentPage:this.value}},props:props$39,watch:{currentPage:function(t,e){t!==e&&this.$emit("input",t)},value:function(t,e){t!==e&&(this.currentPage=t)}},computed:{btnSize:function(){return this.size?"pagination-"+this.size:""},alignment:function(){return"center"===this.align?"justify-content-center":"end"===this.align||"right"===this.align?"justify-content-end":""},pageList:function(){this.currentPage>this.numberOfPages?this.currentPage=this.numberOfPages:this.currentPage<1&&(this.currentPage=1),this.showFirstDots=!1,this.showLastDots=!1;var t=this.limit,e=1;this.numberOfPages<=this.limit?t=this.numberOfPages:this.currentPage<this.limit-1&&this.limit>ELLIPSIS_THRESHOLD$1?this.hideEllipsis||(t=this.limit-1,this.showLastDots=!0):this.numberOfPages-this.currentPage+2<this.limit&&this.limit>ELLIPSIS_THRESHOLD$1?(this.hideEllipsis||(this.showFirstDots=!0,t=this.limit-1),e=this.numberOfPages-t+1):(this.limit>ELLIPSIS_THRESHOLD$1&&!this.hideEllipsis&&(this.showFirstDots=!0,this.showLastDots=!0,t=this.limit-2),e=this.currentPage-Math.floor(t/2)),e<1?e=1:e>this.numberOfPages-t&&(e=this.numberOfPages-t+1);var n=makePageArray$1(e,t);if(n.length>3){var i=this.currentPage-e;if(0===i)for(var r=3;r<n.length;r++)n[r].className="d-none d-sm-flex";else if(i===n.length-1)for(var o=0;o<n.length-3;o++)n[o].className="d-none d-sm-flex";else{for(var s=0;s<i-1;s++)n[s].className="d-none d-sm-flex";for(var a=n.length-1;a>i+1;a--)n[a].className="d-none d-sm-flex"}}return n}},methods:{onClick:function(t){this.currentPage=t},makeLink:function(t){if(this.linkGen&&"function"==typeof this.linkGen)return this.linkGen(t);var e=""+this.baseUrl+t;return this.useRouter?{path:e}:e},makePage:function(t){return this.pageGen&&"function"==typeof this.pageGen?this.pageGen(t):t},linkProps:function(t){var e=this.makeLink(t),n={href:"string"==typeof e?e:null,target:this.target||null,rel:this.rel||null,disabled:this.disabled};return(this.useRouter||"object"==typeof e)&&(n=assign(n,{to:e,exact:this.exact,activeClass:this.activeClass,exactActiveClass:this.exactActiveClass,append:this.append,replace:this.replace})),n},isActive:function(t){return t===this.currentPage},pageItemClasses:function(t){return["page-item",this.disabled?"disabled":"",this.isActive(t.number)?"active":"",t.className]},pageLinkClasses:function(t){return["page-link",this.disabled?"disabled":"",this.isActive(t.number)?"active":""]},getButtons:function(){return from(this.$el.querySelectorAll("a.page-link")).filter(function(t){return isVisible$4(t)})},setBtnFocus:function(t){this.$nextTick(function(){t.focus()})},focusFirst:function(){var t=this.getButtons().find(function(t){return!t.disabled});t&&t.focus&&t!==document.activeElement&&this.setBtnFocus(t)},focusLast:function(){var t=this.getButtons().reverse().find(function(t){return!t.disabled});t&&t.focus&&t!==document.activeElement&&this.setBtnFocus(t)},focusCurrent:function(){var t=this,e=this.getButtons().find(function(e){return parseInt(e.getAttribute("aria-posinset"),10)===t.currentPage});e&&e.focus?this.setBtnFocus(e):this.focusFirst()},focusPrev:function(){var t=this.getButtons(),e=t.indexOf(document.activeElement);e>0&&!t[e-1].disabled&&t[e-1].focus&&this.setBtnFocus(t[e-1])},focusNext:function(){var t=this.getButtons(),e=t.indexOf(document.activeElement);e<t.length-1&&!t[e+1].disabled&&t[e+1].focus&&this.setBtnFocus(t[e+1])}}},inBrowser="undefined"!=typeof window&&"undefined"!=typeof document,NAME$1="tooltp",CLASS_PREFIX$1="bs-tooltip",BSCLS_PREFIX_REGEX$1=new RegExp("\\b"+CLASS_PREFIX$1+"\\S+","g"),TRANSITION_DURATION=150,MODAL_CLOSE_EVENT=["bv::modal::hidden","hidden::modal"],MODAL_CLASS=".modal",AttachmentMap$1={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},HoverState={SHOW:"show",OUT:"out"},ClassName$1={FADE:"fade",SHOW:"show"},Selector$1={TOOLTIP:".tooltip",TOOLTIP_INNER:".tooltip-inner",ARROW:".arrow"},Defaults$2={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",callbacks:{}},TransitionEndEvents$1={WebkitTransition:["webkitTransitionEnd"],MozTransition:["transitionend"],OTransition:["otransitionend","oTransitionEnd"],transition:["transitionend"]},NEXTID=1;inBrowser&&window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(t){var e,n=(this.document||this.ownerDocument).querySelectorAll(t),i=this;do{for(e=n.length;--e>=0&&n.item(e)!==i;);}while(e<0&&(i=i.parentElement));return i});var ToolTip=function(t,e,n){this.$fadeTimeout=null,this.$hoverTimeout=null,this.$hoverState="",this.$activeTrigger={},this.$popper=null,this.$element=t,this.$tip=null,this.$id=generateId(this.constructor.NAME),this.$root=n||null,this.updateConfig(e)},staticAccessors={Default:{},NAME:{}};staticAccessors.Default.get=function(){return Defaults$2},staticAccessors.NAME.get=function(){return NAME$1},ToolTip.prototype.updateConfig=function(t){var e=assign({},this.constructor.Default,t);t.delay&&"number"==typeof t.delay&&(e.delay={show:t.delay,hide:t.delay}),t.title&&"number"==typeof t.title&&(e.title=t.title.toString()),t.content&&"number"==typeof t.content&&(e.content=t.content.toString()),this.$config=e,this.unListen(),this.listen()},ToolTip.prototype.destroy=function(){clearTimeout(this.$hoverTimeout),this.$hoverTimeout=null,clearTimeout(this.$fadeTimeout),this.$fadeTimeout=null,this.unListen(),this.setOnTouchStartListener(!1),this.$popper&&this.$popper.destroy(),this.$popper=null,this.$tip&&this.$tip.parentElement&&this.$tip.parentElement.removeChild(this.$tip),this.$tip=null,this.$id=null,this.$root=null,this.$element=null,this.$config=null,this.$hoverState=null,this.$activeTrigger=null},ToolTip.prototype.toggle=function(t){t?(this.$activeTrigger.click=!this.$activeTrigger.click,this.isWithActiveTrigger()?this.enter(null):this.leave(null)):this.getTipElement().classList.contains(ClassName$1.SHOW)?this.leave(null):this.enter(null)},ToolTip.prototype.show=function(){var t=this;if(document.body.contains(this.$element)){var e=this.getTipElement();if(this.setContent(e),this.isWithContent(e)){e.setAttribute("id",this.$id),this.addAriaDescribedby(),e.classList[this.$config.animation?"add":"remove"](ClassName$1.FADE);var n=this.getPlacement(),i=this.constructor.getAttachment(n);this.addAttachmentClass(this.constructor.getAttachment(i));var r=new BvEvent("show",{cancelable:!0,target:this.$element,relatedTarget:e});if(this.emitEvent(r),!r.defaultPrevented){var o=this.getContainer();document.body.contains(e)||o.appendChild(e),this.removePopper(),this.$popper=new Popper(this.$element,e,this.getPopperConfig(i));e.classList.add(ClassName$1.SHOW),this.setOnTouchStartListener(!0),this.transitionOnce(e,function(){t.$config.animation&&t.fixTransition(e);var n=t.$hoverState;t.$hoverState=null,n===HoverState.OUT&&t.leave(null);var i=new BvEvent("shown",{cancelable:!1,target:t.$element,relatedTarget:e});t.emitEvent(i)})}}else this.$tip=null}},ToolTip.prototype.hide=function(t){var e=this,n=this.getTipElement(),i=new BvEvent("hide",{cancelable:!0,target:this.$element,relatedTarget:n});if(this.emitEvent(i),!i.defaultPrevented){this.setOnTouchStartListener(!1),n.classList.remove(ClassName$1.SHOW),this.$activeTrigger.click=!1,this.$activeTrigger.focus=!1,this.$activeTrigger.hover=!1,this.transitionOnce(n,function(){e.$hoverState!==HoverState.SHOW&&n.parentNode&&n.parentNode.removeChild(n),e.removeAriaDescribedby(),e.removePopper(),e.$tip=null,t&&t();var i=new BvEvent("hidden",{cancelable:!1,target:e.$element,relatedTarget:n});e.emitEvent(i)}),this.$hoverState=""}},ToolTip.prototype.emitEvent=function(t){var e=t.type;this.$root&&this.$root.$emit&&this.$root.$emit("bv::"+this.constructor.NAME+"::"+e,t);var n=this.$config.callbacks||{};"function"===n[e]&&n[e](t)},ToolTip.prototype.getContainer=function(){var t=this.$config.container,e=document.body;return!1===t?e:e.querySelector(t)||e},ToolTip.prototype.addAriaDescribedby=function(){var t=this.$element.getAttribute("aria-describedby")||"";t=t.split(/\s+/).concat(this.$id).join(" ").trim(),this.$element.setAttribute("aria-describedby",t)},ToolTip.prototype.removeAriaDescribedby=function(){var t=this.$element.getAttribute("aria-describedby")||"";(t=t.replace(this.$id,"").replace(/\s+/g," ").trim())?this.$element.setAttribute("aria-describedby",t):this.$element.removeAttribute("aria-describedby")},ToolTip.prototype.removePopper=function(){this.$popper&&this.$popper.destroy(),this.$popper=null},ToolTip.prototype.transitionOnce=function(t,e){var n=this,i=this.getTransitionEndEvents(),r=!1;clearTimeout(this.$fadeTimeout),this.$fadeTimeout=null;var o=function(){r||(r=!0,clearTimeout(n.$fadeTimeout),n.$fadeTimeout=null,i.forEach(function(e){t.removeEventListener(e,o)}),e())};t.classList.contains(ClassName$1.FADE)?(i.forEach(function(t){n.$tip.addEventListener(t,o)}),this.$fadeTimeout=setTimeout(o,TRANSITION_DURATION)):o()},ToolTip.prototype.getTransitionEndEvents=function(){var t=this;for(var e in TransitionEndEvents$1)if(void 0!==t.$element.style[e])return TransitionEndEvents$1[e];return[]},ToolTip.prototype.update=function(){null!==this.$popper&&this.$popper.scheduleUpdate()},ToolTip.prototype.isWithContent=function(t){return!!(t=t||this.$tip)&&Boolean((t.querySelector(Selector$1.TOOLTIP_INNER)||{}).innerHTML)},ToolTip.prototype.addAttachmentClass=function(t){this.getTipElement().classList.add(CLASS_PREFIX$1+"-"+t)},ToolTip.prototype.getTipElement=function(){return this.$tip||(this.$tip=this.compileTemplate(this.$config.template)||this.compileTemplate(this.constructor.Default.template)),this.$tip},ToolTip.prototype.compileTemplate=function(t){if(!t||"string"!=typeof t)return null;var e=document.createElement("div");e.innerHTML=t.trim();var n=e.firstElementChild?e.removeChild(e.firstElementChild):null;return e=null,n},ToolTip.prototype.setContent=function(t){this.setElementContent(t.querySelector(Selector$1.TOOLTIP_INNER),this.getTitle()),t.classList.remove(ClassName$1.FADE),t.classList.remove(ClassName$1.SHOW)},ToolTip.prototype.setElementContent=function(t,e){if(t){var n=this.$config.html;"object"==typeof e&&e.nodeType?n?e.parentElement!==t&&(t.innerHtml="",t.appendChild(e)):t.innerText=e.innerText:t[n?"innerHTML":"innerText"]=e}},ToolTip.prototype.getTitle=function(){var t=this.$config.title||"";return"function"==typeof t&&(t=t(this.$element)),"object"==typeof t&&t.nodeType&&!t.innerHTML.trim()&&(t=""),"string"==typeof t&&(t=t.trim()),t||(t=(t=this.$element.getAttribute("title")||this.$element.getAttribute("data-original-title")||"").trim()),t},ToolTip.getAttachment=function(t){return AttachmentMap$1[t.toUpperCase()]},ToolTip.prototype.listen=function(){var t=this;this.$config.trigger.trim().split(/\s+/).forEach(function(e){"click"===e?t.$element.addEventListener("click",t):"focus"===e?(t.$element.addEventListener("focusin",t),t.$element.addEventListener("focusout",t)):"hover"===e&&(t.$element.addEventListener("mouseenter",t),t.$element.addEventListener("mouseleave",t))},this),this.setModalListener(!0)},ToolTip.prototype.unListen=function(){var t=this;["click","focusin","focusout","mouseenter","mouseleave"].forEach(function(e){t.$element.removeEventListener(e,t)},this),this.setModalListener(!1)},ToolTip.prototype.handleEvent=function(t){t.target&&t.target===this.$element&&("click"===t.type?this.toggle(t):"focusin"===t.type||"mouseenter"===t.type?this.enter(t):"focusout"!==t.type&&"mouseleave"!==t.type||this.leave(t))},ToolTip.prototype.setModalListener=function(t){var e=this;this.$element.closest(MODAL_CLASS)&&this.$root&&(t?MODAL_CLOSE_EVENT.forEach(function(t){e.$root.$on(t,e.hide.bind(e))}):MODAL_CLOSE_EVENT.forEach(function(t){e.$root.$off(t,e.hide.bind(e))}))},ToolTip.prototype.setOnTouchStartListener=function(t){var e=this;"ontouchstart"in document.documentElement&&from(document.body.children).forEach(function(n){t?n.addEventListener("mouseover",e.noop):n.removeEventListener("mouseover",e.noop)})},ToolTip.prototype.noop=function(){},ToolTip.prototype.fixTitle=function(){var t=typeof this.$element.getAttribute("data-original-title");(this.$element.getAttribute("title")||"string"!==t)&&(this.$element.setAttribute("data-original-title",this.$element.getAttribute("title")||""),this.$element.setAttribute("title",""))},ToolTip.prototype.enter=function(t){var e=this;t&&(this.$activeTrigger["focusin"===t.type?"focus":"hover"]=!0),this.getTipElement().classList.contains(ClassName$1.SHOW)||this.$hoverState===HoverState.SHOW?this.$hoverState=HoverState.SHOW:(clearTimeout(this.$hoverTimeout),this.$hoverState=HoverState.SHOW,this.$config.delay&&this.$config.delay.show?this.$hoverTimeout=setTimeout(function(){e.$hoverState===HoverState.SHOW&&e.show()},this.$config.delay.show):this.show())},ToolTip.prototype.leave=function(t){var e=this;t&&(this.$activeTrigger["focusout"===t.type?"focus":"hover"]=!1),this.isWithActiveTrigger()||(clearTimeout(this.$hoverTimeout),this.$hoverState=HoverState.OUT,this.$config.delay&&this.$config.delay.hide?this.$hoverTimeout=setTimeout(function(){e.$hoverState===HoverState.OUT&&e.hide()},this.$config.delay.hide):this.hide())},ToolTip.prototype.getPopperConfig=function(t){var e=this;return{placement:t,modifiers:{offset:{offset:this.$config.offset||0},flip:{behavior:this.$config.fallbackPlacement},arrow:{element:".arrow"}},onCreate:function(t){t.originalPlacement!==t.placement&&e.handlePopperPlacementChange(t)},onUpdate:function(t){e.handlePopperPlacementChange(t)}}},ToolTip.prototype.getPlacement=function(){var t=this.$config.placement;return"function"==typeof t?t.call(this,this.$tip,this.$element):t},ToolTip.prototype.isWithActiveTrigger=function(){var t=this;for(var e in t.$activeTrigger)if(t.$activeTrigger[e])return!0;return!1},ToolTip.prototype.cleanTipClass=function(){var t=this.getTipElement(),e=t.className.match(BSCLS_PREFIX_REGEX$1);null!==e&&e.length>0&&e.forEach(function(e){t.classList.remove(e)})},ToolTip.prototype.handlePopperPlacementChange=function(t){this.cleanTipClass(),this.addAttachmentClass(this.constructor.getAttachment(t.placement))},ToolTip.prototype.fixTransition=function(t){var e=this.$config.animation;null===t.getAttribute("x-placement")&&(t.classList.remove(ClassName$1.FADE),this.$config.animation=!1,this.hide(),this.show(),this.config.animation=e)},Object.defineProperties(ToolTip,staticAccessors);var BvEvent=function t(e,n){if(void 0===n&&(n={}),!e)throw new TypeError("Failed to construct '"+this.constructor.name+"'. 1 argument required, "+arguments.length+" given.");assign(this,t.defaults(),n,{type:e}),defineProperties(this,{type:readonlyDescriptor(),cancelable:readonlyDescriptor(),nativeEvent:readonlyDescriptor(),target:readonlyDescriptor(),relatedTarget:readonlyDescriptor(),vueTarget:readonlyDescriptor()});var i=!1;this.preventDefault=function(){this.cancelable&&(i=!0)},defineProperty(this,"defaultPrevented",{enumerable:!0,get:function(){return i}})};BvEvent.defaults=function(){return{type:"",cancelable:!0,nativeEvent:null,target:null,relatedTarget:null,vueTarget:null}};var NAME="popover",CLASS_PREFIX="bs-popover",BSCLS_PREFIX_REGEX=new RegExp("\\b"+CLASS_PREFIX+"\\S+","g"),Defaults$1=assign({},ToolTip.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),ClassName={FADE:"fade",SHOW:"show"},Selector={TITLE:".popover-header",CONTENT:".popover-body"},PopOver=function(t){function e(){t.apply(this,arguments)}t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e;var n={Default:{},NAME:{}};return n.Default.get=function(){return Defaults$1},n.NAME.get=function(){return NAME},e.prototype.isWithContent=function(t){if(!(t=t||this.$tip))return!1;var e=Boolean((t.querySelector(Selector.TITLE)||{}).innerHTML),n=Boolean((t.querySelector(Selector.CONTENT)||{}).innerHTML);return e||n},e.prototype.addAttachmentClass=function(t){this.getTipElement().classList.add(CLASS_PREFIX+"-"+t)},e.prototype.setContent=function(t){this.setElementContent(t.querySelector(Selector.TITLE),this.getTitle()),this.setElementContent(t.querySelector(Selector.CONTENT),this.getContent()),t.classList.remove(ClassName.FADE),t.classList.remove(ClassName.SHOW)},e.prototype.cleanTipClass=function(){var t=this.getTipElement(),e=t.className.match(BSCLS_PREFIX_REGEX);null!==e&&e.length>0&&e.forEach(function(e){t.classList.remove(e)})},e.prototype.getTitle=function(){var t=this.$config.title||"";return"function"==typeof t&&(t=t(this.$element)),"object"==typeof t&&t.nodeType&&!t.innerHTML.trim()&&(t=""),"string"==typeof t&&(t=t.trim()),t||(t=(t=this.$element.getAttribute("title")||this.$element.getAttribute("data-original-title")||"").trim()),t},e.prototype.getContent=function(){var t=this.$config.content||"";return"function"==typeof t&&(t=t(this.$element)),"object"==typeof t&&t.nodeType&&!t.innerHTML.trim()&&(t=""),"string"==typeof t&&(t=t.trim()),t},Object.defineProperties(e,n),e}(ToolTip),popover={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticClass:"d-none",attrs:{"aria-hidden":"true"}},[n("div",{ref:"title"},[t._t("title")],2),n("div",{ref:"content"},[t._t("default")],2)])},staticRenderFns:[],data:function(){return{popOver:null}},props:{targetId:{type:String,default:null,required:!0},title:{type:String,default:""},content:{type:String,default:""},triggers:{type:[String,Array],default:"click"},placement:{type:String,default:"right"},delay:{type:Number,default:0},offset:{type:[Number,String],default:0}},mounted:function(){if(this.targetId){var t=this.targetId;if(!t)return;(t=document.getElementById(/^#/.test(t)?t.slice(1):t))&&!this.popOver&&(this.popOver=new PopOver(t,this.getConfig(),this.$root),this.$on("close",this.onClose),observeDOM(this.$refs.content,this.updatePosition.bind(this),{subtree:!0,childList:!0,attributes:!0,attributeFilter:["class","style"]}))}},updated:function(){this.popOver&&this.popOver.updateConfig(this.getConfig())},destroyed:function(){this.popOver&&(this.$el.appendChild(this.$refs.title),this.$el.appendChild(this.$refs.content),this.popOver.destroy(),this.popOver=null),this.$off("close",this.onClose)},computed:{baseConfig:function(){var t=this;return{title:this.title.trim()||"",content:this.content.trim()||"",placement:this.placement||"top",delay:this.delay||0,offset:this.offset||0,triggers:isArray(this.triggers)?this.triggers.join(" "):this.triggers,callbacks:{show:function(e){return t.$emit("show",e)},shown:function(){return t.$emit("shown")},hide:function(e){return t.$emit("hide",e)},hidden:function(){return t.$emit("hidden")}}}}},methods:{onClose:function(t){this.popOver?this.popOver.hide(t):"function"==typeof t&&t()},updatePosition:function(){this.popOver&&this.popOver.update()},getConfig:function(){var t=assign({},this.baseConfig);return this.$refs.title.innerHTML.trim()&&(t.title=this.$refs.title,t.html=!0),this.$refs.content.innerHTML.trim()&&(t.content=this.$refs.content,t.html=!0),t}}},bProgressBar={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.progressBarClasses,style:t.progressBarStyles,attrs:{role:"progressbar","aria-valuenow":t.value.toFixed(t.computedPrecision),"aria-valuemin":"0","aria-valuemax":t.computedMax}},[t._t("default",[t.label?n("span",{domProps:{innerHTML:t._s(t.label)}}):t.computedShowProgress?[t._v(t._s(t.progress.toFixed(t.computedPrecision))+"%")]:t.computedShowValue?[t._v(t._s(t.value.toFixed(t.computedPrecision)))]:t._e()])],2)},staticRenderFns:[],computed:{progressBarClasses:function(){return["progress-bar",this.computedVariant?"bg-"+this.computedVariant:"",this.computedStriped||this.computedAnimated?"progress-bar-striped":"",this.computedAnimated?"progress-bar-animated":""]},progressBarStyles:function(){return{width:this.value/this.computedMax*100+"%",height:this.computedHeight,lineHeight:this.computedHeight}},progress:function(){var t=Math.pow(10,this.computedPrecision);return Math.round(100*t*this.value/this.computedMax)/t},computedMax:function(){return"number"==typeof this.max?this.max:this.$parent.max||100},computedHeight:function(){return this.$parent.height||this.height||"1rem"},computedVariant:function(){return this.variant||this.$parent.variant},computedPrecision:function(){return"number"==typeof this.precision?this.precision:this.$parent.precision||0},computedStriped:function(){return"boolean"==typeof this.striped?this.striped:this.$parent.striped||!1},computedAnimated:function(){return"boolean"==typeof this.animated?this.animated:this.$parent.animated||!1},computedShowProgress:function(){return"boolean"==typeof this.showProgress?this.showProgress:this.$parent.showProgress||!1},computedShowValue:function(){return"boolean"==typeof this.showValue?this.showValue:this.$parent.showValue||!1}},props:{value:{type:Number,default:0},label:{type:String,value:null},max:{type:Number,default:null},precision:{type:Number,default:null},variant:{type:String,default:null},striped:{type:Boolean,default:null},animated:{type:Boolean,default:null},showProgress:{type:Boolean,default:null},showValue:{type:Boolean,default:null},height:{type:String,default:null}}},progress={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"progress"},[t._t("default",[n("b-progress-bar",{attrs:{value:t.value,max:t.max,precision:t.precision,variant:t.variant,animated:t.animated,striped:t.striped,"show-progress":t.showProgress,"show-value":t.showValue,height:t.height}})])],2)},staticRenderFns:[],components:{bProgressBar:bProgressBar},props:{variant:{type:String,default:null},striped:{type:Boolean,default:!1},animated:{type:Boolean,default:!1},height:{type:String,default:"1rem"},precision:{type:Number,default:0},showProgress:{type:Boolean,default:!1},showValue:{type:Boolean,default:!1},max:{type:Number,default:100},value:{type:Number,default:0}}},commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},INFINITY=1/0,symbolTag="[object Symbol]",reAsciiWord=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,reLatin=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,rsAstralRange="\\ud800-\\udfff",rsComboMarksRange="\\u0300-\\u036f\\ufe20-\\ufe23",rsComboSymbolsRange="\\u20d0-\\u20f0",rsDingbatRange="\\u2700-\\u27bf",rsLowerRange="a-z\\xdf-\\xf6\\xf8-\\xff",rsMathOpRange="\\xac\\xb1\\xd7\\xf7",rsNonCharRange="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",rsPunctuationRange="\\u2000-\\u206f",rsSpaceRange=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",rsUpperRange="A-Z\\xc0-\\xd6\\xd8-\\xde",rsVarRange="\\ufe0e\\ufe0f",rsBreakRange=rsMathOpRange+rsNonCharRange+rsPunctuationRange+rsSpaceRange,rsApos="['’]",rsAstral="["+rsAstralRange+"]",rsBreak="["+rsBreakRange+"]",rsCombo="["+rsComboMarksRange+rsComboSymbolsRange+"]",rsDigits="\\d+",rsDingbat="["+rsDingbatRange+"]",rsLower="["+rsLowerRange+"]",rsMisc="[^"+rsAstralRange+rsBreakRange+rsDigits+rsDingbatRange+rsLowerRange+rsUpperRange+"]",rsFitz="\\ud83c[\\udffb-\\udfff]",rsModifier="(?:"+rsCombo+"|"+rsFitz+")",rsNonAstral="[^"+rsAstralRange+"]",rsRegional="(?:\\ud83c[\\udde6-\\uddff]){2}",rsSurrPair="[\\ud800-\\udbff][\\udc00-\\udfff]",rsUpper="["+rsUpperRange+"]",rsZWJ="\\u200d",rsLowerMisc="(?:"+rsLower+"|"+rsMisc+")",rsUpperMisc="(?:"+rsUpper+"|"+rsMisc+")",rsOptLowerContr="(?:"+rsApos+"(?:d|ll|m|re|s|t|ve))?",rsOptUpperContr="(?:"+rsApos+"(?:D|LL|M|RE|S|T|VE))?",reOptMod=rsModifier+"?",rsOptVar="["+rsVarRange+"]?",rsOptJoin="(?:"+rsZWJ+"(?:"+[rsNonAstral,rsRegional,rsSurrPair].join("|")+")"+rsOptVar+reOptMod+")*",rsSeq=rsOptVar+reOptMod+rsOptJoin,rsEmoji="(?:"+[rsDingbat,rsRegional,rsSurrPair].join("|")+")"+rsSeq,rsSymbol="(?:"+[rsNonAstral+rsCombo+"?",rsCombo,rsRegional,rsSurrPair,rsAstral].join("|")+")",reApos=RegExp(rsApos,"g"),reComboMark=RegExp(rsCombo,"g"),reUnicode=RegExp(rsFitz+"(?="+rsFitz+")|"+rsSymbol+rsSeq,"g"),reUnicodeWord=RegExp([rsUpper+"?"+rsLower+"+"+rsOptLowerContr+"(?="+[rsBreak,rsUpper,"$"].join("|")+")",rsUpperMisc+"+"+rsOptUpperContr+"(?="+[rsBreak,rsUpper+rsLowerMisc,"$"].join("|")+")",rsUpper+"?"+rsLowerMisc+"+"+rsOptLowerContr,rsUpper+"+"+rsOptUpperContr,rsDigits,rsEmoji].join("|"),"g"),reHasUnicode=RegExp("["+rsZWJ+rsAstralRange+rsComboMarksRange+rsComboSymbolsRange+rsVarRange+"]"),reHasUnicodeWord=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,deburredLetters={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"ss"},freeGlobal="object"==typeof commonjsGlobal&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal,freeSelf="object"==typeof self&&self&&self.Object===Object&&self,root=freeGlobal||freeSelf||Function("return this")(),deburrLetter=basePropertyOf(deburredLetters),objectProto=Object.prototype,objectToString=objectProto.toString,Symbol=root.Symbol,symbolProto=Symbol?Symbol.prototype:void 0,symbolToString=symbolProto?symbolProto.toString:void 0,startCase=createCompounder(function(t,e,n){return t+(n?" ":"")+upperFirst$1(e)}),upperFirst$1=createCaseFirst("toUpperCase"),lodash_startcase$1=startCase,toString=function(t){return t?t instanceof Object?keys(t).map(function(e){return toString(t[e])}).join(" "):String(t):""},recToString=function(t){return t instanceof Object?toString(keys(t).reduce(function(e,n){return/^_/.test(n)||"state"===n||(e[n]=t[n]),e},{})):""},defaultSortCompare=function(t,e,n){return"number"==typeof t[n]&&"number"==typeof e[n]?t[n]<e[n]&&-1||t[n]>e[n]&&1||0:toString(t[n]).localeCompare(toString(e[n]),void 0,{numeric:!0})},table={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("table",{class:t.tableClass,attrs:{id:t.id||null,"aria-busy":t.computedBusy?"true":"false"}},[n("thead",{class:t.headClass},[n("tr",t._l(t.computedFields,function(e,i){return n("th",{key:i,class:t.fieldClass(e,i),style:e.thStyle||{},attrs:{"aria-label":e.sortable?t.localSortDesc&&t.localSortBy===i?t.labelSortAsc:t.labelSortDesc:null,"aria-sort":e.sortable&&t.localSortBy===i?t.localSortDesc?"descending":"ascending":null,tabindex:e.sortable?"0":null},on:{click:function(n){n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)},keydown:[function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13))return null;n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)},function(n){if(!("button"in n)&&t._k(n.keyCode,"space",32))return null;n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)}]}},[t._t("HEAD_"+i,[n("div",{domProps:{innerHTML:t._s(e.label)}})],{label:e.label,column:i,field:e})],2)}))]),t.footClone?n("tfoot",{class:t.footClass},[n("tr",t._l(t.computedFields,function(e,i){return n("th",{key:i,class:t.fieldClass(e,i),style:e.thStyle||{},attrs:{"aria-label":e.sortable?t.localSortDesc&&t.localSortBy===i?t.labelSortAsc:t.labelSortDesc:null,"aria-sort":e.sortable&&t.localSortBy===i?t.localSortDesc?"descending":"ascending":null,tabindex:e.sortable?"0":null},on:{click:function(n){n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)},keydown:[function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13))return null;n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)},function(n){if(!("button"in n)&&t._k(n.keyCode,"space",32))return null;n.stopPropagation(),n.preventDefault(),t.headClicked(n,e,i)}]}},[t.$scopedSlots["FOOT_"+i]?t._t("FOOT_"+i,[n("div",{domProps:{innerHTML:t._s(e.label)}})],{label:e.label,column:i,field:e}):t._t("HEAD_"+i,[n("div",{domProps:{innerHTML:t._s(e.label)}})],{label:e.label,column:i,field:e})],2)}))]):t._e(),n("tbody",[t.$scopedSlots["top-row"]?n("tr",[t._t("top-row",null,{columns:t.keys(t.fields).length,fields:t.fields})],2):t._e(),t._l(t.computedItems,function(e,i){return n("tr",{key:i,class:t.rowClass(e),on:{click:function(n){t.rowClicked(n,e,i)},dblclick:function(n){t.rowDblClicked(n,e,i)},mouseenter:function(n){t.rowHovered(n,e,i)}}},[t._l(t.computedFields,function(r,o){return[n("td",{key:o,class:t.tdClass(r,e,o)},[t._t(o,[t._v(t._s(e[o]))],{value:e[o],item:e,index:i})],2)]})],2)}),!t.showEmpty||t.computedItems&&0!==t.computedItems.length?t._e():n("tr",[n("td",{attrs:{colspan:t.keys(t.computedFields).length}},[t.filter?n("div",{attrs:{role:"alert","aria-live":"polite"}},[t._t("emptyfiltered",[n("div",{staticClass:"text-center my-2",domProps:{innerHTML:t._s(t.emptyFilteredText)}})])],2):n("div",{attrs:{role:"alert","aria-live":"polite"}},[t._t("empty",[n("div",{staticClass:"text-center my-2",domProps:{innerHTML:t._s(t.emptyText)}})])],2)])]),t.$scopedSlots["bottom-row"]?n("tr",[t._t("bottom-row",null,{columns:t.keys(t.fields).length,fields:t.fields})],2):t._e()],2)])},staticRenderFns:[],mixins:[listenOnRootMixin],data:function(){return{localSortBy:this.sortBy||"",localSortDesc:this.sortDesc||!1,localItems:[],filteredItems:[],localBusy:this.busy}},props:{id:{type:String,default:""},items:{type:[Array,Function],default:function(){return[]}},sortBy:{type:String,default:null},sortDesc:{type:Boolean,default:!1},apiUrl:{type:String,default:""},fields:{type:[Object,Array],default:null},striped:{type:Boolean,default:!1},bordered:{type:Boolean,default:!1},inverse:{type:Boolean,default:!1},hover:{type:Boolean,default:!1},small:{type:Boolean,default:!1},responsive:{type:Boolean,default:!1},headVariant:{type:String,default:""},footVariant:{type:String,default:""},perPage:{type:Number,default:null},currentPage:{type:Number,default:1},filter:{type:[String,RegExp,Function],default:null},sortCompare:{type:Function,default:null},noProviderPaging:{type:Boolean,default:!1},noProviderSorting:{type:Boolean,default:!1},noProviderFiltering:{type:Boolean,default:!1},busy:{type:Boolean,default:!1},value:{type:Array,default:function(){return[]}},footClone:{type:Boolean,default:!1},labelSortAsc:{type:String,default:"Click to sort Ascending"},labelSortDesc:{type:String,default:"Click to sort Descending"},showEmpty:{type:Boolean,default:!1},emptyText:{type:String,default:"There are no records to show"},emptyFilteredText:{type:String,default:"There are no records matching your request"}},watch:{items:function(t,e){e!==t&&this._providerUpdate()},filteredItems:function(t,e){this.providerFiltering||t.length===e.length||this.$emit("filtered",t)},sortDesc:function(t,e){t!==this.localSortDesc&&(this.localSortDesc=t||!1)},localSortDesc:function(t,e){t!==e&&(this.$emit("update:sortDesc",t),this.noProviderSorting||this._providerUpdate())},sortBy:function(t,e){t!==this.localSortBy&&(this.localSortBy=t||null)},localSortBy:function(t,e){t!==e&&(this.$emit("update:sortBy",t),this.noProviderSorting||this._providerUpdate())},perPage:function(t,e){e===t||this.noProviderPaging||this._providerUpdate()},currentPage:function(t,e){e===t||this.noProviderPaging||this._providerUpdate()},filter:function(t,e){e===t||this.noProviderFiltering||this._providerUpdate()},localBusy:function(t,e){t!==e&&this.$emit("update:busy",t)}},mounted:function(){var t=this;this.localSortBy=this.sortBy,this.localSortDesc=this.sortDesc,this.localBusy=this.busy,this.hasProvider&&this._providerUpdate(),this.listenOnRoot("table::refresh",function(e){e===t.id&&t._providerUpdate()})},computed:{tableClass:function(){return["table","b-table",this.striped?"table-striped":"",this.hover?"table-hover":"",this.inverse?"table-inverse":"",this.bordered?"table-bordered":"",this.responsive?"table-responsive":"",this.small?"table-sm":""]},headClass:function(){return this.headVariant?"thead-"+this.headVariant:""},footClass:function(){var t=this.footVariant||this.headVariant||null;return t?"thead-"+t:""},hasProvider:function(){return this.items instanceof Function},providerFiltering:function(){return Boolean(this.hasProvider&&!this.noProviderFiltering)},providerSorting:function(){return Boolean(this.hasProvider&&!this.noProviderSorting)},providerPaging:function(){return Boolean(this.hasProvider&&!this.noProviderPaging)},context:function(){return{perPage:this.perPage,currentPage:this.currentPage,filter:this.filter,apiUrl:this.apiUrl,sortBy:this.localSortBy,sortDesc:this.localSortDesc}},computedFields:function(){var t;if(isArray(this.fields)?(t={},this.fields.filter(function(t){return t}).forEach(function(e){t[e.key||e]=e})):t=this.fields||{},0===keys(t).length&&this.computedItems.length>0){var e=this.computedItems[0];keys(e).forEach(function(e){t[e]=!0})}return keys(t).forEach(function(e){!1!==t[e]?!0!==t[e]?"function"!=typeof t[e]?"string"==typeof t[e]&&(t[e]={label:lodash_startcase$1(e)}):t[e]={label:lodash_startcase$1(e),formatter:t[e]}:t[e]={label:lodash_startcase$1(e)}:delete t[e]}),t},computedItems:function(){var t=this,e=this.perPage,n=this.currentPage,i=this.filter,r=this.localSortBy,o=this.localSortDesc,s=this.sortCompare||defaultSortCompare,a=this.hasProvider?this.localItems:this.items;if(!a)return this.$nextTick(this._providerUpdate),[];if(a=JSON.parse(JSON.stringify(a)),this.fields&&"[object Object]"===this.fields.toString()&&keys(this.fields).filter(function(e,n,i){return t.hasFormatter(t.fields[e])}).forEach(function(e){a.forEach(function(n){n[e]=t.callFormatter(n,e,t.fields[e])},t)},this),i&&!this.providerFiltering)if(i instanceof Function)a=a.filter(i);else{var l;l=i instanceof RegExp?i:new RegExp(".*"+i+".*","ig"),a=a.filter(function(t){var e=l.test(recToString(t));return l.lastIndex=0,e})}return this.providerFiltering||(this.filteredItems=a.slice()),r&&!this.providerSorting&&(a=a.sort(function(t,e){var n=s(t,e,r);return o?-1*n:n})),e&&!this.providerPaging&&(a=a.slice((n-1)*e,n*e)),this.$emit("input",a),a},computedBusy:function(){return this.busy||this.localBusy}},methods:{keys:keys,fieldClass:function(t,e){return[t.sortable?"sorting":"",t.sortable&&this.localSortBy===e?"sorting_"+(this.localSortDesc?"desc":"asc"):"",t.variant?"table-"+t.variant:"",t.class?t.class:"",t.thClass?t.thClass:""]},tdClass:function(t,e,n){var i="";return e._cellVariants&&e._cellVariants[n]&&(i=(this.inverse?"bg-":"table-")+e._cellVariants[n]),[t.variant&&!i?(this.inverse?"bg-":"table-")+t.variant:"",i,t.class?t.class:"",t.tdClass?t.tdClass:""]},rowClass:function(t){return[t._rowVariant?(this.inverse?"bg-":"table-")+t._rowVariant:""]},rowClicked:function(t,e,n){if(this.computedBusy)return t.preventDefault(),void t.stopPropagation();this.$emit("row-clicked",e,n,t)},rowDblClicked:function(t,e,n){if(this.computedBusy)return t.preventDefault(),void t.stopPropagation();this.$emit("row-dblclicked",e,n,t)},rowHovered:function(t,e,n){if(this.computedBusy)return t.preventDefault(),void t.stopPropagation();this.$emit("row-hovered",e,n,t)},headClicked:function(t,e,n){if(this.computedBusy)return t.preventDefault(),void t.stopPropagation();var i=!1;e.sortable?(n===this.localSortBy?this.localSortDesc=!this.localSortDesc:(this.localSortBy=n,this.localSortDesc=!1),i=!0):this.localSortBy&&(this.localSortBy=null,this.localSortDesc=!1,i=!0),this.$emit("head-clicked",n,e,t),i&&this.$emit("sort-changed",this.context)},refresh:function(){this.hasProvider&&this._providerUpdate()},_providerSetLocal:function(t){this.localItems=t&&t.length>0?t.slice():[],this.localBusy=!1,this.$emit("refreshed"),this.emitOnRoot("table::refreshed",this.id)},_providerUpdate:function(){var t=this;if(!this.computedBusy&&this.hasProvider){this.localBusy=!0;var e=this.items(this.context,this._providerSetLocal);e&&(e.then&&"function"==typeof e.then?e.then(function(e){t._providerSetLocal(e)}):this._providerSetLocal(e))}},hasFormatter:function(t){return t.formatter&&("function"==typeof t.formatter||"string"==typeof t.formatter)},callFormatter:function(t,e,n){return n.formatter&&"function"==typeof n.formatter?n.formatter(t[e],e,t):n.formatter&&"function"==typeof this.$parent[n.formatter]?this.$parent[n.formatter](t[e],e,t):void 0}}},tabs={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n(t.tag,{tag:"component",staticClass:"tabs",attrs:{id:t.safeId()}},[t.bottom?n("div",{ref:"tabsContainer",class:["tab-content",{"card-body":t.card}],attrs:{id:t.safeId("_BV_tab_container_")}},[t._t("default"),t.tabs&&t.tabs.length?t._e():t._t("empty")],2):t._e(),n("div",{class:{"card-header":t.card}},[n("ul",{class:["nav","nav-"+t.navStyle,t.card?"card-header-"+t.navStyle:null],attrs:{role:"tablist",tabindex:"0"},on:{keydown:[function(e){return"button"in e||!t._k(e.keyCode,"left",37)?"button"in e&&0!==e.button?null:void t.previousTab(e):null},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;t.previousTab(e)},function(e){return"button"in e||!t._k(e.keyCode,"right",39)?"button"in e&&2!==e.button?null:void t.nextTab(e):null},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;t.nextTab(e)},function(e){return("button"in e||!t._k(e.keyCode,"left",37))&&e.shiftKey?"button"in e&&0!==e.button?null:void t.setTab(0,!1,1):null},function(e){return("button"in e||!t._k(e.keyCode,"up",38))&&e.shiftKey?void t.setTab(0,!1,1):null},function(e){return("button"in e||!t._k(e.keyCode,"right",39))&&e.shiftKey?"button"in e&&2!==e.button?null:void t.setTab(t.tabs.length-1,!1,-1):null},function(e){return("button"in e||!t._k(e.keyCode,"down",40))&&e.shiftKey?void t.setTab(t.tabs.length-1,!1,-1):null}]}},[t._l(t.tabs,function(e,i){return n("li",{staticClass:"nav-item",attrs:{role:"presentation"}},[e.headHtml?n("div",{class:["tab-head",{small:t.small,active:e.localActive,disabled:e.disabled}],attrs:{role:"heading",tabindex:"-1"},domProps:{innerHTML:t._s(e.headHtml)}}):n("a",{class:["nav-link",{small:t.small,active:e.localActive,disabled:e.disabled}],attrs:{href:e.href,role:"tab","aria-setsize":t.tabs.length,"aria-posinset":t.currentTab+1,"aria-selected":e.localActive?"true":"false","aria-expanded":e.localActive?"true":"false","aria-controls":t.safeId("_BV_tab_container_"),"aria-disabled":e.disabled,id:e.controlledBy||t.safeId("_BV_tab_${index+1}_"),tabindex:"-1"},domProps:{innerHTML:t._s(e.title)},on:{click:function(e){e.preventDefault(),e.stopPropagation(),t.setTab(i)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;e.preventDefault(),e.stopPropagation(),t.setTab(i)},function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),e.stopPropagation(),t.setTab(i)}]}})])}),t._t("tabs")],2)]),t.bottom?t._e():n("div",{ref:"tabsContainer",class:["tab-content",{"card-body":t.card}],attrs:{id:t.safeId("_BV_tab_container_")}},[t._t("default"),t.tabs&&t.tabs.length?t._e():t._t("empty")],2)])},staticRenderFns:[],mixins:[idMixin],data:function(){return{currentTab:this.value,tabs:[]}},props:{tag:{type:String,default:"div"},card:{type:Boolean,default:!1},small:{type:Boolean,default:!1},value:{type:Number,default:null},pills:{type:Boolean,default:!1},bottom:{type:Boolean,default:!1},noFade:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1}},watch:{currentTab:function(t,e){t!==e&&(this.$root.$emit("changed::tab",this,t,this.tabs[t]),this.$emit("input",t),this.tabs[t].$emit("click"))},value:function(t,e){if(t!==e){"number"!=typeof e&&(e=0);var n=t<e?-1:1;this.setTab(t,!1,n)}}},computed:{fade:function(){return!this.noFade},navStyle:function(){return this.pills?"pills":"tabs"}},methods:{sign:function(t){return 0===t?0:t>0?1:-1},nextTab:function(){this.setTab(this.currentTab+1,!1,1)},previousTab:function(){this.setTab(this.currentTab-1,!1,-1)},setTab:function(t,e,n){var i=this;if(n=this.sign(n||0),t=t||0,e||t!==this.currentTab){var r=this.tabs[t];r?r.disabled?n&&this.setTab(t+n,e,n):(this.tabs.forEach(function(t){t===r?i.$set(t,"localActive",!0):i.$set(t,"localActive",!1)}),this.currentTab=t):this.$emit("input",this.currentTab)}},updateTabs:function(){this.tabs=this.$children.filter(function(t){return t._isTab});var t=null;if(this.tabs.forEach(function(e,n){e.localActive&&!e.disabled&&(t=n)}),null===t){if(this.currentTab>=this.tabs.length)return void this.setTab(this.tabs.length-1,!0,-1);this.tabs[this.currentTab]&&!this.tabs[this.currentTab].disabled&&(t=this.currentTab)}null===t&&this.tabs.forEach(function(e,n){e.disabled||null!==t||(t=n)}),this.setTab(t||0,!0,0)}},mounted:function(){this.updateTabs(),observeDOM(this.$refs.tabsContainer,this.updateTabs.bind(this),{subtree:!1})}},tab={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{mode:"out-in"},on:{"before-enter":t.beforeEnter,"after-enter":t.afterEnter,"after-leave":t.afterLeave}},[t.localActive||!t.computedLazy?n(t.tag,{directives:[{name:"show",rawName:"v-show",value:t.localActive,expression:"localActive"}],ref:"panel",tag:"component",class:t.tabClasses,attrs:{id:t.safeId(),role:"tabpanel","aria-hidden":t.localActive?"false":"true","aria-expanded":t.localActive?"true":"false","aria-lablelledby":t.controlledBy||null}},[t._t("default")],2):t._e()],1)},staticRenderFns:[],mixins:[idMixin],methods:{beforeEnter:function(){this.show=!1},afterEnter:function(){this.show=!0},afterLeave:function(){this.show=!1}},data:function(){return{localActive:this.active&&!this.disabled,show:!1}},mounted:function(){this.show=this.localActive},computed:{tabClasses:function(){return["tab-pane",this.show?"show":"",this.computedFade?"fade":"",this.disabled?"disabled":"",this.localActive?"active":""]},controlledBy:function(){return this.buttonId||this.safeId("__BV_tab_button__")},computedFade:function(){return this.$parent.fade},computedLazy:function(){return this.$parent.lazy},_isTab:function(){return!0}},props:{active:{type:Boolean,default:!1},tag:{type:String,default:"div"},buttonId:{type:String,default:""},title:{type:String,default:""},headHtml:{type:String,default:null},disabled:{type:Boolean,default:!1},href:{type:String,default:"#"}}},tooltip={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticClass:"d-none",attrs:{"aria-hidden":"true"}},[n("div",{ref:"title"},[t._t("default")],2)])},staticRenderFns:[],data:function(){return{toolTip:null}},props:{targetId:{type:String,default:null,required:!0},title:{type:String,default:""},triggers:{type:[String,Array],default:"hover focus"},placement:{type:String,default:"top"},delay:{type:Number,default:0},offset:{type:[Number,String],default:0}},mounted:function(){if(this.targetId){var t=document.body.querySelector("#"+this.targetId);t&&!this.toolTip&&(this.toolTip=new ToolTip(t,this.getConfig(),this.$root),observeDOM(this.$refs.title,this.updatePosition.bind(this),{subtree:!0,childList:!0,attributes:!0,attributeFilter:["class","style"]}))}},updated:function(){this.toolTip&&this.toolTip.updateConfig(this.getConfig())},destroyed:function(){this.toolTip&&(this.$el.appendChild(this.$refs.title),this.toolTip.destroy(),this.tooltip=null)},computed:{baseConfig:function(){var t=this;return{title:this.title.trim()||"",placement:this.placement||"top",delay:this.delay||0,offset:this.offset||0,triggers:isArray(this.triggers)?this.triggers.join(" "):this.triggers,callbacks:{show:function(e){return t.$emit("show",e)},shown:function(){return t.$emit("shown")},hide:function(e){return t.$emit("hide",e)},hidden:function(){return t.$emit("hidden")}}}}},methods:{updatePosition:function(){this.toolTip&&this.toolTip.update()},getConfig:function(){var t=assign({},this.baseConfig);return this.$refs.title.innerHTML.trim()&&(t.title=this.$refs.title,t.html=!0),t}}},components=Object.freeze({bAlert:alert,bBreadcrumb:breadcrumb,bBreadcrumbItem:BreadcrumbItem,bBreadcrumbLink:BreadcrumbLink,bButton:bBtn,bBtn:bBtn,bButtonToolbar:buttonToolbar,bBtnToolbar:buttonToolbar,bButtonGroup:buttonGroup,bBtnGroup:buttonGroup,bInputGroup:inputGroup,bInputGroupAddon:bInputGroupAddon,bInputGroupButton:inputGroupButton,bInputGroupBtn:inputGroupButton,bCol:col,bContainer:Container,bCard:card,bCardBody:CardBody,bCardHeader:CardHeader,bCardFooter:CardFooter,bCardGroup:cardGroup,bCardImg:CardImg,bDropdown:dropdown,bDd:dropdown,bDropdownItem:dropdownItem,bDdItem:dropdownItem,bDropdownItemButton:dropdownItemButton,bDdItemBtn:dropdownItemButton,bDdItemButton:dropdownItemButton,bDropdownItemBtn:dropdownItemButton,bDropdownDivider:dropdownDivider,bDdDivider:dropdownDivider,bDropdownHeader:dropdownHeader,bDdHeader:dropdownHeader,bForm:Form,bFormRow:bFormRow,bFormText:bFormText,bFormFeedback:bFormFeedback,bFormCheckbox:formCheckbox,bFormGroup:formGroup,bFormFieldset:formGroup,bFormFile:formFile,bFormRadio:formRadio,bFormInput:formInput,bFormTextarea:formTextarea,bFormSelect:formSelect,bImg:bImg,bJumbotron:jumbotron,bBadge:badge,bMedia:media,bMediaBody:MediaBody,bMediaAside:MediaAside,bModal:modal,bNavbar:navbar,bNavbarBrand:navbarBrand,bNavText:navText,bNavForm:navForm,bRow:row,bPagination:pagination,bPaginationNav:paginationNav,bPopover:popover,bProgressBar:bProgressBar,bProgress:progress,bTable:table,bTooltip:tooltip,bTab:tab,bTabs:tabs,bNav:nav,bNavItem:navItem,bNavItemDropdown:navItemDropdown,bNavToggle:navToggle,bListGroupItem:listGroupItem,bListGroup:listGroup,bCarouselSlide:carouselSlide,bCarousel:carousel,bCollapse:collapse,bLink:bLink}),all_listen_types={hover:!0,click:!0,focus:!0},inBrowser$1="undefined"!=typeof window,listen_types={click:!0},BVT="__BV_toggle__",EVENT_TOGGLE="collapse::toggle",EVENT_STATE="collapse::toggle::state",toggle={bind:function(t,e,n){var i=targets(n,e,listen_types,function(t){var e=t.targets,n=t.vnode;e.forEach(function(t){n.context.$root.$emit(EVENT_TOGGLE,t)})});inBrowser$1&&n.context&&i.length>0&&(t.setAttribute("aria-controls",i.join(" ")),t.setAttribute("aria-expanded","false"),t[BVT]=function(e,n){-1!==i.indexOf(e)&&(t.setAttribute("aria-expanded",n?"true":"false"),n?t.classList.remove("collapsed"):t.classList.add("collapsed"))},n.context.$root.$on(EVENT_STATE,t[BVT]))},unbind:function(t,e,n){t[BVT]&&(n.context.$root.$off(EVENT_STATE,t[BVT]),t[BVT]=null)}},listen_types$1={click:!0},modal$1={bind:function(t,e,n){targets(n,e,listen_types$1,function(t){var e=t.targets,n=t.vnode;e.forEach(function(t){n.context.$root.$emit("show::modal",t,n.elm)})})}},inBrowser$2="undefined"!=typeof window,isServer=!inBrowser$2;inBrowser$2&&window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(t){var e,n=(this.document||this.ownerDocument).querySelectorAll(t),i=this;do{for(e=n.length;--e>=0&&n.item(e)!==i;);}while(e<0&&(i=i.parentElement));return i});var NAME$2="v-b-scrollspy",EVENT="scrollspy::activate",BVSS="__BV_ScrollSpy__",Default={element:"body",offset:10,method:"auto",throttle:100},DefaultType={element:"(string|element)",offset:"number",method:"string",throttle:"number"},ClassName$2={DROPDOWN_ITEM:"dropdown-item",DROPDOWN_MENU:"dropdown-menu",DROPDOWN_TOGGLE:"dropdown-toggle",NAV_LINK:"nav-link",LIST_ITEM:"list-group-item",ACTIVE:"active"},Selector$2={ACTIVE:".active",NAV_LIST_GROUP:".nav, .list-group",NAV:".nav",LIST_GROUP:".list-group",NAV_LINKS:".nav-link",LIST_ITEMS:".list-group-item",DROPDOWN:".dropdown",DROPDOWN_ITEMS:".dropdown-item",DROPDOWN_TOGGLE:".dropdown-toggle"},OffsetMethod={OFFSET:"offset",POSITION:"position"};ScrollSpy.prototype.updateConfig=function(t){var e=this;t.arg&&(this._config.element="#"+t.arg),keys(t.modifiers).forEach(function(t){/^\d+$/.test(t)?e._config.offset=parseInt(t,10):/^(auto|position|offset)$/.test(t)&&(e._config.method=t)}),"string"==typeof t.value?this._config.element=t.value:"number"==typeof t.value?this._config.offset=Math.round(t.value):"object"==typeof t.value&&keys(t.value).filter(function(t){return Boolean(DefaultType[t])}).forEach(function(n){e._config[n]=t.value[n]}),typeCheckConfig(NAME$2,this._config,DefaultType);var n=getVm(this._$el);return!this._$root&&n&&n.$root&&(this._$root=n.$root),this},ScrollSpy.prototype.listen=function(){var t=this._getScroller();return t&&("BODY"!==t.tagName&&t.addEventListener("scroll",this,!1),window.addEventListener("scroll",this,!1),window.addEventListener("orientationchange",this,!1),window.addEventListener("resize",this,!1)),this},ScrollSpy.prototype.unListen=function(){var t=this._getScroller();return t&&("BODY"!==t.tagName&&t.removeEventListener("scroll",this,!1),window.removeEventListener("scroll",this,!1),window.removeEventListener("orientationchange",this,!1),window.removeEventListener("resize",this,!1)),this},ScrollSpy.prototype.refresh=function(){var t=this,e=this._getScroller();if(!e)return this;var n="BODY"===e.tagName?OffsetMethod.OFFSET:OffsetMethod.POSITION,i="auto"===this._config.method?n:this._config.method,r=i===OffsetMethod.OFFSET?0:this._getScrollTop();return this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),$QSA(this._selector,this._$el).map(function(t){var n=t.getAttribute("href");if(n&&"#"===n.charAt(0)&&"#"!==n&&-1===n.indexOf("#/")){var o=$QS(n,e);if(!o)return null;var s=o.getBoundingClientRect();if(s.width||s.height)return{offset:(i===OffsetMethod.OFFSET?s.top:o.offsetTop)+r,href:n}}return null}).filter(function(t){return t}).sort(function(t,e){return t.offset-e.offset}).forEach(function(e){t._offsets.push(e.offset),t._targets.push(e.href)}),this},ScrollSpy.prototype.process=function(){var t=this;if(!this._getScroller)return this;var e=this._getScrollTop()+this._config.offset,n=this._getScrollHeight(),i=this._config.offset+n-this._getOffsetHeight();if(this._scrollHeight!==n&&this.refresh(),e>=i){var r=this._targets[this._targets.length-1];return this._activeTarget!==r&&this._activate(r),this}if(this._activeTarget&&e<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,this._clear(),this;for(var o=this._offsets.length;o--;)t._activeTarget!==t._targets[o]&&e>=t._offsets[o]&&(void 0===t._offsets[o+1]||e<t._offsets[o+1])&&t._activate(t._targets[o]);return this},ScrollSpy.prototype.scheduleRefresh=function(){return this.handleEvent({type:"resize"}),this},ScrollSpy.prototype.dispose=function(){this.unListen(),clearTimeout(this._resizeTimeout),this._resizeTimeout=null,this._$el=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null,this._$root=null},ScrollSpy.prototype.handleEvent=function(t){var e=this;"scroll"===t.type?this.process():"orientationchange"!==t.type&&"resize"!==t.type||(clearTimeout(e._resizeTimeout),e._resizeTimeout=setTimeout(function(){e.refresh().process()},e._config.throttle||Default.throttle))},ScrollSpy.prototype._getScroller=function(){if(isServer)return null;var t=this._config.element;return t?t&&isElement(t)?t:"string"==typeof t?"body"===t?document.body:$QS(t):null:null},ScrollSpy.prototype._getScrollTop=function(){var t=this._getScroller();return t?"BODY"===t.tagName?window.pageYOffset:t.scrollTop:0},ScrollSpy.prototype._getScrollHeight=function(){var t=this._getScroller();return t?"BODY"===t.tagName?Math.max(document.body.scrollHeight,document.documentElement.scrollHeight):t.scrollHeight:0},ScrollSpy.prototype._getOffsetHeight=function(){var t=this._getScroller();return t?"BODY"===t.tagName?window.innerHeight:t.getBoundingClientRect().height:0},ScrollSpy.prototype._activate=function(t){var e=this;this._activeTarget=t,this._clear();var n=this._selector.split(","),i=$QSA((n=n.map(function(e){return e+'[href="'+t+'"]'})).join(","),this._$el);i.forEach(function(t){if(t.classList.contains(ClassName$2.DROPDOWN_ITEM)){var n=closest(t,Selector$2.DROPDOWN);if(n){var i=$QS(Selector$2.DROPDOWN_TOGGLE,n);i&&e._setActiveState(i,!0)}e._setActiveState(t,!0)}else e._setActiveState(t,!0),e._setParentsSiblingActiveState(t,Selector$2.NAV_LIST_GROUP,[ClassName$2.NAV_LINK,ClassName$2.LIST_ITEM],!0)}),i&&i.length>0&&this._$root&&this._$root.$emit&&this._$root.$emit(EVENT,t)},ScrollSpy.prototype._clear=function(){var t=this;$QSA(this._selector,this._$el).filter(function(t){if(t.classList.contains(ClassName$2.ACTIVE)){var e=t.getAttribute("href");return"#"===e.charAt(0)&&0!==e.indexOf("#/")}return!1}).forEach(function(e){t._setActiveState(e,!1)})},ScrollSpy.prototype._setActiveState=function(t,e){if(t){var n=getVm(t);n&&Object.prototype.hasOwnProperty.call(n.$props,"active")?n.$props.active=e:t.classList[e?"add":"remove"](ClassName$2.ACTIVE)}},ScrollSpy.prototype._setParentsSiblingActiveState=function(t,e,n,i){var r=this;if(n){isArray(n)||(n=[n]);for(var o=t;o;)if((o=closest(o,e))&&o.previousElementSibling)for(var s=0;s<n.length-1;s++)o.previousElementSibling.classList.contains(n[s])&&r._setActiveState(o,i)}};var scrollspy={bind:function(t,e,n){isServer||t[BVSS]||(t[BVSS]=new ScrollSpy(t,e))},inserted:function(t,e,n){isServer||(t[BVSS]?t[BVSS].updateConfig(e).listen():(t[BVSS]=new ScrollSpy(t,e,n),t[BVSS].listen()),t[BVSS].refresh().process().scheduleRefresh())},update:function(t,e,n){isServer||(t[BVSS]?t[BVSS].updateConfig(e):(t[BVSS]=new ScrollSpy(t,e,n),t[BVSS].listen()),t[BVSS].refresh().process().scheduleRefresh())},componentUpdated:function(t,e,n){isServer||(t[BVSS]?t[BVSS].updateConfig(e):(t[BVSS]=new ScrollSpy(t,e,n),t[BVSS].listen()),t[BVSS].refresh().process().scheduleRefresh())},unbind:function(t){!isServer&&t[BVSS]&&(t[BVSS].unListen().dispose(),t[BVSS]=null)}},inBrowser$3="undefined"!=typeof window&&"undefined"!=typeof document,BVTT="__BV_ToolTip__",validTriggers={focus:!0,hover:!0,click:!0},tooltip$1={bind:function(t,e,n){applyBVTT(t,e,n)},inserted:function(t,e,n){applyBVTT(t,e,n)},update:function(t,e,n){e.value!==e.oldValue&&applyBVTT(t,e,n)},componentUpdated:function(t,e,n){e.value!==e.oldValue&&applyBVTT(t,e,n)},unbind:function(t){removeBVTT(t)}},inBrowser$4="undefined"!=typeof window&&"undefined"!=typeof document,BVPO="__BV_PopOver__",validTriggers$1={focus:!0,hover:!0,click:!0},popover$1={bind:function(t,e,n){applyBVPO(t,e,n)},inserted:function(t,e,n){applyBVPO(t,e,n)},update:function(t,e,n){e.value!==e.oldValue&&applyBVPO(t,e,n)},componentUpdated:function(t,e,n){e.value!==e.oldValue&&applyBVPO(t,e,n)},unbind:function(t){removeBVPO(t)}},directives=Object.freeze({bToggle:toggle,bModal:modal$1,bScrollspy:scrollspy,bTooltip:tooltip$1,bPopover:popover$1}),VuePlugin={install:function(t){if(!t._bootstrap_vue_installed){t._bootstrap_vue_installed=!0;for(var e in components)t.component(e,components[e]);for(var n in directives)t.directive(n,directives[n])}}};"undefined"!=typeof window&&window.Vue&&window.Vue.use(VuePlugin);/* harmony default export */ __webpack_exports__["a"] = (VuePlugin);
//# sourceMappingURL=bootstrap-vue.esm.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(38)))

/***/ }),
/* 142 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at runLoaders (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:194:19)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:364:11\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:170:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:27:11)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at runLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:362:2)\n    at NormalModule.doBuild (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:181:3)\n    at NormalModule.build (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModule.js:274:15)\n    at Compilation.buildModule (/Users/domi91c/Kitboxer/node_modules/webpack/lib/Compilation.js:146:10)\n    at moduleFactory.create (/Users/domi91c/Kitboxer/node_modules/webpack/lib/Compilation.js:433:9)\n    at factory (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:253:5)\n    at applyPluginsAsyncWaterfall (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:99:14)\n    at /Users/domi91c/Kitboxer/node_modules/tapable/lib/Tapable.js:204:11\n    at NormalModuleFactory.params.normalModuleFactory.plugin (/Users/domi91c/Kitboxer/node_modules/webpack/lib/CompatibilityPlugin.js:52:5)\n    at NormalModuleFactory.applyPluginsAsyncWaterfall (/Users/domi91c/Kitboxer/node_modules/tapable/lib/Tapable.js:208:13)\n    at resolver (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:74:11)\n    at process.nextTick (/Users/domi91c/Kitboxer/node_modules/webpack/lib/NormalModuleFactory.js:205:8)\n    at _combinedTickCallback (internal/process/next_tick.js:73:7)\n    at process._tickCallback (internal/process/next_tick.js:104:9)");

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(144)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(146),
  /* template */
  __webpack_require__(158),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-06960f4f",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/image-uploader/ImageUploader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ImageUploader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-06960f4f", Component.options)
  } else {
    hotAPI.reload("data-v-06960f4f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(145);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("3df59734", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06960f4f\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageUploader.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06960f4f\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageUploader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(undefined);
// imports


// module
exports.push([module.i, "\ninput[type=\"file\"][data-v-06960f4f] {\n  display: none;\n}\n.progress-bar[data-v-06960f4f] {\n  border-radius: 50%;\n  bottom: 0;\n}", ""]);

// exports


/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_ImageCard_vue__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_ImageCard_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_ImageCard_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_ImageModal_vue__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_ImageModal_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_ImageModal_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_js__ = __webpack_require__(42);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['images', 'productId'],
  data: function data() {
    return {
      currentImage: '',
      imageCards: []
    };
  },
  components: {
    ImageCard: __WEBPACK_IMPORTED_MODULE_0__components_ImageCard_vue___default.a,
    ImageModal: __WEBPACK_IMPORTED_MODULE_1__components_ImageModal_vue___default.a
  },
  mounted: function mounted() {
    for (var i = 0; i < this.images.length - 1; i++) {
      var image = this.images[i];
      var card = {
        productId: this.productId,
        progress: 100,
        url: image.image.url,
        coverImage: image.cover_image,
        id: image.id,
        cropped: image.cropped
      };
      this.imageCards.push(card);
    }
  },

  methods: {
    inputDidChange: function inputDidChange(e) {
      var _this = this;

      if (e.target.files[0]) {
        var _loop = function _loop(i) {
          var card = {
            productId: _this.productId,
            file: e.target.files[i],
            formData: {},
            progress: 0,
            url: '',
            coverImage: false,
            cropped: false
          };
          _this.imageCards.push(card);
          Object(__WEBPACK_IMPORTED_MODULE_2__model_js__["d" /* uploadImage */])(card, _this.onProgress).then(function (x) {
            var respParsed = JSON.parse(x);
            card.url = respParsed.image.image.url;
            card.id = respParsed.image.id;
          });
        };

        for (var i = 0; i < e.target.files.length; i++) {
          _loop(i);
        }
      }
    },
    onProgress: function onProgress(percent, card) {
      console.log(this.files);
      console.log(card);
      this.imageCards[this.imageCards.indexOf(card)].progress = percent;
    },
    cropImage: function cropImage(card) {
      this.$root.$emit('show::modal', 'image-modal');
      this.currentImage = card;
      console.log(this.currentImage);
    },
    updateImage: function updateImage(cropData) {
      var _this2 = this;

      this.currentImage.cropData = cropData;
      Object(__WEBPACK_IMPORTED_MODULE_2__model_js__["a" /* cropImage */])(this.currentImage).then(function (x) {
        var respParsed = JSON.parse(x);
        console.log(x);
        var index = _this2.imageCards.indexOf(_this2.currentImage);
        _this2.imageCards[index].url = respParsed.image.image.url;
        _this2.imageCards[index].cropped = true;
        console.log(_this2.imageCards[index].url);
        console.log('image cropped successfully');
      }).catch(function (x) {
        console.log('image cropped failed');
      });
    },
    deleteImage: function deleteImage(cardData) {
      this.imageCards.splice(this.imageCards.indexOf(cardData), 1);
      Object(__WEBPACK_IMPORTED_MODULE_2__model_js__["b" /* removeImage */])(cardData).then(function (x) {
        console.log('deleted image.');
      });
    },
    setCoverImage: function setCoverImage(card) {
      var _this3 = this;

      Object(__WEBPACK_IMPORTED_MODULE_2__model_js__["c" /* setCoverImage */])(card).then(function (x) {
        console.log('set cover image success');
        for (var i = 0; i < _this3.imageCards.length; i++) {
          var _card = _this3.imageCards[i];
          _card.coverImage = false;
        }
        card.coverImage = true;
      });
    }
  }
});

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(148)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(150),
  /* template */
  __webpack_require__(152),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-50061ec8",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/image-uploader/components/ImageCard.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ImageCard.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-50061ec8", Component.options)
  } else {
    hotAPI.reload("data-v-50061ec8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(149);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("340c0817", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-50061ec8\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageCard.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-50061ec8\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 149 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_placeholder_img_png__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_placeholder_img_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__images_placeholder_img_png__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {},

  props: ['card'],
  data: function data() {
    return {
      currentFile: __WEBPACK_IMPORTED_MODULE_0__images_placeholder_img_png___default.a,
      isCoverPhoto: false
    };
  },


  methods: {}
});

/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = "/packs-test/placeholder_img.png";

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mb-4"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-4 image-card "
  }, [_c('img', {
    staticClass: "img-contain img-fluid",
    class: _vm.card.coverImage ? 'cover-image' : 'other-image',
    attrs: {
      "src": _vm.card.url
    },
    on: {
      "click": function($event) {
        _vm.$emit('crop-image', _vm.card)
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-8"
  }, [_c('div', {
    staticClass: "actions d-none d-lg-block"
  }, [_c('h5', [_vm._v(_vm._s(_vm.card.filename))]), _vm._v(" "), _c('div', {
    staticClass: "btn btn-success",
    on: {
      "click": function($event) {
        _vm.$emit('crop-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-crop "
  }), _vm._v("\n                    Crop\n                ")]), _vm._v(" "), _c('div', {
    staticClass: "btn btn-primary",
    class: _vm.card.coverImage ? 'disabled' : '',
    on: {
      "click": function($event) {
        _vm.$emit('cover-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-star "
  }), _vm._v("\n                    Cover Photo\n                ")]), _vm._v(" "), _c('div', {
    staticClass: "btn btn-danger",
    on: {
      "click": function($event) {
        _vm.$emit('delete-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-times "
  }), _vm._v("\n                    Delete\n                ")])]), _vm._v(" "), _c('div', {
    staticClass: "actions d-lg-none text-center"
  }, [_c('h5', [_vm._v(_vm._s(_vm.card.filename))]), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.$emit('crop-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-crop "
  }), _vm._v(" Crop")]), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.$emit('cover-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-star "
  }), _vm._v(" Cover Photo")]), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.$emit('delete-image', _vm.card)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-times "
  }), _vm._v(" Delete")])]), _vm._v(" "), _c('div', {
    staticClass: "progress mt-4 "
  }, [_c('div', {
    staticClass: "progress-bar ",
    class: _vm.card.progress < 100 ? 'bg-primary' : 'bg-success',
    style: ({
      width: _vm.card.progress + '%'
    })
  })])])]), _vm._v(" "), _c('hr')])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-50061ec8", module.exports)
  }
}

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(154)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(156),
  /* template */
  __webpack_require__(157),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-8b9dbb5e",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/image-uploader/components/ImageModal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ImageModal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8b9dbb5e", Component.options)
  } else {
    hotAPI.reload("data-v-8b9dbb5e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(155);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("64a6314a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8b9dbb5e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageModal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8b9dbb5e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ImageModal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 155 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_js__ = __webpack_require__(42);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    VueCropper: __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default.a
  },
  mounted: function mounted() {
    this.$refs.cropper.replace(this.image.url);
  },
  updated: function updated() {
    this.$refs.cropper.replace(this.image.url);
  },

  props: ['image'],
  data: function data() {
    return {
      name: 'name'
    };
  },


  methods: {
    finishCrop: function finishCrop() {
      console.log('finishing crop.');
      var cropData = this.$refs.cropper.getData();
      console.log(cropData);
      this.$emit('finish-crop', cropData);
    }
  }
});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('b-modal', {
    ref: "image_modal",
    attrs: {
      "hide-header-close": "",
      "no-close-on-backdrop": "",
      "id": "image-modal",
      "size": "lg"
    },
    on: {
      "ok": _vm.finishCrop
    }
  }, [_c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (false),
      expression: "false"
    }],
    attrs: {
      "src": _vm.image.url,
      "alt": ""
    }
  }), _vm._v(" "), _c('vue-cropper', {
    ref: "cropper",
    attrs: {
      "aspect-ratio": 10 / 9,
      "guides": false,
      "view-mode": 1,
      "drag-mode": 'move',
      "min-container-height": 400,
      "auto-crop-area": 0.5,
      "background": false,
      "rotatable": true
    }
  })], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-8b9dbb5e", module.exports)
  }
}

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "image-uploader"
  }, [_c('hr'), _vm._v(" "), _vm._l((_vm.imageCards), function(card) {
    return _c('div', [_c('image-card', {
      attrs: {
        "card": card
      },
      on: {
        "crop-image": _vm.cropImage,
        "delete-image": _vm.deleteImage,
        "cover-image": _vm.setCoverImage
      }
    })], 1)
  }), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-12"
  }, [_c('label', {
    staticClass: "btn btn-outline-info"
  }, [_c('input', {
    attrs: {
      "type": "file",
      "accept": "image/*",
      "multiple": ""
    },
    on: {
      "change": _vm.inputDidChange
    }
  }), _vm._v(" "), (this.imageCards.length > 0) ? _c('span', [_vm._v("Add Another ...")]) : _c('span', [_vm._v("Add An Image ...")])])])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('image-modal', {
    attrs: {
      "image": _vm.currentImage
    },
    on: {
      "finish-crop": _vm.updateImage
    }
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-06960f4f", module.exports)
  }
}

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__guide_editor_GuideEditor_vue__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__guide_editor_GuideEditor_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__guide_editor_GuideEditor_vue__);




document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('.js-guide-editor');
  if (el !== null) {
    var props = JSON.parse(el.getAttribute('data'));

    new __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__["a" /* default */]({
      render: function render(h) {
        return h(__WEBPACK_IMPORTED_MODULE_2__guide_editor_GuideEditor_vue___default.a, { props: props });
      },
      mixins: [__WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__["a" /* default */]]
    }).$mount(el);
  }
});

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(161)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(163),
  /* template */
  __webpack_require__(190),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-73835b6d",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/guide-editor/GuideEditor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] GuideEditor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73835b6d", Component.options)
  } else {
    hotAPI.reload("data-v-73835b6d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(162);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("412b3a43", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-73835b6d\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GuideEditor.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-73835b6d\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../node_modules/resolve-url-loader/index.js!../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GuideEditor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 162 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_GuideStep__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_GuideStep___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_GuideStep__);
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    GuideStep: __WEBPACK_IMPORTED_MODULE_0__components_GuideStep___default.a
  },
  mounted: function mounted() {},
  data: function data() {
    return {
      guideSteps: [{ id: 0, title: 'Step One' }, { id: 1, title: 'Step Two' }, { id: 2, title: 'Step Three' }]
    };
  },


  methods: {
    removeStep: function removeStep(step) {
      var index = this.guideSteps.indexOf(step);
      this.guideSteps.splice(index, 1);
    },
    newStep: function newStep() {
      this.guideSteps.push({});
    }
  }
});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(165)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(167),
  /* template */
  __webpack_require__(189),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3d8496bb",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/guide-editor/components/GuideStep.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] GuideStep.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d8496bb", Component.options)
  } else {
    hotAPI.reload("data-v-3d8496bb", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(166);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("1eb9ed5a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3d8496bb\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GuideStep.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3d8496bb\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GuideStep.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 166 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StepImages__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StepImages___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__StepImages__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  components: { StepImages: __WEBPACK_IMPORTED_MODULE_0__StepImages___default.a },
  props: ['steps', 'step'],
  mounted: function mounted() {},
  data: function data() {
    return {};
  },


  methods: {}
});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(169)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(171),
  /* template */
  __webpack_require__(188),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-1a6c57be",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/guide-editor/components/StepImages.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] StepImages.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a6c57be", Component.options)
  } else {
    hotAPI.reload("data-v-1a6c57be", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(170);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("b9af4bb4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a6c57be\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImages.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a6c57be\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImages.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 170 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StepImage_vue__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StepImage_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__StepImage_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StepImageModal_vue__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StepImageModal_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__StepImageModal_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__image_uploader_components_CropModal__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__image_uploader_components_CropModal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__image_uploader_components_CropModal__);
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    StepImage: __WEBPACK_IMPORTED_MODULE_0__StepImage_vue___default.a,
    CropModal: __WEBPACK_IMPORTED_MODULE_2__image_uploader_components_CropModal___default.a
  },
  mounted: function mounted() {},
  data: function data() {
    return {
      images: [{
        id: 0,
        src: 'http://via.placeholder.com/100x100'
      }, {
        id: 1,
        src: 'http://via.placeholder.com/100x100'
      }, {
        id: 2,
        src: 'http://via.placeholder.com/100x100'
      }, {
        id: 3,
        src: 'http://via.placeholder.com/100x100'
      }]
    };
  },


  methods: {}
});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(173)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(175),
  /* template */
  __webpack_require__(176),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-221f157c",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/guide-editor/components/StepImage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] StepImage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-221f157c", Component.options)
  } else {
    hotAPI.reload("data-v-221f157c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("5d8b6438", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-221f157c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImage.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-221f157c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 174 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['image'],
  mounted: function mounted() {},
  data: function data() {
    return {};
  },


  methods: {
    openImageModal: function openImageModal() {
      console.log('peenor');
    }
  }
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('img', {
    staticClass: "img-fluid mx-1 mt-2",
    attrs: {
      "src": "http://via.placeholder.com/100x100",
      "height": "100px",
      "width": "100px"
    },
    on: {
      "click": function($event) {
        _vm.openImageModal()
      }
    }
  })
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-221f157c", module.exports)
  }
}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(178)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(180),
  /* template */
  __webpack_require__(181),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-d085f38a",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/guide-editor/components/StepImageModal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] StepImageModal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d085f38a", Component.options)
  } else {
    hotAPI.reload("data-v-d085f38a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(179);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("334e6ea9", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d085f38a\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImageModal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d085f38a\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StepImageModal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 179 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing binding /Users/domi91c/Kitboxer/node_modules/node-sass/vendor/darwin-x64-48/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 6.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 7.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass --force` to build the binding for your current environment.\n    at module.exports (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/domi91c/Kitboxer/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.require (module.js:497:17)\n    at require (internal/module.js:20:19)\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:13:17)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/domi91c/Kitboxer/node_modules/loader-runner/lib/LoaderRunner.js:173:18\n    at loadLoader (/Users/domi91c/Kitboxer/node_modules/loader-runner/lib/loadLoader.js:36:3)");

/***/ }),
/* 180 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

//import { mapState, mapActions, mapMutations } from 'vuex';

/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {},
  data: function data() {
    return {};
  },


  methods: {}
});

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal js-step-image-modal"
  }, [_c('div', {
    staticClass: "modal-dialog",
    attrs: {
      "role": "document"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('div', {
    staticClass: "modal-header"
  }, [_c('h5', {
    staticClass: "modal-title"
  }, [_vm._v("Modal title")]), _vm._v(" "), _c('button', {
    staticClass: "close",
    attrs: {
      "type": "button",
      "data-dismiss": "modal",
      "aria-label": "Close"
    }
  }, [_c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("×")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-body"
  }, [_c('p', [_vm._v("Modal body text goes here.")])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('button', {
    staticClass: "btn btn-primary",
    attrs: {
      "type": "button"
    }
  }, [_vm._v("Save changes")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-secondary",
    attrs: {
      "type": "button",
      "data-dismiss": "modal"
    }
  }, [_vm._v("Close")])])])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d085f38a", module.exports)
  }
}

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(183)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(185),
  /* template */
  __webpack_require__(187),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/image-uploader/components/CropModal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CropModal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ce37c2e4", Component.options)
  } else {
    hotAPI.reload("data-v-ce37c2e4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(184);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(8)("0a0327de", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ce37c2e4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CropModal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?{\"minimize\":false}!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ce37c2e4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../../../../node_modules/resolve-url-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CropModal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(undefined);
// imports


// module
exports.push([module.i, "\n.img-container {\n  max-width: 100%;\n  height: 500px;\n}\n.inputfile {\n  width: 0.1px;\n  height: 0.1px;\n  opacity: 0;\n  overflow: hidden;\n  position: absolute;\n  z-index: -1;\n}\n.drop-box {\n  position: absolute;\n  border: 2px dashed #666;\n  background-color: #ccc;\n  width: 95%;\n  height: 500px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.loading {\n  width: 95%;\n  height: 500px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.drop-box-text {\n  font-size: 26px;\n}\n.v-spinner {\n  position: absolute;\n  top: 50%;\n  margin: 0 auto;\n  width: 100%;\n}", ""]);

// exports


/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_cropperjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_js__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_js__ = __webpack_require__(42);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    VueCropper: __WEBPACK_IMPORTED_MODULE_0_vue_cropperjs___default.a
  },
  props: ['image', 'modalIsReady'],
  data: function data() {
    return {
      currentImage: {},
      cropperIsActive: false,
      cropperIsLoading: false,
      formData: new FormData()
    };
  },
  mounted: function mounted() {
    console.log('modal is ready');
    this.$refs.cropper.enable();
    this.$refs.cropper.replace(this.image);
  },
  updated: function updated() {
    console.log('updated');
    this.$refs.cropper.destroy();
    this.$refs.cropper.enable();
    this.$refs.cropper.replace(this.image);
  },

  methods: {
    handleSubmit: function handleSubmit() {
      var _this = this;

      $('#cropModal').modal('hide');
      var cropData = this.$refs.cropper.getData();
      var fd = new FormData();
      fd.append('crop_data', JSON.stringify(cropData));
      fd.append('avatar', this.currentImage);
      Object(__WEBPACK_IMPORTED_MODULE_2__model_js__["d" /* uploadImage */])(fd).then(function (x) {
        _this.$emit('submit', x);
      }).catch(function (x) {});
    }
  }
});

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bus */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(40);

var bus = new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]();

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal fade js-crop-modal",
    attrs: {
      "role": "dialog",
      "aria-labelledby": "modalLabel",
      "tabindex": "-1"
    }
  }, [_c('div', {
    staticClass: "modal-dialog modal-lg",
    attrs: {
      "role": "document"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('div', {
    staticClass: "modal-body"
  }, [(_vm.modalIsReady) ? _c('div', {
    staticClass: "img-container text-center"
  }, [_c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (false),
      expression: "false"
    }],
    attrs: {
      "src": _vm.image,
      "alt": ""
    }
  }), _vm._v(" "), _c('vue-cropper', {
    ref: "cropper",
    attrs: {
      "aspect-ratio": 1 / 1,
      "guides": false,
      "minContainerWidth": 520,
      "minContainerHeight": 500,
      "view-mode": 1,
      "drag-mode": 'crop',
      "auto-crop-area": 0.5,
      "background": false,
      "rotatable": true
    }
  })], 1) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('button', {
    staticClass: "btn btn-primary mt-2",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.handleSubmit()
      }
    }
  }, [_vm._v("Crop")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-default mt-2",
    attrs: {
      "type": "button",
      "data-dismiss": "modal"
    }
  }, [_vm._v("Close")])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ce37c2e4", module.exports)
  }
}

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-12 mb-2"
  }, [_vm._l((_vm.images), function(image) {
    return _c('step-image', {
      attrs: {
        "image": image
      }
    })
  }), _vm._v(" "), _c('crop-modal', {
    attrs: {
      "image": _vm.image
    }
  })], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1a6c57be", module.exports)
  }
}

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card mb-4"
  }, [_c('div', {
    staticClass: "card-body"
  }, [_c('i', {
    staticClass: "close fa fa-close float-right",
    on: {
      "click": function($event) {
        _vm.$emit('remove-step', _vm.step)
      }
    }
  }), _vm._v(" "), _c('h1', [_vm._v("Step " + _vm._s(_vm.steps.indexOf(_vm.step) + 1))]), _vm._v(" "), _c('input', {
    staticClass: "form-control mb-4",
    attrs: {
      "type": "text",
      "id": "step-title",
      "placeholder": "Step title..."
    }
  }), _vm._v(" "), _c('trix-editor', {
    attrs: {
      "placeholder": "Step instructions..."
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "step-images-container text-center mt-4"
  }, [_c('step-images')], 1)], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3d8496bb", module.exports)
  }
}

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._l((_vm.guideSteps), function(step) {
    return _c('div', {
      staticClass: "guide-step"
    }, [_c('guide-step', {
      attrs: {
        "steps": _vm.guideSteps,
        "step": step
      },
      on: {
        "remove-step": _vm.removeStep
      }
    })], 1)
  }), _vm._v(" "), _c('div', {
    staticClass: "mt-4 guide-footer"
  }, [_c('button', {
    staticClass: "btn btn-lg btn-success float-right",
    on: {
      "click": _vm.newStep
    }
  }, [_vm._v("Next Step")])])], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-73835b6d", module.exports)
  }
}

/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lightbox_Lightbox_vue__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lightbox_Lightbox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__lightbox_Lightbox_vue__);




document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('.js-lightbox');
  if (el !== null) {
    var props = JSON.parse(el.getAttribute('data'));

    new __WEBPACK_IMPORTED_MODULE_0_vue_dist_vue_esm__["a" /* default */]({
      render: function render(h) {
        return h(__WEBPACK_IMPORTED_MODULE_2__lightbox_Lightbox_vue___default.a, { props: props });
      },
      mixins: [__WEBPACK_IMPORTED_MODULE_1_vue_turbolinks__["a" /* default */]]
    }).$mount(el);
  }
});

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(193),
  /* template */
  __webpack_require__(194),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/domi91c/Kitboxer/app/javascript/lightbox/Lightbox.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Lightbox.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a8eea3ec", Component.options)
  } else {
    hotAPI.reload("data-v-a8eea3ec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 193 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      slide: 0,
      sliding: null
    };
  },

  methods: {
    onSlideStart: function onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd: function onSlideEnd(slide) {
      this.sliding = false;
    }
  }
});

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('b-carousel', {
    staticStyle: {
      "text-shadow": "1px 1px 2px #333"
    },
    attrs: {
      "id": "carousel1",
      "controls": "",
      "indicators": "",
      "background": "#ababab",
      "interval": 4000,
      "img-width": "1024",
      "img-height": "480"
    },
    on: {
      "sliding-start": _vm.onSlideStart,
      "sliding-end": _vm.onSlideEnd
    },
    model: {
      value: (_vm.slide),
      callback: function($$v) {
        _vm.slide = $$v
      },
      expression: "slide"
    }
  }, [_c('b-carousel-slide', {
    attrs: {
      "caption": "",
      "img-src": "http://cesa.com/wp-content/uploads/et_temp/Electronics-hd-wallpaper-21627626-1920-1200-644017_960x332.jpg"
    }
  }), _vm._v(" "), _c('b-carousel-slide', {
    attrs: {
      "img-src": "https://lorempixel.com/1024/480/technics/4/"
    }
  }, [_c('h1', [_vm._v("Hello world!")])]), _vm._v(" "), _c('b-carousel-slide', {
    attrs: {
      "img-src": "https://lorempixel.com/1024/480/technics/8/"
    }
  }), _vm._v(" "), _c('b-carousel-slide', [_c('img', {
    staticClass: "d-block img-fluid w-100",
    attrs: {
      "width": "1024",
      "height": "480",
      "src": "https://lorempixel.com/1024/480/technics/5/",
      "alt": "image slot"
    },
    slot: "img"
  })]), _vm._v(" "), _c('b-carousel-slide', {
    attrs: {
      "caption": "Blank Image",
      "img-blank": "",
      "img-alt": "Blank image"
    }
  }, [_c('p', [_vm._v("\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse\n                eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque\n                ut lacus vel interdum.\n            ")])])], 1), _vm._v(" "), _c('p', {
    staticClass: "mt-4"
  }, [_vm._v("\n        Slide #: " + _vm._s(_vm.slide)), _c('br'), _vm._v("\n        Sliding: " + _vm._s(_vm.sliding) + "\n    ")])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a8eea3ec", module.exports)
  }
}

/***/ })
/******/ ]);