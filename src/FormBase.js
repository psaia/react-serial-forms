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
import ReactDOM from 'react-dom';
import { registerForm, serializeForm, destroyForm, validateForm } from './state';

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
   * Form constructor. Here we set a unqiue random string to be the identifier
   * for the initiated form. A weak random string should be good enough for us.
   *
   * @constructs Form
   */
  constructor(props) {
    super(props);
    this.__NAME__ = Math.random().toString(36).substring(7);
  }

  /**
   * Register the form within the state before it mounts.
   */
  componentWillMount() {
    registerForm(this.__NAME__);
  }

  /**
   * Remove form from memory on unmount.
   */
  componentWillUnmount() {
    destroyForm(this.__NAME__);
  }

  /**
   * Grab the context which will be used to pass inputs information.
   *
   * @return {object}
   */
  getChildContext() {
    return {
      formName: this.__NAME__
    };
  }

  /**
   * Causes all fields in the form to validate.
   *
   * @return {object} Returns a promise.
   */
  validate(func = () => {}) {
    return validateForm(this.__NAME__, func);
  }

  /**
   * Returns a object containing all serialized values from the fields in the
   * form.
   *
   * @return {array} collection
   */
  serialize() {
    return serializeForm(this.__NAME__);
  }

  /**
   * Render is only to be overwritten.
   *
   * @throws {Error}
   */
  render() {
    throw new Error('Must implement.');
  }

  /**
   * onSubmit is only to be overwritten.
   *
   * @param {object} SyntheticEvent
   * @return {void}
   */
  onSubmit(event) {
    throw new Error('Must implement.');
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

/**
 * Define context types.
 */
FormBase.childContextTypes = {
  formName: React.PropTypes.string.isRequired
};
