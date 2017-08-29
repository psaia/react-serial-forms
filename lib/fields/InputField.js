'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputBase2 = require('../InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputField = function (_InputBase) {
  _inherits(InputField, _InputBase);

  /**
   * @constructs InputField
   */
  function InputField(props) {
    _classCallCheck(this, InputField);

    return _possibleConstructorReturn(this, (InputField.__proto__ || Object.getPrototypeOf(InputField)).call(this, props));
  }

  /**
   * Special behavior for radio buttons.
   *
   * @return {void}
   */


  _createClass(InputField, [{
    key: 'getInitialValue',
    value: function getInitialValue() {
      if (this.props.type === 'radio') {
        if (this.props.checked) {
          return this.props.value;
        } else {
          return '';
        }
      }
      return _get(InputField.prototype.__proto__ || Object.getPrototypeOf(InputField.prototype), 'getInitialValue', this).call(this);
    }

    /**
     * Special behavior for various types.
     *
     * @param {object} event
     * @return {void}
     */

  }, {
    key: 'onChange',
    value: function onChange(event) {
      var val = '';
      var elType = event.nativeEvent.target.type;

      switch (elType) {
        case 'checkbox':
          val = event.target.checked ? 1 : 0;
          break;
        case 'number':
          val = parseFloat(event.target.value);
          if (isNaN(val)) {
            val = '';
          }
          break;
        case 'radio':
          if (event.target.checked) {
            val = event.target.value;
          }
          break;
        case 'file':
          if (event.target.value) {
            val = event.target;
          }
          break;
        default:
          val = event.target.value;
      }

      this.updateValue(val);

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
    }

    /**
     * @return {object} ReactElement
     */

  }, {
    key: 'render',
    value: function render() {
      var attrs = this.attrs();
      var errMessage = _react2.default.createElement('span', null);

      if (attrs.className) {
        attrs.className += ' ' + this.getClassName();
      } else {
        attrs.className = this.getClassName();
      }

      if (this.state.error) {
        errMessage = _react2.default.createElement(
          'span',
          { className: 'err-msg' },
          this.state.error.message
        );
      }

      return _react2.default.createElement(
        'span',
        { className: 'serial-input-wrapper' },
        _react2.default.createElement('input', attrs),
        errMessage
      );
    }
  }]);

  return InputField;
}(_InputBase3.default);

exports.default = InputField;