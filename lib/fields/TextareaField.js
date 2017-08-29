'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputBase2 = require('../InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextareaField = function (_InputBase) {
  _inherits(TextareaField, _InputBase);

  function TextareaField(props) {
    _classCallCheck(this, TextareaField);

    return _possibleConstructorReturn(this, (TextareaField.__proto__ || Object.getPrototypeOf(TextareaField)).call(this, props));
  }

  _createClass(TextareaField, [{
    key: 'onChange',
    value: function onChange(event) {
      this.updateValue(event.target.value);

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var errMessage = _react2.default.createElement('span', null);
      var attrs = this.attrs();

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
        _react2.default.createElement('textarea', attrs),
        errMessage
      );
    }
  }]);

  return TextareaField;
}(_InputBase3.default);

exports.default = TextareaField;