import React from 'react';
import InputBase from '../InputBase';
import { assign } from 'lodash';

export default class SelectField extends InputBase {
  constructor(props) {
    super(props);
  }
  getInitialValue() {
    if (this.props.defaultValue !== undefined) {
      return this.props.defaultValue;
    }

    if (this.props.value !== undefined) {
      return this.props.value;
    }

    return this.props.multiple ? [] : '';
  }

  originalOnChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event);
    }
  }

  /**
   * Multiselect needs an array for the value.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    if (!event.target.multiple) {
      this.updateValue(event.target.value);
      this.originalOnChange(event);
      return;
    }

    const options = event.target.options;
    const val = [];
    const len = options.length;

    for (let i = 0; i < len; i++) {
      if (options[i].selected) {
        val.push(options[i].value);
      }
    }

    this.updateValue(val);
    this.originalOnChange(event);
  }

  /**
   * Build the component.
   *
   * @return {object} ReactElement
   */
  render() {
    let errMessage = <span />;
    const attrs = this.attrs();

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
        <select {...attrs}>
          {attrs.options.map((option, index) => {
            return (
              <option value={option.value} key={index}>{option.text}</option>
            );
          })}
        </select>
        {errMessage}
      </span>
    );
  }
}
