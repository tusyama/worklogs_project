import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Stack } from "../Stack";

type InlineProps = {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: string;
  justify?: string;
  wrap?: boolean;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export function Inline({ children, gap = "sm", align = "center", justify, wrap, ...rest }: InlineProps) {
  return (
    <Stack direction="row" gap={gap} align={align} justify={justify} wrap={wrap} {...rest}>
      {children}
    </Stack>
  );
}
