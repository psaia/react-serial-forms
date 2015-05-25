import React from 'react';
import {
  BasicForm,
  InputField,
  SelectField,
  TextareaField
} from '../../../src/index';

const options = [
  { text: '- Select Something -', value: null },
  { text: 'Foo', value: 'foo' },
  { text: 'Bar', value: 'bar' }
];

const form = (
  <BasicForm>
    <InputField name='first_name' validation='required' />
    <InputField name='last_name' validation='required' />
    <InputField name='email' validation='required,email' />
    <InputField name='company' />
    <InputField type='number' name='age' validation='numeral' />
    <InputField name='age' format='money' />
    <TextareaField rows={5} cols={10} name='about' />
    <SelectField name='something' options={options} validation='required' />
  </BasicForm>
);

export default form;
