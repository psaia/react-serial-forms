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

# Usage

There are 3 main essential fundamental parts to Serial Forms:

1. Validation - On field change check value for validity.
2. Serialization - Serial Forms allows you to be expressive with creating forms
by allowing you to specify how the data is formatted by the naming conventions
of the `name` attribute.

@TODO

#### Validation

Let's create a form.

@TODO

#### Serialization

A form like this:

```html
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


# Development

* `npm install`
* `npm test`
