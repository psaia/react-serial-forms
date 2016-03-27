/*eslint-env mocha */
/*eslint no-unused-expressions: 0, no-unused-vars: 0 */
import chai from 'chai';

let ReactDOM;
let simulate;
let expect;
let TestUtils;

// Render react element into the DOM.
const setupComponent = function(jsx) {
  let renderedComponent = TestUtils.renderIntoDocument(jsx);
  return renderedComponent;
};

const isIdle = function(classname) {
  return classname === 'serial-form-input idle';
};

const isSuccess = function(classname) {
  return classname === 'serial-form-input success';
};

const isError = function(classname) {
  return classname === 'serial-form-input error';
};

// Load up react since the DOM is ready.
before(function() {
  ReactDOM = require('react-dom');
  TestUtils = require('react-addons-test-utils');
  simulate = TestUtils.Simulate;
  expect = chai.expect;
});

describe('BasicForm', function() {
  it('should cause all inputs to validate on validate()', function(done) {
    let form = setupComponent(require('./test-forms/simple.js'));
    let DOMNode = ReactDOM.findDOMNode(form);
    let firstName = () => DOMNode.querySelector('input[name="first_name"]');
    let company = () => DOMNode.querySelector('input[name="company"]');

    expect(isIdle(firstName().getAttribute('class'))).to.be.true;

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

    // Do a validation and make sure the fields validated correctly.
    form.validate(function(valid) {
      expect(valid).to.be.false;

      expect(isError(firstName().getAttribute('class'))).to.be.true;
      expect(isError(company().getAttribute('class'))).to.be.false;

      // done();
    });
  });

  it('should correctly serialize the form data', function() {
    let form = setupComponent(require('./test-forms/complex.js'));
    let DOMNode = ReactDOM.findDOMNode(form);
    let input = DOMNode.querySelector('input[name="company"]');
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
