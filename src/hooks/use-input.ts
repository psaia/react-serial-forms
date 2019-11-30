import { useRef, useEffect, useState } from "react";
import { checkValidations } from "../validation";
import Form from "../form";
import { InputMode, InputHookProps } from "../types";

/**
 * Provide an input everything it needs.
 */
export default function useInput({
  getValueFromEvent,
  defaultValue,
  form,
  name,
  validations
}: InputHookProps<Form>) {
  const id = useRef(`input--${name}`).current;
  const [currentValue, setCurrentValue] = useState(
    form.getValue(name) === undefined ? defaultValue : form.getValue(name)
  );
  const [validating, setValidating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (validations) {
      form.setValidations(name, validations);
    }

    form.observer.subscribeFast(`${name}.setValue`, v => {
      form.setValue(name, v);
      setCurrentValue(v);
    });

    form.observer.subscribeFast(`${name}.setInitialValue`, v => {
      form.setValue(name, v);
      form.setInitialValue(name, v);
      setCurrentValue(v);
    });

    form.observer.subscribeFast(`${name}.validate`, async () => {
      setValidating(true);
      setErrors(await form.validate(name));
      setValidating(false);
    });

    form.observer.subscribeFast("clear", () => setCurrentValue(""));

    return () => {
      form.observer.unsubscribeFast(`${name}.setInitialValue`);
      form.observer.unsubscribeFast(`${name}.setValue`);
      form.observer.unsubscribeFast(`${name}.validate`);
      form.observer.unsubscribeFast("clear");
    };
  }, []);

  const dirty = form.inputMode(name) === InputMode.Dirty;

  function onChange(event: any) {
    form.observer.publishFast(`${name}.setValue`, getValueFromEvent(event));
    form.observer.publishFast(`${name}.validate`);
  }

  return [id, dirty, currentValue, errors, onChange, validating];
}
