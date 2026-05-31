import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { StyledStack } from "./Stack.styles";

type Gap = "xs" | "sm" | "md" | "lg" | "xl";

type StackProps<T extends ElementType = "div"> = {
  as?: T;
  direction?: "row" | "column";
  gap?: Gap;
  align?: string;
  justify?: string;
  wrap?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Stack<T extends ElementType = "div">({
  as,
  direction = "column",
  gap = "md",
  align,
  justify,
  wrap,
  children,
  ...rest
}: StackProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <StyledStack
      as={Component}
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      {...rest}
    >
      {children}
    </StyledStack>
  );
}
