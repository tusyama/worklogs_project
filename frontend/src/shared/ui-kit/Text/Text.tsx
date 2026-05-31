import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { StyledText } from "./Text.styles";

type TextProps<T extends ElementType = "p"> = {
  as?: T;
  variant?: "body" | "caption" | "title";
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Text<T extends ElementType = "p">({
  as,
  variant = "body",
  children,
  ...rest
}: TextProps<T>) {
  const Component = (as ?? "p") as ElementType;
  return (
    <StyledText as={Component} $variant={variant} {...rest}>
      {children}
    </StyledText>
  );
}
