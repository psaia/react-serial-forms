import React from "react";

type Props = {
  errors: string[];
};

export default function FormErrors(props: Props) {
  if (!props.errors.length) {
    return null;
  }

  return (
    <div className="form-errors">
      <ul>
        {props.errors.map((msg, idx) => {
          return <li key={idx}>{msg}</li>;
        })}
      </ul>
    </div>
  );
}
