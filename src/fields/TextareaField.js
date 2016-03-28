import React from 'react';
import InputBase from '../InputBase';
import { assign } from 'lodash';

export default class TextareaField extends InputBase {
  constructor(props) {
    super(props);
  }
  onChange(event) {
    this.updateValue(event.target.value);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event);
    }
  }
  render() {
    let errMessage = <span />;

    const attrs = assign({}, this.props, {
      onChange: this.onChange.bind(this)
    });

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
        <textarea {...attrs} />
        {errMessage}
      </span>
    );
  }
}
