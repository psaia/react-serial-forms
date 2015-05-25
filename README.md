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

* [Serialization is based on the naming convention for inputs so created repeater
    fieldsets and nested repeater fieldsets is a
    snap.](https://github.com/LevInteractive/react-serial-forms/blob/master/tests/components/test-forms/complex.js)
* Must be easily extendable and work with any type of custom component (date
    pickers, bootstrap components, ect.). It should be a good foundation for
    other form frameworks and abstractions.
* Must make use of immutable data (via
    [immutable.js](http://facebook.github.io/immutable-js/)).
* Must be built with performance and compatibility in mind and well tested.
* Source code must be as good as any documentation.

# Installation

`npm install react-serial-forms`

# Usage

There are 3 main essential fundamental parts to Serial Forms:

1. Validation - On field change check value for validity.
2. Serialization - Extract data from form.

@TODO

#### Validation

Let's create a form.

@TODO

#### Serialization

Let's create a form.

@TODO

# Development

* `npm install`
* `npm test`
