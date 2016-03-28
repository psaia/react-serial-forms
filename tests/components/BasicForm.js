/*eslint-env mocha */
import chai from 'chai';
import Promise from 'bluebird';
import React from 'react';

let ReactDOM;
let simulate;
let expect;
let TestUtils;

const setupComponent = function(jsx) {
  let renderedComponent = TestUtils.renderIntoDocument(jsx);
  return renderedComponent;
};

const isFresh = function(classname) {
  return classname === 'serial-form-input fresh';
};

const isValid = function(classname) {
  return classname === 'serial-form-input valid';
};

const isInvalid = function(classname) {
  return classname === 'serial-form-input invalid';
};

// Load up react since the DOM is ready.
before(function() {
  ReactDOM = require('react-dom');
  TestUtils = require('react-addons-test-utils');
  simulate = TestUtils.Simulate;
  expect = chai.expect;
});

describe('BasicForm', function() {
  it('should properly serialize form', function() {
    let form = setupComponent(require('./test-forms/simple.js'));
    let DOMNode = ReactDOM.findDOMNode(form);
    let firstName = () => DOMNode.querySelector('input[name="first_name"]');
    let company = () => DOMNode.querySelector('input[name="company"]');

    expect(isFresh(firstName().getAttribute('class'))).to.be.true;

    // Test number inputs.
    simulate.change(DOMNode.querySelector('input[name="age"]'), { target: { value: '111' }});
    simulate.change(DOMNode.querySelector('input[name="last_name"]'), { target: { value: '111' }});

    expect(form.serialize().age).to.equal(111);
    expect(form.serialize().last_name).to.equal('111');

    simulate.change(DOMNode.querySelector('input[name="age"]'), { target: { value: '123.333' }});
    expect(form.serialize().age).to.equal(123.333);

    simulate.change(DOMNode.querySelector('input[name="age"]'), { target: { value: '' }});
    expect(form.serialize().age).to.equal(null);

    simulate.change(DOMNode.querySelector('input[name="age"]'), { target: { value: 0 }});
    expect(form.serialize().age).to.equal(0);
  });

  it('should handle a async validate', function(done) {
    const validation = require('../../src/validation');
    const ValidationError = require('../../src/ValidationError');
    const BasicForm = require('../../src/forms/BasicForm');
    const InputField = require('../../src/fields/InputField');

    validation.registerValidator({
      name: 'slowfail',
      determine: function(value, resolve, reject) {
        setTimeout(reject, 100);
      },
      message: 'This will definitely fail in 100 ms.'
    });

    validation.registerValidator({
      name: 'slowfail-custom-msg',
      determine: function(value, resolve, reject) {
        setTimeout(() => {
          reject('foobar');
        }, 110);
      },
      message: 'This will definitely fail in 100 ms.'
    });

    const form = setupComponent((
      <BasicForm>
        <InputField name='first_name' validation='slowfail' />
      </BasicForm>
    ));

    const formopts = {
      messages: {
        'slowfail-custom-msg': 'foobar'
      }
    };

    const form2 = setupComponent((
      <BasicForm>
        <InputField
          name='last_name'
          formopts={formopts}
          validation='slowfail-custom-msg'
        />
      </BasicForm>
    ));

    form.validate()
      .then(() => {
        expect(0).to.be.ok;
      })
      .catch((err) => {
        expect(1).to.be.ok;
        expect(err).to.be.an.instanceof(ValidationError);
        expect(err.message).to.equal('This will definitely fail in 100 ms.');
        let DOMNode = ReactDOM.findDOMNode(form);
        let el = DOMNode.querySelector('input[name="first_name"]')
        expect(isInvalid(el.getAttribute('class'))).to.be.true;
      });

    form2.validate()
      .then(() => {
        expect(0).to.be.ok;
      })
      .catch((err) => {
        expect(1).to.be.ok;
        expect(err).to.be.an.instanceof(ValidationError);
        expect(err.message).to.equal('foobar');
        let DOMNode = ReactDOM.findDOMNode(form2);
        let el = DOMNode.querySelector('input[name="last_name"]')
        expect(isInvalid(el.getAttribute('class'))).to.be.true;
        done();
      });
  });

  it('should correctly serialize the form data', function() {
    let form = setupComponent(require('./test-forms/complex.js'));
    let DOMNode = ReactDOM.findDOMNode(form);
    let serializedObj = form.serialize();

    expect(serializedObj.title).to.equal(null);
    expect(serializedObj.veges).to.eql([
      'garlic',
      'carrot',
      'avocado',
      'pepper'
    ]);
    expect(serializedObj.fruits).to.eql([
      'apple',
      'orange',
      'strawberry',
      'grapefruit'
    ]);

    expect(serializedObj.people.length).to.equal(2);
    expect(serializedObj.people[0].books.length).to.equal(2);
    expect(serializedObj.people[0].hobbies.length).to.equal(2);

    simulate.change(DOMNode.querySelector('input'), { target: { value: '111:someval' }});

    expect(form.serialize().title).to.equal('111:someval');

    simulate.change(DOMNode.querySelector('input'), { target: { value: '111.333' }});
    expect(form.serialize().title).to.equal('111.333');

    simulate.change(DOMNode.querySelector('input'), { target: { value: '111' }});
    expect(form.serialize().title).to.equal('111');

    simulate.change(DOMNode.querySelector('input'), { target: { value: '111...111' }});
    expect(form.serialize().title).to.equal('111...111');

    simulate.change(DOMNode.querySelector('input'), { target: { value: '111.' }});
    expect(form.serialize().title).to.equal('111.');
  });
});
