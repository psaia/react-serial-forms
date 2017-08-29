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

var SelectField = function (_InputBase) {
  _inherits(SelectField, _InputBase);

  function SelectField(props) {
    _classCallCheck(this, SelectField);

    return _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, props));
  }

  _createClass(SelectField, [{
    key: 'getInitialValue',
    value: function getInitialValue() {
      if (this.props.defaultValue !== undefined) {
        return this.props.defaultValue;
      }

      if (this.props.value !== undefined) {
        return this.props.value;
      }

      return this.props.multiple ? [] : '';
    }
  }, {
    key: 'originalOnChange',
    value: function originalOnChange(event) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
    }

    /**
     * Multiselect needs an array for the value.
     *
     * @param {object} event
     * @return {void}
     */

  }, {
    key: 'onChange',
    value: function onChange(event) {
      if (!event.target.multiple) {
        this.updateValue(event.target.value);
        this.originalOnChange(event);
        return;
      }

      var options = event.target.options;
      var val = [];
      var len = options.length;

      for (var i = 0; i < len; i++) {
        if (options[i].selected) {
          val.push(options[i].value);
        }
      }

      this.updateValue(val);
      this.originalOnChange(event);
    }

    /**
     * Build the component.
     *
     * @return {object} ReactElement
     */

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
        _react2.default.createElement(
          'select',
          attrs,
          attrs.options.map(function (option, index) {
            return _react2.default.createElement(
              'option',
              { value: option.value, key: index },
              option.text
            );
          })
        ),
        errMessage
      );
    }
  }]);

  return SelectField;
}(_InputBase3.default);

exports.default = SelectField;