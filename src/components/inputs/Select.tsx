import React from "react";
import { BaseInputProps } from "../../types";
import Errors from "../FormErrors";
import useInput from "../../hooks/use-input";
import Form from "../../form";

export interface Props extends BaseInputProps<Form> {
  options: {
    label: string;
    value: string;
  }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select(props: Props) {
  const [id, dirty, currentValue, errors, onChange] = useInput({
    name: props.name,
    getValueFromEvent: e => e.target.value,
    defaultValue: "",
    form: props.form,
    validations: props.validations
  });

  return (
    <div className="input-wrapper">
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <select name={id} value={currentValue} onChange={onChange}>
        {props.options.map((opt, index) => {
          return (
            <option key={opt.value + index} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
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
