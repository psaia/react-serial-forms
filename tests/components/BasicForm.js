require('../setup')('<html><body></body></html>');

import chai from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import simple from './test-forms/simple';
import complex from './test-forms/complex';

import {
  validation,
  InputField,
  BasicForm,
  ValidationError
} from '../../src/index';

const simulate = TestUtils.Simulate;
const expect = chai.expect;

const getComponent = function(path) {
  return require(path).default;
}

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

describe('BasicForm', function() {
  it('should handle pre-filled in values', function() {
    const form = setupComponent((
      <BasicForm>
        <InputField
          name='last_name'
          value='abc'
        />
      </BasicForm>
    ));
    const DOMNode = ReactDOM.findDOMNode(form);
    simulate.change(DOMNode.querySelector('input'), { target: { value: 'efg' }});
    expect(form.serialize().last_name).to.equal('efg');
  });
  it('should properly serialize form', function() {
    let form = setupComponent(simple());
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
    validation.registerValidator({
      name: 'slowfail',
      determine: function(value, resolve, reject) {
        setTimeout(() => {
          reject();
        }, 100);
      },
      message: 'slow error'
    });

    validation.registerValidator({
      name: 'slowfail-custom-msg',
      determine: function(value, resolve, reject) {
        setTimeout(() => {
          reject();
        }, 110);
      },
      message: 'slower error'
    });

    const form = setupComponent((
      <BasicForm>
        <InputField name='first_name' validation='slowfail' />
      </BasicForm>
    ));

    const messages = {
      'slowfail-custom-msg': 'foobar'
    };

    const form2 = setupComponent((
      <BasicForm>
        <InputField
          name='last_name'
          messages={messages}
          validation='slowfail-custom-msg'
        />
      </BasicForm>
    ));

    form.validate((errs) => {
      expect(errs.length).to.equal(1);
      expect(errs[0].message).to.equal('slow error');
    })

    form2.validate((errs) => {
      setTimeout(() => {
        expect(errs.length).to.equal(1);
        expect(errs[0].message).to.equal('foobar');
        let DOMNode = ReactDOM.findDOMNode(form2);
        let el = DOMNode.querySelector('input[name="last_name"]')
        expect(isInvalid(el.getAttribute('class'))).to.be.true;
        done();
      }, 10);
    });
  });

  it('should correctly serialize the form data', function() {
    let form = setupComponent(complex());
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
