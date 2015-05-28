import React from 'react';
import InputBase from '../InputBase';

export default class SelectField extends InputBase {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    super.componentWillMount();
    this.updateAttrs(
      {
        options: []
      },
      this.props
    );
  }

  /**
   * Multiselect needs an array for the value.
   *
   * @param {object} event
   * @return {void}
   */
  onChange(event) {
    if (!event.target.multiple) {
      return super.onChange(event);
    }
    let options = event.target.options;
    let val = [];
    let len = options.length;
    for (let i = 0; i < len; i++) {
      if (options[i].selected) {
        val.push(options[i].value);
      }
    }
    this.updateAttrs({
      value: val
    }, this.orgOnChange.bind(this, event));
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
