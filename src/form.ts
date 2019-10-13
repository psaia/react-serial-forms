import Observer from "./observer";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { checkValidations } from "./validation";
import {
  FormController,
  Validation,
  InputMode,
  Values,
  Errors,
  InputValidations
} from "./types";

/**
 *
 * Form is a singleton which gets passed into an <Input />. It holds realtime
 * data on all errors and values within a collections of inputs.
 */
export default class Form {
  observer: Observer = new Observer();
  private initialValues: Values = {};
  private inputValidations: InputValidations = {};
  private values: Values = {};
  private errors: Errors = {};
  private forceCheck: boolean = false;

  constructor(initialValues: Values = {}) {
    this.values = cloneDeep(initialValues);
    this.initialValues = cloneDeep(initialValues);
  }

  inputMode(inputName: string): InputMode {
    if (this.forceCheck) {
      return InputMode.Dirty;
    }

    if (this.initialValues[inputName] === undefined) {
      return InputMode.Unstable;
    } else if (
      !isEqual(this.initialValues[inputName], this.values[inputName])
    ) {
      return InputMode.Dirty;
    }

    return InputMode.Clean;
  }

  setInitialValues(values: Values): this {
    for (const key in values) {
      this.setInitialValue(key, values[key]);
    }
    return this;
  }

  setValues(values: Values): this {
    for (const key in values) {
      this.setValue(key, values[key]);
      this.observer.publishFast(`${key}.setValue`, values[key]);
    }

    return this;
  }

  async forceValidations(): Promise<this> {
    this.forceCheck = true;
    for (const key in this.values) {
      await this.observer.publishFast(`${key}.validate`);
    }

    return this;
  }

  async validate(inputName: string): Promise<string[]> {
    let errors: string[] = [];

    if (this.inputValidations[inputName]) {
      errors = await checkValidations(
        this.inputValidations[inputName],
        this.getValue(inputName)
      );
    }

    this.setErrors(inputName, errors);

    return errors;
  }

  setValue(inputName: string, value: any): void {
    this.values[inputName] = value;
  }

  setInitialValue(inputName: string, value: any): void {
    this.initialValues[inputName] = value;
  }

  setErrors(inputName: string, value: string[]): void {
    this.errors[inputName] = value;
  }

  getValue(inputName: string): any {
    return cloneDeep(this.values[inputName]);
  }

  getValues(): Values {
    return cloneDeep(this.values);
  }

  getErrors(inputName: string): string[] {
    return cloneDeep(this.errors[inputName]);
  }

  setValidations(inputName: string, validations: Validation[]) {
    this.inputValidations[inputName] = validations;
  }

  hasErrors(): boolean {
    for (const key in this.errors) {
      const e = this.getErrors(key);
      if (e && e.length) {
        return true;
      }
    }
    return false;
  }
}
