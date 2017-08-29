'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2015, Lev Interactive, LLC.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module validation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _isSupplied = function _isSupplied(val) {
  var value = val;
  if (val && val.size && val.toJS) {
    value = val.toJS();
  }
  if (_lodash2.default.isDate(value)) {
    return true;
  }
  if (_lodash2.default.isArray(value) && _lodash2.default.isEmpty(value)) {
    return false;
  }
  if (_lodash2.default.isObject(value) && _lodash2.default.isEmpty(value)) {
    return false;
  }
  if (_lodash2.default.isNull(value) || _lodash2.default.isUndefined(value)) {
    return false;
  }
  if (_lodash2.default.isNumber(value)) {
    return true;
  }
  return !_lodash2.default.isEmpty(value);
};

var Validation = function () {
  function Validation() {
    _classCallCheck(this, Validation);

    this._VALIDATOR_CACHE_ = {};
    this._isSupplied = _isSupplied;
  }

  _createClass(Validation, [{
    key: 'registerValidator',
    value: function registerValidator(validationObject) {
      if (!validationObject) {
        throw new Error('A validation object is required.');
      }
      if (!validationObject.name) {
        throw new Error('A \'name\' string is required.');
      }
      if (!validationObject.determine) {
        throw new Error('A \'determine\' method is required.');
      }
      if (!validationObject.message) {
        throw new Error('A \'message\' string is required.');
      }

      this._VALIDATOR_CACHE_[validationObject.name] = validationObject;
    }
  }, {
    key: 'collection',
    value: function collection() {
      return this._VALIDATOR_CACHE_;
    }
  }]);

  return Validation;
}();

var validation = new Validation();

/**
 * Register some basic defaults.
 */

validation.registerValidator({
  name: 'required',
  determine: function determine(value, pass, fail) {
    if (_isSupplied(value)) {
      return pass();
    }
    fail();
  },
  message: 'This field is required.'
});

validation.registerValidator({
  name: 'email',
  determine: function determine(value, pass, fail) {
    var EMAIL_PATTERN = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (_isSupplied(value) && !EMAIL_PATTERN.test(value)) {
      return fail();
    }
    pass();
  },
  message: 'Email is invalid.'
});

validation.registerValidator({
  name: 'numeral',
  determine: function determine(value, pass, fail) {
    if (_isSupplied(value) && !/^[0-9.]+$/.test(value)) {
      return fail();
    }
    pass();
  },
  message: 'Must be a number.'
});

exports.default = validation;