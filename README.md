# Serial Forms

This library is a light abstraction over
[React forms](https://facebook.github.io/react/docs/forms.html) (85k minified) that allows for
customizable layouts for various types of data schemas. Serial Forms decouples
the input itself from the data it generates by creating a serialized object
that represents the input's value which may or may not be on the input itself.
This separation of concerns makes it easy to work with third party components
like [Bootstrap](http://react-bootstrap.github.io/) and [React
Widgets](http://jquense.github.io/react-widgets/docs/#/) or your own custom
components. For example - you can create a complex component containing multiple
`<input>` elements which produces one result in your serialized object, essentially
acting as one field.

Serial Forms aims to accomplish the following goals:

* [Serialization is based on the name attribute for inputs so creating repeater
    fieldsets and nested repeater fieldsets is a
    snap.](https://github.com/LevInteractive/react-serial-forms/blob/master/tests/components/test-forms/complex.js)
* Must be easily extendable and work with any type of custom component (date
    pickers, bootstrap components, ect.). It should be a good foundation for
    other form frameworks and abstractions.
* Built with performance and compatibility in mind and well tested.
* Source code must be as good as any documentation.


# Demo

**[Kitchen Sink](http://levinteractive.github.io/react-serial-forms/examples/demo.html)**

This example demonstrates a very basic form with validation, a repeater field,
and an undo button.

# Installation

`npm install react-serial-forms`

### CommonJS

`var SerialForms = require('react-serial-forms');`

### ES6

`import SerialForms from 'react-serial-forms';`

or better, just get what you need:

```javascript
import {
  BasicForm,
  InputField,
  SelectField,
  TextareaField
} from 'react-serial-forms'
```

### Browser

Include one of the files (minified or non-minfied) in the dist/ directory of the
npm installed module.

# The birds and the bees

There are 3 fundamental aspects to Serial Forms:

1. **Validation.** On field change async check value for validity.
2. **Serialization.** Serial Forms allows you to be expressive with creating forms
by giving you the ability to specify how the data is formatted by the naming
conventions of the `name` attribute.
3. **Freedom.** You should not be restricted by using premade columns or rows. Just
build the form the way you want with whatever frontend technology you want.

Without extending Serial Forms, the fields are very basic.

* Input `<InputField />`
* Textarea `<TextareaField />`
* SelectField `<SelectField />`

These components except all of the attributes the native (react) components
would, with the addition of a `validation` and `messages` attribute which
allows you to specify how the field should validate.

The only real requirement is that a Input component must be inside a Form
component.

## States of an input

These will appear as classes on the component.

* `fresh`: Newly constructed. Has not yet validated or changed.
* `valid`: Passed validation(s).
* `invalid`: Did not pass validation(s).

## Validation

Vaidation is specified on the `validation` attribute. Currently, the following
validators are included:

* required
* numeral
* email

Multiple can be applied at one time by delimiting by a comma. Example:

```html
<InputField validation='required' name='full_name' />
<InputField validation='required,email' name='email' type='email' />
<InputField validation='required,numeral' name='zip' type='number' />
<InputField validation='required,numeral' name='other-number' type='text' />
```

##### Custom Validation Messages

Supply an object to the special `messages` attribute to customize the validation
message for any of the validators.

```javascript
/**
 * Format:
 * <validator name>: <message>
 *
 * @type {object}
 */
let messages = {
  required: 'I am a custom message for the required validator.'
}

<InputField validation='required' name='full_name' messages={messages} />
```

##### Custom Validators

Validators are 100% asynchronous as of v2.0!

```javascript

// Some file for custom validators used throughout application...
import { validation } from 'react-serial-forms';

validation.registerValidator({
  name: 'unique_username',
  determine: function(value, pass, fail) {
    someAsyncRequest(value, (res) = {
      if (res.ok) {
        pass();
      } else {
        fail();
      }
    });
  },
  message: 'Username is taken.'
});

// Implementation.
<InputField type='text' validation='unique_username' name='username' />
```

## Serialization

Serialization is based on the naming convention. This allows for the ability to
easily create complex data structures in components without much post-submit
processing. Thus, saving you tons of time.

* `name="my-title"` = `{ "my-title": "<value>" }`
* `name="fruits[n]"` = `{ "fruits": ["<value>", "<value>", ...] }`
* `name="fruits[0][name]"` = `{ "fruits": [{"name": "<value>"}] }`
* And so on. You can nest arrays and objects infinitely.

You will more than likely want to obtain the serialized object `onSubmit`.

```javascript
onSubmit(e) {
  let theform = this.refs.myform; // Grab from the refs.
  theform.validate((errors) {
    // Errors will be either false or an array of errors for the failed fields.
    // Perhaps do something with theform.serialize() here.
  });
}
```

##### Numbers

Numbers will be _real_ integer and float values when the `type='number'` is
used on the Input field. Otherwise, they will be strings as the type suggests -
text.

##### Files

`<InputField type='file' />`

Conveniently, the value for a file will be the actual `files` object. This will
only be the case for newly added files of course. Otherwise, it will be whatever
the value attribute is set to. Likely, the name of the file on the record.

##### Empty values

Empty values will always be `null`.

##### Select Field

Options should be specified with a collection of objects:

```javascript
const choices = [
  { text: '- Select Something -', value: null },
  { text: 'Option 1', value: 'option_1' },
  { text: 'Option 2', value: 'option_2' }
];

<SelectField options={choices} />
```

If the select field has `multiple={true}`, then the value will be an array.

**Providing defaults**

Simply pass the pre-populated value a `value` attribute.


## Extending

Extending this library is one of its main features. Please do.

##### Extend complex third-party components.

[Here](examples/DateTimeField.js) is an example of the [Date
Picker](http://jquense.github.io/react-widgets/docs/#/datetime-picker) being
extended. Using the technique of having a "host" hidden input allows us to
handle any type of component - whether it returns a SyntheticEvent or not.

##### An example of creating a custom Form with react-bootstrap.

```javascript
import React from 'react';
import { FormBase } from 'react-serial-forms';
import { Grid, Row, ButtonInput, Col } from 'react-bootstrap';

export default class BootstrapForm extends FormBase {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form onSubmit={this.props.onSubmit} method={this.props.method}>
        <Grid>
          {this.props.children}
          <Row>
            <Col xs={12}>
              <ButtonInput type='submit' bsStyle='primary' value={this.props.submitText} />
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
}
```

## Let's make a form.

```javascript
import {
  BasicForm,
  InputField,
  SelectField,
  TextareaField
} from 'react-serial-forms'

const options = [
  { text: '- Select Something -', value: null },
  { text: 'Rollerblading', value: 'rollerblading' },
  { text: 'Fishing', value: 'fishing' },
  { text: 'Camping', value: 'camping' },
  { text: 'Reading', value: 'reading' }
];

const form = (
  <BasicForm>
    <InputField name='title' validation='required' />

    <div className='simpleList-numbered'>
      <InputField value='garlic' name='veges[0]' />
      <InputField value='pepper' name='veges[3]' />
      <InputField value='avocado' name='veges[2]' />
      <InputField value='carrot' name='veges[1]' />
    </div>

    <div className='person'>
      <InputField value='john' name='people[0][first_name]' validation='required' />
      <InputField value='doe' name='people[0][last_name]' validation='required' />
      <SelectField multiple={true} value={['camping', 'fishing']} name='people[0][hobbies]' options={options} validation='required' />

      <div className='books'>

        <div className='book'>
          <InputField value='devil in the white city' name='people[0][books][0][title]' />
          <InputField type='number' value='2003' name='people[0][books][0][year]' />
        </div>

        <div className='book'>
          <InputField value='react' name='people[0][books][1][title]' />
          <InputField type='number' value='2011' name='people[0][books][1][year]' />
        </div>

      </div>
    </div>

    <div className='person'>
      <InputField value='crazy' name='people[1][first_name]' validation='required' />
      <InputField value='tom' name='people[1][last_name]' validation='required' />
      <SelectField multiple={true} value={['reading', 'rollerblading']} name='people[1][hobbies]' options={options} validation='required' />

      <div className='books'>

        <div className='book'>
          <InputField value='1984' name='people[1][books][0][title]' />
          <InputField type='number' value='1950' name='people[1][books][0][year]' />
        </div>

        <div className='book'>
          <InputField value='dune' name='people[1][books][1][title]' />
          <InputField type='number' value='1963' name='people[1][books][1][year]' />
        </div>

      </div>
    </div>
    <InputField name='submit' type='submit' value='Submit' />
  </BasicForm>
);
```

Would automatically create a serialized object like this:

```json
{
  "title": "My Title",
  "veges": [
    "garlic",
    "carrot",
    "avocado",
    "pepper"
  ],
  "people": [
    {
      "first_name": "john",
      "last_name": "doe",
      "hobbies": [
        "camping",
        "fishing"
      ],
      "books": [
        {
          "title": "devil in the white city",
          "year": 2003
        },
        {
          "title": "react",
          "year": 2011
        }
      ]
    },
    {
      "first_name": "crazy",
      "last_name": "tom",
      "hobbies": [
        "reading",
        "rollerblading"
      ],
      "books": [
        {
          "title": 1984,
          "year": 1950
        },
        {
          "title": "dune",
          "year": 1963
        }
      ]
    }
  ]
}
```


# Development

* `npm install`
* `npm test`
* Make sure your IDE is eslint capable!
