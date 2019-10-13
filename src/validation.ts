/**
 * These validations are the be used with the universial <Input /> component.
 */
import { Validation, ValidationFn } from "./types";

// Check a collection of validations against a value.
export async function checkValidations(
  validations: Validation[] = [],
  value: any
): Promise<string[]> {
  const errors = [];

  for (let i = 0, l = validations.length; i < l; i++) {
    const valid = await validations[i].isValid(value);
    if (!valid) {
      errors.push(validations[i].ifNotMessage);
    }
  }

  return errors;
}

// A collection of common validators w/ customizable messages.
export const validations: { [name: string]: ValidationFn } = {
  required: (customMessage?: string) => {
    return {
      isValid: (v: string | any[]) => !!v.length,
      ifNotMessage: customMessage || "Field required."
    };
  },
  email: (customMessage?: string) => {
    return {
      isValid: (v: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(v);
      },
      ifNotMessage: customMessage || "A valid email address is required."
    };
  },
  postal: (customMessage?: string) => {
    return {
      isValid: (v: string) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v),
      ifNotMessage: customMessage || "A valid zip code is required."
    };
  }
};
