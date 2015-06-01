/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module InputBase
 */
import React from 'react';
import { Map } from 'immutable';
import ValidationError from './ValidationError';
import * as validators from './validators';

/**
 * Any field should implement this react component. This class will supply the
 * building blocks to implement any type of interactive component.
 *
 * @class InputBase
 * @extends React.Component
 */
export default class InputBase extends React.Component {
  /**
   * Setup initial field state.
   *
   * @constructs InputBase
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.validators = [];
    this._onChange = null;
    this._hasMounted = false;
    this.state = {
      error: false,
      attrs: Map({
        className: 'serial-form-input',
        'data-serial': '{}',
        onBlur: () => {
          this.validate();
        },
        value: null
      })
    };
  }

  /**
   * Add relevant validators and save the original onChange if one was provided.
   *
   * @return {void}
   */
  componentWillMount() {
    this._onChange = this.props.onChange;
    this.updateAttrs(this.props);

    if (this.props.validation) {
      let types = this.props.validation.split(',');
      let i = 0;
      for (let len = types.length; i < len; i++) {
        switch (types[i].trim()) {
          case 'required' :
            this.validators.push(validators.isRequired);
            break;
          case 'email':
            this.validators.push(validators.isEmail);
            break;
          case 'numeral':
            this.validators.push(validators.isNumeral);
            break;
          default:
            throw new Error('The validator supplied does not exist.');
        }
      }
    }
  }

  /**
   * Once the field has mounted we're attaching a real change event listener on
   * the actual dom element. This will allow us to manually trigger a real event
   * when we want to force the form to validate.
   *
   * @return {void}
   */
  componentDidMount() {
    this._hasMounted = true;
    React.findDOMNode(this).addEventListener('validate', (e) => {
      this.setState({
        error: this.validate(this.attrs(true).get('value'))
      });
    });
  }

  /**
   * A custom implementation using immutable.js comparisons.
   *
   * @param {object} nextProps
   * @param {object} nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    let attrsAreSame = this.state.attrs.equals(nextState.attrs);
    let errsAreSame = this.state.error === nextState.error;
    if (!attrsAreSame || !errsAreSame) {
      return true;
    }
    return false;
  }

  /**
   * Update state with new incoming props.
   *
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    this.updateAttrs(nextProps);
  }

  /**
   * A normalized and serialized json object to be stored as the data-serial
   * attribute for the field.
   *
   * @param {?object} obj Immutable object to be used instead of the current
   *                      state's attr.
   * @return {string} serial { name: '<field name>', value: '<value>' }
   */
  serialize(obj) {
    let attrs = obj || this.state.attrs;
    let mutableAttrs = attrs.toJS();
    return JSON.stringify({
       name: mutableAttrs.name,
       value: validators._isSupplied(mutableAttrs.value) ?
         mutableAttrs.value :
         null
    });
  }

  /**
   * All attributes for the field as an object.
   *
   * @param {boolean} immutable If true will return a immutable Map.
   * @return {object} attrs
   */
  attrs(immutable) {
    if (immutable) {
      return this.state.attrs;
    }
    return this.state.attrs.toJS();
  }

  /**
   * Used to easily determine if there is a validation error or not.
   *
   * @return {boolean} error
   */
  hasError() {
    return this.state.error instanceof ValidationError;
  }

  /**
   * Call this to update the attrs state. This will automatically set the
   * serial and validate the value for errors. It's necessary that this gets
   * called onChange with the updated value. This is also useful for setting
   * default properties for a field in componentWillMount.
   *
   * Note that validate() is not called durning the initial render which assigns
   * error to null. This essentially puts the field in a "idle" state.
   *
   * this.updateAttrs({ value: 'foo', x: 1 }, { value: 'bar' }, onStateUpdate);
   *  // => { value: 'bar', x: 1 }
   *
   * @param {...object} object Objects will be merged from right to left.
   * @return {void}
   */
  updateAttrs() {
    let opts = [];
    let updated = function() {};
    let len = arguments.length;

    for (let i = 0; i < len; i++) {
      if (typeof arguments[i] === 'function') {
        updated = arguments[i];
      } else if (typeof arguments[i] === 'object') {
        opts.push(arguments[i]);
      }
    }

    opts.push({
      onChange: this.onChange.bind(this)
    });

    this.setState(prev => {
      let obj = {
        attrs: prev.attrs.merge.apply(prev.attrs, opts)
      };
      obj.attrs = obj.attrs.update('data-serial', v => this.serialize(obj.attrs));
      obj.error = this._hasMounted ? this.validate(obj.attrs.toJS().value) : null;
      return obj;
    }, updated);
  }

  /**
   * This method must be called when the field as changed. It must get the value
   * and set a value.
   *
   * It's also important that this.ogOnChange gets called so if there was an
   * actual onChange on the input, it will still get called.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    const val = event.target.value;
    this.updateAttrs({
      value: val
    }, this.ogOnChange.bind(this, event));
  }

  /**
   * If a onChange was applied on the field it will still get called here.
   *
   * @param {object} event The SyntheticEvent.
   * @return {void}
   */
  ogOnChange(event) {
    if (this._onChange) {
      this._onChange(event);
    }
  }

  /**
   * Using the validators specified, this will validate the value.
   *
   * @param {?value} value If not set, the state value will be used.
   * @return {mixed} null if valid but not supplied, ValidationError if invalid,
   *                 false if supplied and valid.
   */
  validate(value) {
    let val = value !== null ? value : this.attrs(true).get('value');
    let len = this.validators.length;
    let i = 0;
    for (; i < len; i++) {
      if (this.validators[i].invalid(val)) {
        return new ValidationError(this.validators[i].message);
      }
    }
    if (!validators._isSupplied(val)) {
      return null;
    }
    return false;
  }

  /**
   * Must be implemented.
   */
  render() {
    throw new Error('This class should not be implemented directly.');
  }
}

/**
 * Required properties for an input component.
 *
 * @static
 * @type {object}
 */
InputBase.defaultProps = {};

/**
 * Validation for properties.
 *
 * @static
 * @type {object}
 */
InputBase.propTypes = {
  name: React.PropTypes.string.isRequired
};

