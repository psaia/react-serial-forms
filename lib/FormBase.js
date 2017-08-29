'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _state = require('./state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2015, Lev Interactive, LLC.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module FormBase
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


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
var FormBase = function (_React$Component) {
  _inherits(FormBase, _React$Component);

  /**
   * Form constructor. Here we set a unqiue random string to be the identifier
   * for the initiated form. A weak random string should be good enough for us.
   *
   * @constructs Form
   */
  function FormBase(props) {
    _classCallCheck(this, FormBase);

    var _this = _possibleConstructorReturn(this, (FormBase.__proto__ || Object.getPrototypeOf(FormBase)).call(this, props));

    _this.__NAME__ = Math.random().toString(36).substring(7);
    return _this;
  }

  /**
   * Register the form within the state before it mounts.
   */


  _createClass(FormBase, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _state.registerForm)(this.__NAME__);
    }

    /**
     * Remove form from memory on unmount.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _state.destroyForm)(this.__NAME__);
    }

    /**
     * Grab the context which will be used to pass inputs information.
     *
     * @return {object}
     */

  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        formName: this.__NAME__
      };
    }

    /**
     * Causes all fields in the form to validate.
     *
     * @return {object} Returns a promise.
     */

  }, {
    key: 'validate',
    value: function validate() {
      var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      return (0, _state.validateForm)(this.__NAME__, func);
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
      return (0, _state.serializeForm)(this.__NAME__);
    }

    /**
     * Render is only to be overwritten.
     *
     * @throws {Error}
     */

  }, {
    key: 'render',
    value: function render() {
      throw new Error('Must implement.');
    }

    /**
     * onSubmit is only to be overwritten.
     *
     * @param {object} SyntheticEvent
     * @return {void}
     */

  }, {
    key: 'onSubmit',
    value: function onSubmit(event) {
      throw new Error('Must implement.');
    }
  }]);

  return FormBase;
}(_react2.default.Component);

/**
 * Default properties.
 */


exports.default = FormBase;
FormBase.defaultProps = {
  method: 'post',
  submitText: 'Submit',
  isLoading: false
};

/**
 * Require some properties for sanity.
 */
FormBase.propTypes = {
  method: _react2.default.PropTypes.string.isRequired,
  submitText: _react2.default.PropTypes.string.isRequired,
  isLoading: _react2.default.PropTypes.bool.isRequired
};

/**
 * Define context types.
 */
FormBase.childContextTypes = {
  formName: _react2.default.PropTypes.string.isRequired
};