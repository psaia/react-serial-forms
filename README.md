# Serial Forms

Forms don't have to be horrible. This module is a light abstraction over
[React forms](https://facebook.github.io/react/docs/forms.html) that allows for
customizable layouts for various types of data schemas. Serial Forms decouples
the input itself from the data it generates by creating a serialized object
that represents the input's value which may or may not be on the input itself.
This separation of concerns makes it easy to work with third party components
like [Bootstrap](http://react-bootstrap.github.io/) and [React
Widgets](http://jquense.github.io/react-widgets/docs/#/) or your own custom
components.

Serial Forms aims to accomplish the following goals:

* [Serialization is based on the name attribute for inputs so creating repeater
    fieldsets and nested repeater fieldsets is a
    snap.](https://github.com/LevInteractive/react-serial-forms/blob/master/tests/components/test-forms/complex.js)
* Must be easily extendable and work with any type of custom component (date
    pickers, bootstrap components, ect.). It should be a good foundation for
    other form frameworks and abstractions.
* Must make use of immutable data (via
    [immutable.js](http://facebook.github.io/immutable-js/)).
* Must be built with performance and compatibility in mind and well tested.
* Source code must be as good as any documentation.

# Example

**[Example 1](http://levinteractive.github.io/react-serial-forms/examples/demo.html)**
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

# Usage

There are 2 main essential fundamental parts to Serial Forms:

1. Validation - On field change check value for validity.
2. Serialization - Serial Forms allows you to be expressive with creating forms
by giving you the ability to specify how the data is formatted by the naming
conventions of the `name` attribute.

Without extending Serial Forms, the fields are very basic.

* Input `<InputField />`
* Textarea `<TextareaField />`
* SelectField `<SelectField />`

These components except all of the attributes the native (react) components
would, with the addition of a `validation` attribute that allows you to specify
how the field should validate.

#### Validation

@TODO

#### Serialization

Serialization is based on the naming convention. This allows for the ability to
easily create complex data structures in components without much post-submit
processing. Thus, saving you tons of time.

* `name="my-title"` = `{ "my-title": "<value>" }`
* `name="fruits[]"` = `{ "fruits": ["<value>", "<value>", ...] }`
* `name="fruits[0][name]"` = `{ "fruits": [{"name": "<value>"}] }`
* And so on. You can nest arrays and objects infinitely.

**Files**

`<InputField type='file' />`

Conveniently, the value for a file will be the actual `files` object. This will
only be the case for newly added files of course. Otherwise, it will be whatever
the value attribute is set to. Likely, the name of the file on the record.

**Empty values**

Empty values will always be `null`.

**Select Field**

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


**Let's make a form.**

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

    <div className='simpleList'>
      <InputField value='apple' name='fruits[]' />
      <InputField value='orange' name='fruits[]' />
      <InputField value='strawberry' name='fruits[]' />
      <InputField value='grapefruit' name='fruits[]' />
    </div>

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
          <InputField value='2003' name='people[0][books][0][year]' />
        </div>

        <div className='book'>
          <InputField value='react' name='people[0][books][1][title]' />
          <InputField value='2011' name='people[0][books][1][year]' />
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
          <InputField value='1950' name='people[1][books][0][year]' />
        </div>

        <div className='book'>
          <InputField value='dune' name='people[1][books][1][title]' />
          <InputField value='1963' name='people[1][books][1][year]' />
        </div>

      </div>
    </div>
  </BasicForm>
);
```

Would automatically create a serialized object like this:

```json
{
  "title": "My Title",
  "fruits": [
    "apple",
    "orange",
    "strawberry",
    "grapefruit"
  ],
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

#### Extending

Extending this library is one of its main features. Please do.

##### An example of creating a custom Form with react-bootstrap.

```javascript
import { React } from 'react';
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

@TODO More examples.


# Development

* `npm install`
* `npm test`
