import React from 'react';
import FormBase from '../FormBase';

export default class BasicForm extends FormBase {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form onSubmit={this.props.onSubmit || this.onSubmit} method={this.props.method}>
        <fieldset>
          <div className='fields'>
            {this.props.children}
          </div>
          <div className='buttons'>
            <button type='submit' className='submit-btn'>{this.props.submitText}</button>
          </div>
        </fieldset>
      </form>
    );
  }
}
