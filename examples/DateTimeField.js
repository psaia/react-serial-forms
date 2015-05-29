/**
 * This is an example of a DateTime picker being extended from the React Widgets
 * library.
 *
 * We're also using the Bootstrap Input to help with displaying a nice error
 * message (if the field is required) and a label.
 *
 * { @see { @link http://jquense.github.io/react-widgets/docs/#/datetime-picker } }
 * @example
 *  <DateTimeField value={mydate} name='expiration' />
 */
import React from 'react';
import { InputBase } from 'react-serial-forms';
import { Input as BootstrapInput } from 'react-bootstrap';
import { DateTimePicker } from 'react-widgets';

/**
 * @constructor DateTimeField
 * @extends InputBase
 */
export default class DateTimeField extends InputBase {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    super.componentWillMount();
    this.updateAttrs(this.props);
  }
  onChange(val) {
    this.updateAttrs({
      value: val && typeof val === 'object' ? val.getTime() : null
    }, this.ogOnChange.bind(this, val));
  }
  render() {
    let attrs = this.attrs();
    let hasError = this.hasError();
    let msg = hasError ? this.state.error.message : null;

    // Setup an object to pass to bootstrap's Input class to use as our label
    // and error message.
    let labelAttrs = {};

    if (msg) {
      labelAttrs.help = msg;
    }

    if (attrs.label) {
      labelAttrs.label = attrs.label;
    }

    // Apply classes based on state.
    if (this.state.error === null) {
      attrs.className += ' idle';
    } else if (this.state.error === false) {
      attrs.bsStyle = 'success';
      attrs.className += 'success';
    } else if (this.hasError()) {
      attrs.className += 'error';
      attrs.bsStyle = 'error';
    }

    // Convert the value into a Date object.
    if (attrs.value) {
      attrs.value = new Date(attrs.value);
    }

    // Don't apply these on the datepicker. Use only on a hidden field to be our
    // host input.
    let name = attrs.name;
    let serial = attrs['data-serial'];
    delete attrs.name;
    delete attrs['data-serial'];

    return (
      <BootstrapInput {...labelAttrs} wrapperClassName='wrapper'>
        <DateTimePicker {...attrs} />
        <input
          type='hidden'
          name={name}
          value={attrs.value}
          data-serial={serial} />
      </BootstrapInput>
    );
  }
}
