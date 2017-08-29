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

var _InputBase2 = require('../InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var TextareaField = (function (_InputBase) {
  _inherits(TextareaField, _InputBase);

  function TextareaField(props) {
    _classCallCheck(this, TextareaField);

    _get(Object.getPrototypeOf(TextareaField.prototype), 'constructor', this).call(this, props);
  }

  _createClass(TextareaField, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _get(Object.getPrototypeOf(TextareaField.prototype), 'componentWillMount', this).call(this);
      this.updateAttrs(this.props);
    }
  }, {
    key: 'render',
    value: function render() {
      var attrs = this.attrs();
      var errMessage = _react2['default'].createElement('span', null);

      if (this.state.error === null) {
        attrs.className += ' idle';
      } else if (this.state.error === false) {
        attrs.className += ' success';
      } else if (this.hasError()) {
        attrs.className += ' error';
        errMessage = _react2['default'].createElement(
          'span',
          { className: 'err-msg' },
          this.state.error.message
        );
      }
      return _react2['default'].createElement(
        'span',
        { className: 'serial-input-wrapper' },
        _react2['default'].createElement('textarea', attrs),
        errMessage
      );
    }
  }]);

  return TextareaField;
})(_InputBase3['default']);

exports['default'] = TextareaField;
module.exports = exports['default'];