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
import {isObject, isArray, forEach, filter, map, size} from 'lodash';
import qs from './qs';

const state = {};

export const registerForm = function(formName) {
  if (state[formName]) {
    state[formName] = null;
  }
  state[formName] = {};
  return state;
};

export const registerInput = function(formName, inputName, initialValue, validate) {
  const { form } = _getInputValueAndEvent(formName);
  form[inputName] = {
    value: initialValue,
    validate: validate
  };
  return form[inputName];
};

export const destroyForm = function(formName) {
  if (state[formName]) {
    state[formName] = null;
    delete state[formName];
  }
};

export const destroyInput = function(formName, inputName) {
  if (state[formName][inputName]) {
    state[formName][inputName].validate = null;
    state[formName][inputName].value = null;
    delete state[formName][inputName];
  }
};

export const inputValue = function(formName, inputName, value) {
  const { form } = _getInputValueAndEvent(formName);
  if (value !== undefined) {
    form[inputName].value = value;
    return value;
  } else {
    return form[inputName].value;
  }
};

export const validateForm = function(formName, onComplete = () => {}) {
  const { form } = _getInputValueAndEvent(formName);
  const errors = [];
  const len = size(form);
  let i = 0;
  const fieldValidated = (err) => {
    if (err) {
      errors.push(err);
    }
    if (++i === len) {
      onComplete(errors.length ? errors : false);
    }
  };
  forEach(form, field => field.validate(fieldValidated));
};

export const serializeForm = function(formName) {
  const { form } = _getInputValueAndEvent(formName);
  const CACHE_KEY = '___CACHE___';
  let valCache = {};
  let data;
  let queryStr = '';
  let val;
  let len = size(state);
  let i = 0;

  function mutateValues(obj) {
    forEach(obj, function(v, k) {
      if (isObject(v) || isArray(v)) {
        return mutateValues(v);
      } else {
        obj[k] = valCache[v];
      }
    });
  }

  forEach(form, (v, k) => {
    val = `${CACHE_KEY}${i++}`;
    valCache[val] = v.value === undefined ? null : v.value;
    queryStr = `${queryStr}&${k}=${val}`;
  });

  data = qs(queryStr);
  mutateValues(data);
  return data;
};

const _getInputValueAndEvent = function(formName, inputName) {
  const form = state[formName];

  if (!form) {
    throw new Error(`Could not find ${formName}. Is the form registered?.`);
  }

  if (inputName === undefined) {
    return {
      form
    };
  } else {
    const inputValue = form[inputName].value;
    return {
      form,
      inputValue
    };
  }
};
