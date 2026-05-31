import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { StyledSelect } from "./Select.styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, ...rest },
  ref,
) {
  return (
    <StyledSelect ref={ref} {...rest}>
      {children}
    </StyledSelect>
  );
});

Select.displayName = "Select";
