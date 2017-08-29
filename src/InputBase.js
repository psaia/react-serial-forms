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
import { assign, noop, defer, forEach } from 'lodash';
import { registerInput, inputValue, destroyInput } from './state';
import ValidationError from './ValidationError';
import validation from './validation';

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
      error: null,
      value: props.initialValue
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

    this.setState({
      value: this.getInitialValue()
    });

    const availableValidators = validation.collection();

    if (this.props.validation) {
      const types = this.props.validation.split(',');
      let i = 0;
      for (let len = types.length; i < len; i++) {
        forEach(availableValidators, (validator) => {
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
   * Check if the value attribute was explicitly updated. If it was, update the
   * state's value.
   *
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
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
  setValueState(val) {
    inputValue(this.context.formName, this.props.name, val)
    this.setState({
      value: val
    });
  }

  /**
   * Returns the properties for a given element.
   *
   * @return {object}
   */
  attrs(props) {
    const attrs = assign({}, this.props, {
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
  getInitialValue() {
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
    this.setValueState(value);
    this.validate();
  }

  /**
   * Using the validators specified, this will validate the value.
   *
   * @return {object}
   */
  validate(onComplete = () => {}) {
    const formName = this.context.formName;
    const inputName = this.props.name;
    const msgs = this.props.messages;
    const value = inputValue(formName, inputName);
    const len = this.validators.length;
    const errors = [];
    let i = 0;
    const createError = (validator) => {
      let msg;
      if (!validator === undefined || validator === null) {
        msg = 'Invalid.';
      } else if (typeof validator === 'string') {
        msg = validator;
      } else {
        const name = validator.name;
        const validatorMsg = validator.message;

        if (msgs && msgs[name]) {
          msg = msgs[name];
        } else {
          msg = validatorMsg;
        }
      }
      return new ValidationError(msg);
    };
    const _validate = () => {
      const _v = this.validators[i++];

      const pass = () => {
        defer(_validate);
      };

      const fail = (passedErr) => {
        const err = createError(passedErr ? passedErr : _v);
        errors.push(err);
        defer(_validate);
      };

      if (_v) {
        return _v.determine(value, pass, fail);
      }

      if (errors.length) {
        return this.setState({
          error: errors[errors.length - 1]
        }, () => onComplete(errors[errors.length - 1]));
      }

      this.setState({
        error: false
      }, () => onComplete(false));
    }

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
