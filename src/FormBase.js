/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module FormBase
 */
import React from 'react';
import Qs from 'qs';
import _ from 'lodash';

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
export default class FormBase extends React.Component {

  /**
   * Form constructor.
   *
   * @constructs Form
   */
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Render is only to be overwritten.
   * @throws {Error}
   */
  render() {
    throw new Error('This class should not be implemented directly.');
  }

  /**
   * A basic example for an onSubmit callback. You will definitely want to
   * create your own so you can actually do something with the data.
   *
   * @param {object} SyntheticEvent
   * @return {void}
   */
  onSubmit(event) {
    this.validate((valid) => {
      if (valid) {
        // Do things with serialization.
      }
    });
    event.preventDefault();
  }

  /**
   * Force all fields to validate. This should be called onSubmit. It will force
   * all fields to validate.
   *
   * To trigger the validation on the child elements we dispatch a custom event
   * called "validate" on the raw DOM elements. Upon mounting, all fields are
   * setup to listen to this event.
   *
   * Lastly, we do a dirty async check to see if any of the inputs have a
   * validation error based on their class name. A few milliseconds for slower
   * browsers...
   *
   * @param {function} fn(valid){}
   * @return {void} true
   */
  validate(fn) {
    const node = React.findDOMNode(this);
    let len = node.elements.length;
    let i = 0;
    let valid = true;
    let event = document.createEvent('Event');
    event.initEvent('validate', true, true);

    function trigger() {
      node.elements[i].dispatchEvent(event);
      setTimeout(() => {
        if (valid && /error/.test(node.elements[i].getAttribute('class'))) {
          valid = false;
        }
        if (i + 1 === len && fn) {
          fn(valid);
        } else {
          trigger(++i);
        }
      }, 2);
    }
    trigger();
  }

  /**
   * Returns a object containing all serialized values from the fields in the
   * form.
   *
   * @return {array} collection
   */
  serialize() {
    const node = React.findDOMNode(this);
    const CACHE_KEY = '___CACHE___';
    const NUMBER_LIKE = /^[0-9.]+$/;
    let valCache = {};
    let data;
    let queryStr = '';
    let json;
    let val;
    let len = node.elements.length;

    function mutateValues(obj) {
      _.forEach(obj, function(v, k) {
        if (_.isObject(v) || _.isArray(v)) {
          return mutateValues(v);
        }
        if (v === 'null') {
          obj[k] = null;
        } else if (valCache[v]) {
          obj[k] = valCache[v];
        } else if (NUMBER_LIKE.test(v)) {
          obj[k] = parseFloat(v);
        }
      });
    }

    for (let i = 0; i < len; i++) {
      if (typeof node.elements[i].getAttribute('data-serial') === 'string') {
        json = JSON.parse(node.elements[i].getAttribute('data-serial'));
        if (_.isObject(json.value) || _.isArray(json.value)) {
          val = CACHE_KEY + i;
          valCache[val] = json.value;
        } else {
          if (node.elements[i].type === 'file' && node.elements[i].value) {
            val = CACHE_KEY + i;
            valCache[val] = node.elements[i].files;
          } else if (node.elements[i].type === 'radio') {
            if (node.elements[i].checked) {
              val = node.elements[i].value;
            } else {
              continue;
            }
          } else if (json.value === 'null') {
            val = null;
          } else if (node.elements[i].type === 'date') {
            val = json.value;
          } else if (/^[0-9.]+$/.test(json.value)) {
            val = parseFloat(json.value);
          } else {
            val = json.value;
          }
        }
        queryStr = queryStr + '&' + json.name + '=' + encodeURIComponent(val);
      }
    }
    data = Qs.parse(queryStr, {
      depth: Infinity,
      parameterLimit: Infinity,
      arrayLimit: Infinity
    });
    mutateValues(data);
    return data;
  }
}

/**
 * Default properties.
 */
FormBase.defaultProps = {
  method: 'post',
  submitText: 'Submit',
  isLoading: false
};

/**
 * Require some properties for sanity.
 */
FormBase.propTypes = {
  method: React.PropTypes.string.isRequired,
  submitText: React.PropTypes.string.isRequired,
  isLoading: React.PropTypes.bool.isRequired
};
