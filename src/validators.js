/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module validators
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

const EMAIL_PATTERN = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const required = {
  name: 'required',
  invalid: function(value) {
    return !_isSupplied(value);
  },
  message: 'This field is required.'
};

const email = {
  name: 'email',
  invalid: function(value) {
    return _isSupplied(value) && !EMAIL_PATTERN.test(value);
  },
  message: 'Email is invalid.'
};

const numeral = {
  name: 'numeral',
  invalid: function(value) {
    return _isSupplied(value) && !/^[0-9.]+$/.test(value);
  },
  message: 'Must be a number.'
};

export default {
  required,
  email,
  numeral,
  _isSupplied
};
