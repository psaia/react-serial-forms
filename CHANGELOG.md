# Changelog

## v2.0.4
  * Fixed issue with garbage collection during form/input removal. Thank you [@tkandr](https://github.com/tkandr). [fixes #24](https://github.com/LevInteractive/react-serial-forms/issues/24)

## v2.0.3
  * Implemented `componentWillReceiveProps()` to update the state's value if it's dirty.

## v2.0.2
  * Added handy `attrs()` method which takes care of hard-setting a `value` prop on an input. ([fixes #22](https://github.com/LevInteractive/react-serial-forms/issues/22))

## v2.0.1
  * Remove componentWillReceiveProps()
  * Forced false error state on change.

## v2.0.0
  * Chnaged `validate()` to be async.
  * Input component is now required to be a child of a Form component.
  * Removed Qs library in favor of a custom serialization library.
  * Removed immutable.js
