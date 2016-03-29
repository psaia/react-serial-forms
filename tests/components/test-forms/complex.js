import React from 'react';

import {
  BasicForm,
  InputField,
  SelectField
} from '../../../src/index';

const options = [
  { text: '- Select Something -', value: null },
  { text: 'Rollerblading', value: 'rollerblading' },
  { text: 'Fishing', value: 'fishing' },
  { text: 'Camping', value: 'camping' },
  { text: 'Reading', value: 'reading' }
];

const factory = function() {
  return (
    <BasicForm>
      <InputField name='title' validation='required' />

      <div className='simpleList'>
        <InputField value='apple' name='fruits[0]' />
        <InputField value='orange' name='fruits[1]' />
        <InputField value='strawberry' name='fruits[2]' />
        <InputField value='grapefruit' name='fruits[3]' />
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
};

export default factory;
