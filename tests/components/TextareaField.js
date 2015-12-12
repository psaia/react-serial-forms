/*eslint-env mocha */
import chai from 'chai';

let React;
let ReactDOM;
let simulate;
let expect;
let TestUtils;

let TextareaField;

// Render react element into the DOM.
const setupComponent = function(jsx) {
  let renderedComponent = TestUtils.renderIntoDocument(jsx);
  return ReactDOM.findDOMNode(renderedComponent);
};

// Load up react since the DOM is ready.
before(function() {
  React = require('react');
  ReactDOM = require('react-dom');
  TextareaField = require('../../src/fields/TextareaField.js');
  TestUtils = require('react-addons-test-utils');
  simulate = TestUtils.Simulate;
  expect = chai.expect;
});

describe('TextareaField', function() {
  it('should handle a simple non validating input', function() {
    const el = setupComponent(<TextareaField name='my-field' />);
    const textarea = el.querySelector('textarea');

    // Should have a wrapper.
    expect(el.getAttribute('class')).to.equal('serial-input-wrapper');

    // Idle.
    expect(textarea.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(textarea, { target: { value: 'foo' }});
    expect(textarea.getAttribute('class')).to.equal('serial-form-input success');

    // Back to idle.
    simulate.change(textarea, { target: { value: '' }});
    expect(textarea.getAttribute('class')).to.equal('serial-form-input idle');

    // Should make current val a textareaed option.
    simulate.change(textarea, { target: { value: 'bar' }});
  });

  it('should handle validation', function() {
    const el = setupComponent(<TextareaField name='my-field' validation='required' />);
    const textarea = el.querySelector('textarea');

    // Idle.
    expect(textarea.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(textarea, { target: { value: 'foo' }});
    expect(textarea.getAttribute('class')).to.equal('serial-form-input success');

    // Put a string in.
    simulate.change(textarea, { target: { value: '' }});
    expect(textarea.getAttribute('class')).to.equal('serial-form-input error');
  });

  it('should normalize serializations properly', function() {
    const options = [
      { text: 'Foo', value: 'foo' },
      { text: 'Bar', value: 'bar' }
    ];
    const el = setupComponent(<TextareaField options={options} name='my-field' validation='required' />);
    const textarea = el.querySelector('textarea');

    // Idle.
    expect(textarea.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(textarea, { target: { value: 'foo' }});
    expect(textarea.getAttribute('class')).to.equal('serial-form-input success');

    expect(textarea.value).to.equal('foo');

    let serial = JSON.parse(textarea.getAttribute('data-serial'));
    expect(serial).eql({ name: 'my-field', value: 'foo' });
  });
});
