'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _state = require('./state');

var _ValidationError = require('./ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _validation = require('./validation');

var _validation2 = _interopRequireDefault(_validation);

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module InputBase
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Any field should implement this react component. This class will supply the
 * building blocks to implement any type of interactive component.
 *
 * @class InputBase
 * @extends React.Component
 */
var InputBase = function (_React$Component) {
  _inherits(InputBase, _React$Component);

  /**
   * Setup initial field state.
   *
   * @constructs InputBase
   * @param {object} props
   */
  function InputBase(props) {
    _classCallCheck(this, InputBase);

    var _this = _possibleConstructorReturn(this, (InputBase.__proto__ || Object.getPrototypeOf(InputBase)).call(this, props));

    _this.validators = [];
    _this._onChange = null;
    _this._hasMounted = false;
    _this.state = {
      error: null,
      value: props.initialValue
    };
    return _this;
  }

  /**
   * Add relevant validators and save the original onChange if one was provided.
   *
   * @return {void}
   */


  _createClass(InputBase, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      (0, _state.registerInput)(this.context.formName, this.props.name, this.getInitialValue(), this.validate.bind(this));

      this.setState({
        value: this.getInitialValue()
      });

      var availableValidators = _validation2.default.collection();

      if (this.props.validation) {
        (function () {
          var types = _this2.props.validation.split(',');
          var i = 0;
          for (var len = types.length; i < len; i++) {
            (0, _lodash.forEach)(availableValidators, function (validator) {
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
      this._hasMounted = true;
    }

    /**
     * Remove from memory.
     *
     * @return {void}
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _state.destroyInput)(this.context.formName, this.props.name);
    }

    /**
     * Check if the value attribute was explicitly updated. If it was, update the
     * state's value.
     *
     * @return {void}
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== undefined && nextProps.value !== this.props.value) {
        this.setValueState(nextProps.value);
      }
    }

    /**
     * This will set both the global and internal state for the component.
     *
     * @param {mixed}
     * @return {void}
     */

  }, {
    key: 'setValueState',
    value: function setValueState(val) {
      (0, _state.inputValue)(this.context.formName, this.props.name, val);
      this.setState({
        value: val
      });
    }

    /**
     * Returns the properties for a given element.
     *
     * @return {object}
     */

  }, {
    key: 'attrs',
    value: function attrs(props) {
      var attrs = (0, _lodash.assign)({}, this.props, {
        onChange: this.onChange.bind(this),
        value: this.state.value
      }, props || {});

      return attrs;
    }

    /**
     * This is only called when the component is mounting. It adds some logic to
     * determine which value to use as a default based on a props.
     *
     * @return {mixed}
     */

  }, {
    key: 'getInitialValue',
    value: function getInitialValue() {
      if (this.props.defaultValue !== undefined) {
        return this.props.defaultValue;
      }

      if (this.props.value !== undefined) {
        return this.props.value;
      }

      return '';
    }

    /**
     * Format the class name based on the error state.
     *
     * @return {string}
     */

  }, {
    key: 'getClassName',
    value: function getClassName() {
      if (this.state.error === null) {
        return 'serial-form-input fresh';
      } else if (this.state.error === false) {
        return 'serial-form-input valid';
      } else if (this.state.error) {
        return 'serial-form-input invalid';
      }

      return '';
    }

    /**
     * Update the value for the field. This should be called in the extending
     * class whenever the calue should be updated.
     *
     * @param {mixed} Any value.
     * @return {void}
     */

  }, {
    key: 'updateValue',
    value: function updateValue(value) {
      this.setValueState(value);
      this.validate();
    }

    /**
     * Using the validators specified, this will validate the value.
     *
     * @return {object}
     */

  }, {
    key: 'validate',
    value: function validate() {
      var _this3 = this;

      var onComplete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      var formName = this.context.formName;
      var inputName = this.props.name;
      var msgs = this.props.messages;
      var value = (0, _state.inputValue)(formName, inputName);
      var len = this.validators.length;
      var errors = [];
      var i = 0;
      var createError = function createError(validator) {
        var msg = void 0;
        if (!validator === undefined || validator === null) {
          msg = 'Invalid.';
        } else if (typeof validator === 'string') {
          msg = validator;
        } else {
          var name = validator.name;
          var validatorMsg = validator.message;

          if (msgs && msgs[name]) {
            msg = msgs[name];
          } else {
            msg = validatorMsg;
          }
        }
        return new _ValidationError2.default(msg);
      };
      var _validate = function _validate() {
        var _v = _this3.validators[i++];

        var pass = function pass() {
          (0, _lodash.defer)(_validate);
        };

        var fail = function fail(passedErr) {
          var err = createError(passedErr ? passedErr : _v);
          errors.push(err);
          (0, _lodash.defer)(_validate);
        };

        if (_v) {
          return _v.determine(value, pass, fail);
        }

        if (errors.length) {
          return _this3.setState({
            error: errors[errors.length - 1]
          }, function () {
            return onComplete(errors[errors.length - 1]);
          });
        }

        _this3.setState({
          error: false
        }, function () {
          return onComplete(false);
        });
      };

      this.setState({
        error: false
      }, _validate);
    }

    /**
     * This method must be called when the field as changed. It must get the value
     * and set a value.
     *
     * @param {object} event
     * @return {void}
     */

  }, {
    key: 'onChange',
    value: function onChange(event) {
      throw new Error('Must implement.');
    }

    /**
     * Must be implemented.
     */

  }, {
    key: 'render',
    value: function render() {
      throw new Error('Must implement.');
    }
  }]);

  return InputBase;
}(_react2.default.Component);

/**
 * Required properties for an input component.
 *
 * @static
 * @type {object}
 */


exports.default = InputBase;
InputBase.defaultProps = {
  initialValue: ''
};

/**
 * Validation for properties.
 *
 * @static
 * @type {object}
 */
InputBase.propTypes = {
  name: _react2.default.PropTypes.string.isRequired,
  className: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func
};

/**
 * Context types.
 *
 * @static
 * @type {object}
 */
InputBase.contextTypes = {
  formName: _react2.default.PropTypes.string.isRequired
};