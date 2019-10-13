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
