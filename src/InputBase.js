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
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import { assign, noop } from 'lodash';
import { registerInput, inputValue, destroyInput } from './state';
import ValidationError from './ValidationError';
import validation from './validation';
import Promise from 'bluebird';

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
      error: null
    };
  }

  /**
   * Add relevant validators and save the original onChange if one was provided.
   *
   * @return {void}
   */
  componentWillMount() {
    registerInput(
      this.context.formName,
      this.props.name,
      this.getInitialValue(),
      this.validate.bind(this)
    );

    const availableValidators = validation.collection();

    if (this.props.validation) {
      let types = this.props.validation.split(',');
      let i = 0;
      for (let len = types.length; i < len; i++) {
        availableValidators.forEach((validator) => {
          if (types[i].trim() === validator.name) {
            this.validators.push(validator);
          }
        });
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
  }

  /**
   * Remove from memory.
   *
   * @return {void}
   */
  componentWillUnmount() {
    destroyInput(this.context.formName, this.props.name);
  }

  /**
   * If updating with a new value, update the state.
   *
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    const val = inputValue(this.context.formName, this.props.name);

    if (nextProps.value !== val) {
      inputValue(this.context.formName, this.props.name, nextProps.value);
      this.validate().catch(noop);
    }
  }

  /**
   * This is only called when the component is mounting. It adds some logic to
   * determine which value to use as a default based on a props.
   *
   * @return {mixed}
   */
  getInitialValue() {
    if (this.props.defaultValue !== undefined) {
      return this.props.defaultValue;
    }

    if (this.props.value !== undefined) {
      return this.props.value;
    }

    return null;
  }

  /**
   * Format the class name based on the error state.
   *
   * @return {string}
   */
  getClassName() {
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
  updateValue(value) {
    inputValue(this.context.formName, this.props.name, value);
    this.validate().catch(noop);
  }

  /**
   * Using the validators specified, this will validate the value.
   *
   * @return {object} Promise
   */
  validate() {
    const formName = this.context.formName;
    const inputName = this.props.name;
    const opts = this.props.formopts;
    const value = inputValue(formName, inputName);

    return new Promise((resolve, reject) => {
      const onValid = () => {
        this.setState({
          error: false
        });
        resolve();
      };

      const onInvalid = (validator) => {
        let err;
        let msg;
        if (!validator === undefined || validator === null) {
          msg = 'Invalid.';
        } else if (typeof validator === 'string') {
          msg = validator;
        } else {
          const name = validator.name;
          const validatorMsg = validator.message;

          if (opts && opts.messages && opts.messages[name]) {
            msg = opts.messages[name];
          } else {
            msg = validatorMsg;
          }
        }

        err = new ValidationError(msg);

        this.setState({
          error: err
        });

        return err;
      };

      const checks = this.validators.map((v) => {
        return new Promise((_resolve, _reject) => {
          const __reject = (passedErr) => {
            const err = onInvalid(passedErr ? passedErr : v);
            _reject(err);
            reject(err);
          };
          v.determine(value, _resolve, __reject);
        });
      });

      Promise.all(checks).then(onValid).catch(noop);
    });
  }

  /**
   * This method must be called when the field as changed. It must get the value
   * and set a value.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    throw new Error('Must implement.');
  }

  /**
   * Must be implemented.
   */
  render() {
    throw new Error('Must implement.');
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
  name: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  onChange: React.PropTypes.func
};

/**
 * Context types.
 *
 * @static
 * @type {object}
 */
InputBase.contextTypes = {
  formName: React.PropTypes.string.isRequired
};
