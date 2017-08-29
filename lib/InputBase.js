/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module InputBase
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

var _immutable = require('immutable');

var _ValidationError = require('./ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

/**
 * Any field should implement this react component. This class will supply the
 * building blocks to implement any type of interactive component.
 *
 * @class InputBase
 * @extends React.Component
 */

var InputBase = (function (_React$Component) {
  _inherits(InputBase, _React$Component);

  /**
   * Setup initial field state.
   *
   * @constructs InputBase
   * @param {object} props
   */

  function InputBase(props) {
    var _this = this;

    _classCallCheck(this, InputBase);

    _get(Object.getPrototypeOf(InputBase.prototype), 'constructor', this).call(this, props);
    this.validators = [];
    this._onChange = null;
    this._hasMounted = false;
    this.state = {
      error: false,
      attrs: (0, _immutable.Map)({
        className: 'serial-form-input',
        'data-serial': '{}',
        onBlur: function onBlur() {
          _this.validate();
        },
        value: null
      })
    };
  }

  /**
   * Required properties for an input component.
   *
   * @static
   * @type {object}
   */

  /**
   * Add relevant validators and save the original onChange if one was provided.
   *
   * @return {void}
   */

  _createClass(InputBase, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var availableValidators = _validation2['default'].collection();
      this._onChange = this.props.onChange;
      this.updateAttrs(this.props);

      if (this.props.validation) {
        (function () {
          var types = _this2.props.validation.split(',');
          var i = 0;
          for (var len = types.length; i < len; i++) {
            availableValidators.forEach(function (validator) {
              if (types[i].trim() === validator.name) {
                _this2.validators.push(validator);
              }
            });
          }
        })();
      }
    }

    /**
     * Once the field has mounted we're attaching a real change event listener on
     * the actual dom element. This will allow us to manually trigger a real event
     * when we want to force the form to validate.
     *
     * @return {void}
     */
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      this._hasMounted = true;
      _reactDom2['default'].findDOMNode(this).addEventListener('validate', function (e) {
        _this3.setState({
          error: _this3.validate(_this3.attrs(true).get('value'))
        });
      });
    }

    /**
     * A custom implementation using immutable.js comparisons.
     *
     * @param {object} nextProps
     * @param {object} nextState
     * @return {boolean}
     */
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var attrsAreSame = this.state.attrs.equals(nextState.attrs);
      var errsAreSame = this.state.error === nextState.error;
      if (!attrsAreSame || !errsAreSame) {
        return true;
      }
      return false;
    }

    /**
     * Update state with new incoming props.
     *
     * @return {void}
     */
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateAttrs(nextProps);
    }

    /**
     * A normalized and serialized json object to be stored as the data-serial
     * attribute for the field.
     *
     * @param {?object} obj Immutable object to be used instead of the current
     *                      state's attr.
     * @return {string} serial { name: '<field name>', value: '<value>' }
     */
  }, {
    key: 'serialize',
    value: function serialize(obj) {
      var attrs = obj || this.state.attrs;
      var mutableAttrs = attrs.toJS();
      return JSON.stringify({
        name: mutableAttrs.name,
        value: _validation2['default']._isSupplied(mutableAttrs.value) ? mutableAttrs.value : null
      });
    }

    /**
     * All attributes for the field as an object.
     *
     * @param {boolean} immutable If true will return a immutable Map.
     * @return {object} attrs
     */
  }, {
    key: 'attrs',
    value: function attrs(immutable) {
      if (immutable) {
        return this.state.attrs;
      }
      return this.state.attrs.toJS();
    }

    /**
     * Used to easily determine if there is a validation error or not.
     *
     * @return {boolean} error
     */
  }, {
    key: 'hasError',
    value: function hasError() {
      return this.state.error instanceof _ValidationError2['default'];
    }

    /**
     * Call this to update the attrs state. This will automatically set the
     * serial and validate the value for errors. It's necessary that this gets
     * called onChange with the updated value. This is also useful for setting
     * default properties for a field in componentWillMount.
     *
     * Note that validate() is not called durning the initial render which assigns
     * error to null. This essentially puts the field in a "idle" state.
     *
     * this.updateAttrs({ value: 'foo', x: 1 }, { value: 'bar' }, onStateUpdate);
     *  // => { value: 'bar', x: 1 }
     *
     * @param {...object} object Objects will be merged from right to left.
     * @return {void}
     */
  }, {
    key: 'updateAttrs',
    value: function updateAttrs() {
      var _this4 = this;

      var opts = [];
      var updated = function updated() {};
      var len = arguments.length;

      for (var i = 0; i < len; i++) {
        if (typeof arguments[i] === 'function') {
          updated = arguments[i];
        } else if (typeof arguments[i] === 'object') {
          opts.push(arguments[i]);
        }
      }

      opts.push({
        onChange: this.onChange.bind(this)
      });

      this.setState(function (prev) {
        var obj = {
          attrs: prev.attrs.merge.apply(prev.attrs, opts)
        };
        obj.attrs = obj.attrs.update('data-serial', function (v) {
          return _this4.serialize(obj.attrs);
        });
        obj.error = _this4._hasMounted ? _this4.validate(obj.attrs.toJS().value) : null;
        return obj;
      }, updated);
    }

    /**
     * This method must be called when the field as changed. It must get the value
     * and set a value.
     *
     * It's also important that this.ogOnChange gets called so if there was an
     * actual onChange on the input, it will still get called.
     *
     * @param {object} event
     * @return {void}
     */
  }, {
    key: 'onChange',
    value: function onChange(event) {
      var val = event.target.value;
      event.persist();
      this.updateAttrs({
        value: val
      }, this.ogOnChange.bind(this, event));
    }

    /**
     * If a onChange was applied on the field it will still get called here.
     *
     * @param {object} event The SyntheticEvent.
     * @return {void}
     */
  }, {
    key: 'ogOnChange',
    value: function ogOnChange(event) {
      if (this._onChange) {
        this._onChange(event);
      }
    }

    /**
     * Using the validators specified, this will validate the value.
     *
     * @param {?value} value If not set, the state value will be used.
     * @return {mixed} null if valid but not supplied, ValidationError if invalid,
     *                 false if supplied and valid.
     */
  }, {
    key: 'validate',
    value: function validate(value) {
      var val = value !== null ? value : this.attrs(true).get('value');
      var len = this.validators.length;
      var i = 0;
      var msg = undefined;
      for (; i < len; i++) {
        if (this.validators[i].invalid(val)) {
          if (this.props.messages && this.props.messages[this.validators[i].name]) {
            msg = this.props.messages[this.validators[i].name];
          } else {
            msg = this.validators[i].message;
          }
          return new _ValidationError2['default'](msg);
        }
      }
      if (!_validation2['default']._isSupplied(val)) {
        return null;
      }
      return false;
    }

    /**
     * Must be implemented.
     */
  }, {
    key: 'render',
    value: function render() {
      throw new Error('This class should not be implemented directly.');
    }
  }]);

  return InputBase;
})(_react2['default'].Component);

exports['default'] = InputBase;
InputBase.defaultProps = {};

/**
 * Validation for properties.
 *
 * @static
 * @type {object}
 */
InputBase.propTypes = {
  name: _react2['default'].PropTypes.string.isRequired
};
module.exports = exports['default'];