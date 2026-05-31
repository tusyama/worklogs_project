import { forwardRef, type InputHTMLAttributes } from "react";
import { StyledInput } from "./Input.styles";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return <StyledInput ref={ref} {...props} />;
  },
);

Input.displayName = "Input";
