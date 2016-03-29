/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module validation
 */
import _ from 'lodash';

const _isSupplied = function(val) {
  let value = val;
  if (val && val.size && val.toJS) {
    value = val.toJS();
  }
  if (_.isArray(value) && _.isEmpty(value)) {
    return false;
  }
  if (_.isObject(value) && _.isEmpty(value)) {
    return false;
  }
  if (_.isNull(value) || _.isUndefined(value)) {
    return false;
  }
  if (_.isNumber(value)) {
    return true;
  }
  return !_.isEmpty(value);
};

class Validation {
  constructor() {
    this._VALIDATOR_CACHE_ = {};
    this._isSupplied = _isSupplied;
  }
  registerValidator(validationObject) {
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

    this._VALIDATOR_CACHE_[
      validationObject.name
    ] = validationObject;
  }
  collection() {
    return this._VALIDATOR_CACHE_;
  }
}


const validation = new Validation();

/**
 * Register some basic defaults.
 */

validation.registerValidator({
  name: 'required',
  determine: function(value, pass, fail) {
    if (_isSupplied(value)) {
      return pass();
    }
    fail();
  },
  message: 'This field is required.'
});

validation.registerValidator({
  name: 'email',
  determine: function(value, pass, fail) {
    const EMAIL_PATTERN = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (_isSupplied(value) && !EMAIL_PATTERN.test(value)) {
      return fail();
    }
    pass();
  },
  message: 'Email is invalid.'
});

validation.registerValidator({
  name: 'numeral',
  determine: function(value, pass, fail) {
    if (_isSupplied(value) && !/^[0-9.]+$/.test(value)) {
      return fail();
    }
    pass();
  },
  message: 'Must be a number.'
});

export default validation;
