import React from "react";
import { BaseInputProps } from "../../types";
import Errors from "../FormErrors";
import isFunction from "lodash/isFunction";
import useInput from "../../hooks/use-input";
import Form from "../../form";

export interface Props extends BaseInputProps<Form> {
  type: string;
  placeholder?: string;
  mask?: (e: any) => void;
  pattern?: string;
  autoFocus?: boolean;
  onBlur?: (event: any) => void;
}

export default function Input(props: Props) {
  const [id, dirty, currentValue, errors, onChange, validating] = useInput({
    name: props.name,
    getValueFromEvent: e =>
      isFunction(props.mask) ? props.mask(e.target.value) : e.target.value,
    defaultValue: "",
    form: props.form,
    validations: props.validations
  });

  return (
    <div className={`input-wrapper ${validating ? "validating" : ""}`}>
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <input
        type={props.type}
        value={currentValue}
        onChange={onChange}
        placeholder={props.placeholder}
        pattern={props.pattern}
        autoFocus={props.autoFocus}
        onBlur={props.onBlur}
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
