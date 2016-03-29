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
import { Map } from 'immutable';
import { isObject, isArray, forEach, filter, map, noop } from 'lodash';
import qs from './qs';

let state = new Map();
const forms = {};

export const registerForm = function(formName) {
  state = state.set(formName, new Map());
  if (forms[formName]) {
    forms[formName] = null;
  }
  forms[formName] = {};
  return state;
};

export const registerInput = function(formName, inputName, initialValue, validate) {
  const form = state.get(formName);
  if (!form) {
    throw new Error(`Form "${formName}" was never registered.`);
  }
  state = state.setIn([formName, inputName], initialValue);
  forms[formName][inputName] = {
    validate: validate
  };
  return forms[formName][inputName];
};

export const destroyForm = function(formName) {
  state = state.delete(formName);
  if (forms[formName]) {
    forms[formName] = null;
    delete forms[formName];
  }
};

export const destroyInput = function(formName, inputName) {
  if (forms[formName][inputName]) {
    forms[formName][inputName].validate = null;
    delete forms[formName][inputName];
  }
  state = state.deleteIn([formName, inputName]);
};

export const inputValue = function(formName, inputName, value) {
  if (value !== undefined) {
    state = state.setIn([formName, inputName], value);
  } else {
    return state.getIn([formName, inputName]);
  }
};

export const validateForm = function(formName) {
  return new Promise((resolve, reject) => {
    Promise.all(map(forms[formName], f => f.validate()))
      .then(resolve)
      .catch(reject);
  });
};

export const serializeForm = function(formName) {
  const { form } = _getInputValueAndEvent(formName);
  const CACHE_KEY = '___CACHE___';
  let valCache = {};
  let data;
  let queryStr = '';
  let val;
  let len = form.count();
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

  form.forEach((v, k) => {
    val = `${CACHE_KEY}${i++}`;
    valCache[val] = v === undefined ? null : v;
    queryStr = queryStr + '&' + k + '=' + val;
  });

  data = qs(queryStr);
  mutateValues(data);
  return data;
};

const _getInputValueAndEvent = function(formName, inputName) {
  const form = state.get(formName);

  if (!form) {
    throw new Error(`Could not find ${formName}. Is the form registered?.`);
  }

  if (inputName === undefined) {
    return { form };
  } else {
    const inputValue = form.get(inputName);
    return {
      form,
      inputValue
    };
  }
};
