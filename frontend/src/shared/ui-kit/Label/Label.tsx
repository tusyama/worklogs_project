import type { LabelHTMLAttributes, ReactNode } from "react";
import { StyledLabel } from "./Label.styles";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  required?: boolean;
};

export function Label({ children, required, ...rest }: LabelProps) {
  return (
    <StyledLabel {...rest}>
      {children}
      {required ? " *" : null}
    </StyledLabel>
  );
}
