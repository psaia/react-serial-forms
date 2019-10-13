export abstract class FormController {}

// An input can be one of these modes at any given time:
export enum InputMode {
  // The initial value has not been set yet.
  Unstable = 0,

  // The initial value is the same as the current value.
  Clean,

  // The initial value is different than the current value.
  Dirty
}

// Handler fn for a submission form.
export type SubmitHander = (values: any) => Promise<void>;

// An interface for an input validation.
export interface Validation {
  isValid: (v: any) => boolean | Promise<boolean>;
  ifNotMessage: string;
}

// A composition for a validation which provides an optional error message.
export type ValidationFn = (message?: string) => Validation;

// Any input which uses this library will implement these props.
export interface BaseInputProps<T> {
  name: string;
  form: T;
  validations?: Validation[];
  label?: string;
  helper?: string;
  disabled?: boolean;
}

// A hashmap for input values.
export type Values = {
  [inputName: string]: any;
};

// A hashmap for input errors.
export type Errors = {
  [inputName: string]: string[];
};

// A hashmap for input validations.
export type InputValidations = {
  [inputName: string]: Validation[];
};

// An observer payload function.
export type PayloadFn = (payload?: any) => void | Promise<void>;

// An observer subscription.
export interface Subscription {
  name: string;
  fn: PayloadFn;
}

// Props used buy useInput.
export type InputHookProps<T> = {
  getValueFromEvent: (event: any) => any;
  defaultValue: any;
  form: T;
  name: string;
  validations?: Validation[];
};
