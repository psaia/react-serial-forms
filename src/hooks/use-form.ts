import { useState, useRef, useEffect, FormEvent } from "react";
import Form from "../form";
import { SubmitHander, Values } from "../types";

export default function useForm(
  values: Values,
  handleSubmit: SubmitHander
): [Form, boolean, (event: FormEvent<HTMLFormElement>) => Promise<void>] {
  const [saving, setSaving] = useState(false);
  const form = useRef(new Form(values)).current;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);

    await form.forceValidations();

    if (!form.hasErrors()) {
      await handleSubmit(form.getValues());
    }

    setSaving(false);
  };

  return [form, saving, onSubmit];
}
