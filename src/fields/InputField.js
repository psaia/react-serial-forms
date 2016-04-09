import React from 'react';
import InputBase from '../InputBase';
import { assign } from 'lodash';

export default class InputField extends InputBase {

  /**
   * @constructs InputField
   */
  constructor(props) {
    super(props);
  }

  /**
   * Special behavior for radio buttons.
   *
   * @return {void}
   */
  getInitialValue() {
    if (this.props.type === 'radio') {
      if (this.props.checked) {
        return this.props.value;
      } else {
        return null;
      }
    }
    return super.getInitialValue();
  }

  /**
   * Special behavior for various types.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    let val = null;
    const elType = event.nativeEvent.target.type;

    switch (elType) {
      case 'checkbox':
        val = event.target.checked ? 1 : 0;
        break;
      case 'number':
        val = parseFloat(event.target.value);
        if (isNaN(val)) {
          val = null;
        }
        break;
      case 'radio':
        if (event.target.checked) {
          val = event.target.value;
        }
        break;
      case 'file':
        if (event.target.value) {
          val = event.target;
        }
        break;
      default:
        val = event.target.value;
    }

    this.updateValue(val);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event);
    }
  }

  /**
   * @return {object} ReactElement
   */
  render() {
    const attrs = this.attrs();
    let errMessage = <span />;

    if (attrs.className) {
      attrs.className += ` ${this.getClassName()}`;
    } else {
      attrs.className = this.getClassName();
    }

    if (this.state.error) {
      errMessage = (
        <span className='err-msg'>
          {this.state.error.message}
        </span>
      );
    }

    return (
      <span className='serial-input-wrapper'>
        <input {...attrs} />
        {errMessage}
      </span>
    );
  }
}
