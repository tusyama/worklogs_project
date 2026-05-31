import {
  cloneElement,
  isValidElement,
  useId,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import { Label } from "@/shared/ui-kit/Label";
import { Stack } from "@/shared/ui-kit/Stack";
import { ActionsRow, FieldError, FieldHint, FieldWrapper, StyledForm } from "./Form.styles";

function Root({ children, ...rest }: FormHTMLAttributes<HTMLFormElement>) {
  return <StyledForm {...rest}>{children}</StyledForm>;
}

function StackGroup({ children }: { children: ReactNode }) {
  return <Stack gap="md">{children}</Stack>;
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const fieldId = useId();
  const errorId = useId();
  const control =
    isValidElement(children) && !children.props.id
      ? cloneElement(children, {
          id: fieldId,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        } as Record<string, unknown>)
      : children;

  return (
    <FieldWrapper>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {control}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      {!error && hint ? <FieldHint>{hint}</FieldHint> : null}
    </FieldWrapper>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <ActionsRow>{children}</ActionsRow>;
}

export const Form = {
  Root,
  Stack: StackGroup,
  Field,
  Actions,
};
