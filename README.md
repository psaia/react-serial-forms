# React Serial Forms v3

**Note:** Version 3 has been rebuilt from the ground up and is incompatible with
prior major versions.

Serial Forms is optimized to be mostly unopinionated, fast, and extendible. This
module is useful for complex or large applications with a variety of form
input components.

* First-class citizen TypeScript module
* React hooks interface
* Simple async-capable validation protocol
* Simple input masking protocol
* SSR Friendly
* Light weight
* Great form utility belt for the major frameworks - Relay, Apollo, Redux, etc.

```
                   ▲                ▲
                   │                │
                   │                │
                Values     Validation Results
                   │                │
                   │                │
                   │                │

 ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 ┃                                                     ┃
 ┃                                                     ┃
 ┃                    Form Instance                    ┃
 ┃                                                     ┃
 ┃                                                     ┃
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

           ▲                │              │
           │                │              │
           │                │              │
    Input Mutations    Validation     Input State
           │                │              │
           │                │              │
           │                ▼              ▼

               ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
               │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                │
               └  │   Input Instance    │
                └ ─
                  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Installation

```
npm i --save react-serial-forms
```

## Usage

Better documentation is coming soon. See the example below for API implementation.

```typescript
import React from "react";
import FormErrors from "react-serial-forms/lib/components/FormErrors";
import Input from "react-serial-forms/lib/components/inputs/Input";
import useForm from "react-serial-forms/lib/hooks/use-form";
import { validations } from "react-serial-forms/lib/validation";
import phoneMask from "react-serial-forms/lib/masks/phone";

function MyComponent() {
  const [form, saving, onSubmit] = useForm(

    // Set the initial values for the inputs used in the form.
    {
      name: "",
      cellPhone: ""
    },

    // Handle the form submission. values => { cellPhone: ..., name: ... }
    async values => {
      const remoteErrors = await makeRemoteRequestWithValues(values);
      // Do stuff with errors from the server perhaps.
    }
  );

  if (saving) {
    return <p>Form is saving.</p>
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        type="text"
        name="name"
        label="Your Name"
        form={form}
        placeholder="John Doe"
        validations={[validations.required("Your name is required.")]}
      />
      <Input
        type="text"
        name="cellPhone"
        label="Your Phone Number"
        mask={phoneMask}
        form={form}
        placeholder="555-555-5555"
        validations={[validations.phone("A valid phone number is required.")]}
      />
    </form>
  );
}
```


### Using a custom component

```typescript
import React from "react";
import Textarea from "../custom-inputs/Textarea"; // Assume you have your own.
import { BaseInputProps } from "react-serial-forms/lib/types";
import Form from "react-serial-forms/lib/form";
import Errors from "react-serial-forms/lib/components/FormErrors";
import useInput from "react-serial-forms/lib/hooks/use-input";

export interface Props extends BaseInputProps<Form> {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  ol: boolean;
  ul: boolean;
}

export default function Wysiwyg(props: Props) {
  const [id, dirty, currentValue, errors, onChange] = useInput({
    name: props.name,
    getValueFromEvent: val => val,
    defaultValue: "",
    form: props.form,
    validations: props.validations
  });

  return (
    <div className="input-wrapper">
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <Textarea
        onChange={onChange}
        value={currentValue}
        bold={props.bold}
        italic={props.italic}
        underline={props.underline}
        ol={props.ol}
        ul={props.ul}
      />
      {props.helper ? (
        <small
          className="helper-text"
          dangerouslySetInnerHTML={{ __html: props.helper }}
        />
      ) : null}
      <Errors errors={dirty ? errors : []} />
    </div>
  );
}
```

Now you can use this component simply by importing it:

```typescript
...
  <Wysiwyg
    type="text"
    name="description"
    bold={true}
    italic={false}
    ol={true}
    underline={false}
    ul={false}
    form={form}
    validations={[validations.required("A description is required.")]}
  />
...
```
