/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module FormBase
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Base form class. Responsible for wrapping the fields in a <form> tag and
 * and providing a convenient serialization method. Any fields with a name that
 * ends with brackets (e.g. files[]) will automatically be turned into an array.
 *
 * This class should not be instantiated directly.
 *
 * @example
 * onSubmit() {
 *   handler(this.refs.form.serialize());
 * }
 *
 * @class Form
 * @extends React.Component
 */

var FormBase = (function (_React$Component) {
  _inherits(FormBase, _React$Component);

  /**
   * Form constructor.
   *
   * @constructs Form
   */

  function FormBase(props) {
    _classCallCheck(this, FormBase);

    _get(Object.getPrototypeOf(FormBase.prototype), 'constructor', this).call(this, props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Default properties.
   */

  /**
   * Render is only to be overwritten.
   * @throws {Error}
   */

  _createClass(FormBase, [{
    key: 'render',
    value: function render() {
      throw new Error('This class should not be implemented directly.');
    }

    /**
     * A basic example for an onSubmit callback. You will definitely want to
     * create your own so you can actually do something with the data.
     *
     * @param {object} SyntheticEvent
     * @return {void}
     */
  }, {
    key: 'onSubmit',
    value: function onSubmit(event) {
      this.validate(function (valid) {
        if (valid) {
          // Do things with serialization.
        }
      });
      event.preventDefault();
    }

    /**
     * Force all fields to validate. This should be called onSubmit. It will force
     * all fields to validate.
     *
     * To trigger the validation on the child elements we dispatch a custom event
     * called "validate" on the raw DOM elements. Upon mounting, all fields are
     * setup to listen to this event.
     *
     * Lastly, we do a dirty async check to see if any of the inputs have a
     * validation error based on their class name. A few milliseconds for slower
     * browsers...
     *
     * @param {function} fn(valid){}
     * @return {void} true
     */
  }, {
    key: 'validate',
    value: function validate(fn) {
      var node = _reactDom2['default'].findDOMNode(this);
      var len = node.elements.length;
      var i = 0;
      var valid = true;
      var event = document.createEvent('Event');
      event.initEvent('validate', true, true);

      function trigger() {
        node.elements[i].dispatchEvent(event);
        setTimeout(function () {
          if (valid && /error/.test(node.elements[i].getAttribute('class'))) {
            valid = false;
          }
          if (i + 1 === len && fn) {
            fn(valid);
          } else {
            trigger(++i);
          }
        }, 2);
      }
      trigger();
    }

    /**
     * Returns a object containing all serialized values from the fields in the
     * form.
     *
     * @return {array} collection
     */
  }, {
    key: 'serialize',
    value: function serialize() {
      var node = _reactDom2['default'].findDOMNode(this);
      var CACHE_KEY = '___CACHE___';
      var NUMBER_LIKE = /^\d*(?:\.{1}\d+)?$/;
      var valCache = {};
      var data = undefined;
      var queryStr = '';
      var json = undefined;
      var val = undefined;
      var len = node.elements.length;
      var ignoreValue = false;

      // This will iterate through the form object that Qs creates and de-cache
      // each value.
      function mutateValues(obj) {
        _lodash2['default'].forEach(obj, function (v, k) {
          if (_lodash2['default'].isObject(v) || _lodash2['default'].isArray(v)) {
            return mutateValues(v);
          } else {
            obj[k] = valCache[v];
          }
        });
      }

      // Iterate through each element in the DOM and determine how to store the
      // value in the element cache object. For example, a file type is a special
      // type of input that shouldn't be serialized.
      for (var i = 0; i < len; i++) {
        if (typeof node.elements[i].getAttribute('data-serial') === 'string') {
          ignoreValue = false;
          json = JSON.parse(node.elements[i].getAttribute('data-serial'));
          val = CACHE_KEY + i;
          if (node.elements[i].type === 'file' && node.elements[i].value) {
            valCache[val] = node.elements[i].files;
          } else if (node.elements[i].type === 'radio') {
            if (node.elements[i].checked) {
              valCache[val] = json.value;
            } else {
              ignoreValue = true;
            }
          } else {
            valCache[val] = json.value;
          }
          if (!ignoreValue) {
            queryStr = queryStr + '&' + json.name + '=' + encodeURIComponent(val);
          }
        }
      }
      data = _qs2['default'].parse(queryStr, {
        depth: Infinity,
        parameterLimit: Infinity,
        arrayLimit: Infinity
      });
      mutateValues(data);
      return data;
    }
  }]);

  return FormBase;
})(_react2['default'].Component);

exports['default'] = FormBase;
FormBase.defaultProps = {
  method: 'post',
  submitText: 'Submit',
  isLoading: false
};

/**
 * Require some properties for sanity.
 */
FormBase.propTypes = {
  method: _react2['default'].PropTypes.string.isRequired,
  submitText: _react2['default'].PropTypes.string.isRequired,
  isLoading: _react2['default'].PropTypes.bool.isRequired
};
module.exports = exports['default'];