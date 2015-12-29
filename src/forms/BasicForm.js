import React from 'react';
import FormBase from '../FormBase';

export default class BasicForm extends FormBase {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form {...this.props} onSubmit={this.props.onSubmit || this.onSubmit} method={this.props.method}>
        {this.props.children}
      </form>
    );
  }
}
