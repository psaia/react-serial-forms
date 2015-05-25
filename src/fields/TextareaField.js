import React from 'react';
import InputBase from '../InputBase';

export default class TextareaField extends InputBase {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    super.componentWillMount();
    this.updateAttrs(this.props);
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
        <textarea {...attrs} />
        {errMessage}
      </span>
    );
  }
}
