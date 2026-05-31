import type { ButtonHTMLAttributes, ReactNode } from "react";
import { StyledButton } from "./Button.styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  $variant?: "primary" | "secondary" | "danger" | "ghost";
  $size?: "sm" | "md";
  children: ReactNode;
};

export function Button({
  $variant = "primary",
  $size = "md",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <StyledButton type={type} $variant={$variant} $size={$size} {...rest}>
      {children}
    </StyledButton>
  );
}
