/*eslint-env mocha */
import chai from 'chai';

let React;
let ReactDOM;
let simulate;
let expect;
let TestUtils;

let SelectField;

// Render react element into the DOM.
const setupComponent = function(jsx) {
  let renderedComponent = TestUtils.renderIntoDocument(jsx);
  return ReactDOM.findDOMNode(renderedComponent);
};

// Load up react since the DOM is ready.
before(function() {
  React = require('react');
  ReactDOM = require('react-dom');
  SelectField = require('../../src/fields/SelectField.js');
  TestUtils = require('react-addons-test-utils');
  simulate = TestUtils.Simulate;
  expect = chai.expect;
});

describe('SelectField', function() {
  it('should handle a simple non validating input', function() {
    const options = [
      { text: 'Foo', value: 'foo' },
      { text: 'Bar', value: 'bar' }
    ];
    const el = setupComponent(<SelectField options={options} name='my-field' />);
    const select = el.querySelector('select');

    // Should have a wrapper.
    expect(el.getAttribute('class')).to.equal('serial-input-wrapper');

    // Idle.
    expect(select.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(select, { target: { value: 'foo' }});
    expect(select.getAttribute('class')).to.equal('serial-form-input success');

    // Back to idle.
    simulate.change(select, { target: { value: '' }});
    expect(select.getAttribute('class')).to.equal('serial-form-input idle');

    // Should make current val a selected option.
    simulate.change(select, { target: { value: 'bar' }});

    let _options = select.getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
      if (_options[i].selected) {
        expect(_options[i].innerHTML).to.equal('Bar');
      }
    }
  });

  it('should handle a multiselect select', function() {
    const options = [
      { text: 'Foo', value: 'foo' },
      { text: 'Fun', value: 'fun' },
      { text: 'Bar', value: 'bar' }
    ];
    let instance = TestUtils.renderIntoDocument(<SelectField multiple={true} options={options} name='my-field' />);
    let el = ReactDOM.findDOMNode(instance);

    const select = el.querySelector('select');

    simulate.change(select, { target: { value: ['foo', 'bar'] }});

    let _options = select.getElementsByTagName('option');
    let values = [];
    for (let i = 0; i < options.length; i++) {
      if (_options[i].selected) {
        values.push(_options[i].value);
      }
    }

    expect(values).to.eql(['foo', 'bar']);
  });

  it('should handle validation', function() {
    const options = [
      { text: 'Foo', value: 'foo' },
      { text: 'Bar', value: 'bar' }
    ];
    const el = setupComponent(<SelectField options={options} name='my-field' validation='required' />);
    const select = el.querySelector('select');

    // Idle.
    expect(select.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(select, { target: { value: 'foo' }});
    expect(select.getAttribute('class')).to.equal('serial-form-input success');

    // Put a string in.
    simulate.change(select, { target: { value: '' }});
    expect(select.getAttribute('class')).to.equal('serial-form-input error');
  });

  it('should normalize serializations properly', function() {
    const options = [
      { text: 'Foo', value: 'foo' },
      { text: 'Bar', value: 'bar' }
    ];
    const el = setupComponent(<SelectField options={options} name='my-field' validation='required' />);
    const select = el.querySelector('select');

    // Idle.
    expect(select.getAttribute('class')).to.equal('serial-form-input idle');

    // Put a string in.
    simulate.change(select, { target: { value: 'foo' }});
    expect(select.getAttribute('class')).to.equal('serial-form-input success');

    let serial = JSON.parse(select.getAttribute('data-serial'));
    expect(serial).eql({ name: 'my-field', value: 'foo' });
  });
});
