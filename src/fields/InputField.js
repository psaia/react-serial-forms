import React from 'react';
import InputBase from '../InputBase';

export default class InputField extends InputBase {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    super.componentWillMount();
    this.updateAttrs(
      {
        type: 'text'
      },
      this.props
    );
  }
  /**
   * We need special detection for checkboxes.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    let val;
    switch (event.target.type) {
      case 'checkbox':
        val = event.target.checked ? 'on' : 'off';
        break;
      default:
        return super.onChange(event);
    }
    this.updateAttrs({
      value: val
    });
  }
  render() {
    let attrs = this.attrs();
    let errMessage = <span />;

    if (this.state.error === null) {
      attrs.className += ' idle';
    } else if (this.state.error === false) {
      attrs.className += ' success';
    } else if (this.hasError()) {
      attrs.className += ' error';
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
