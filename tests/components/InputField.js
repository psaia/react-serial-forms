/*eslint-env mocha */
import chai from 'chai';

let React;
let ReactDOM;
let simulate;
let expect;
let TestUtils;
let validation;

let InputField;

// Render react element into the DOM.
const setupComponent = function(jsx) {
  let renderedComponent = TestUtils.renderIntoDocument(jsx);
  return ReactDOM.findDOMNode(renderedComponent);
};

// Load up react since the DOM is ready.
before(function() {
  React = require('react');
  ReactDOM = require('react-dom');
  InputField = require('../../src/fields/InputField.js');
  validation = require('../../src/validation.js');
  TestUtils = require('react-addons-test-utils');
  simulate = TestUtils.Simulate;
  expect = chai.expect;
});

describe('InputField', function() {
  it('should handle a simple non validating input', function() {
    const el = setupComponent(<InputField name='my-field' />);
    const input = el.querySelector('input');
    // Should have a wrapper.
    expect(el.getAttribute('class')).to.equal('serial-input-wrapper');

    // Idle.
    expect(input.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(input, { target: { value: 'foo' }});
    expect(input.getAttribute('class')).to.equal('serial-form-input success');

    // Back to idle.
    simulate.change(input, { target: { value: '' }});
    expect(input.getAttribute('class')).to.equal('serial-form-input idle');
  });

  it('should handle validation', function() {
    const el = setupComponent(<InputField name='my-field' validation='required,email' />);
    const input = el.querySelector('input');

    // Should start out idle.
    expect(input.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a bad email in.
    simulate.change(input, { target: { value: 'foo' }});
    expect(input.getAttribute('class')).to.equal('serial-form-input error');

    // Put a good email in.
    simulate.change(input, { target: { value: 'john@doe.com' }});
    expect(input.getAttribute('class')).to.equal('serial-form-input success');

    // Remove it all.. should be error since is required.
    simulate.change(input, { target: { value: '' }});
    expect(input.getAttribute('class')).to.equal('serial-form-input error');
  });

  it('should normalize serializations properly', function() {
    const el = setupComponent(<InputField name='my-field' validation='required' />);
    const input = el.querySelector('input');

    let serial = JSON.parse(input.getAttribute('data-serial'));
    expect(serial).eql({ name: 'my-field', value: null });

    simulate.change(input, { target: { value: 'foo' }});

    serial = JSON.parse(input.getAttribute('data-serial'));
    expect(serial).eql({ name: 'my-field', value: 'foo' });

    simulate.change(input, { target: { value: '' }});

    serial = JSON.parse(input.getAttribute('data-serial'));
    expect(serial).eql({ name: 'my-field', value: null });
  });

  it('should allow for customized validation messages', function() {
    let messages = {
      required: 'I am unqiue.'
    };
    let el = setupComponent(<InputField name='my-field' validation='required' messages={messages} />);
    let input = el.querySelector('input');

    simulate.change(input, { target: { value: 'abc' }});
    simulate.change(input, { target: { value: '' }});
    expect(el.querySelector('.err-msg').innerHTML).to.equal(messages.required);

    el = setupComponent(<InputField name='my-field' validation='required' />);
    input = el.querySelector('input');

    simulate.change(input, { target: { value: 'abc' }});
    simulate.change(input, { target: { value: '' }});
    expect(el.querySelector('.err-msg').innerHTML).to.equal(validation.collection().get('required').message);
  });

  it('should handle a customer validator', function() {
    validation.registerValidator({
      name: 'largerThanFive',
      invalid: function(value) {
        return value < 5;
      },
      message: 'The field should be larger than 5.'
    });

    let el = setupComponent(<InputField type='number' name='my-field' validation='largerThanFive' />);
    let input = el.querySelector('input');

    simulate.change(input, { target: { value: 4 }});
    expect(el.querySelector('.err-msg').innerHTML).to.equal('The field should be larger than 5.');

    simulate.change(input, { target: { value: 6 }});
    expect(el.querySelector('.err-msg')).to.equal(null);
  });
});
