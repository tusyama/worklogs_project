import { ThemeProvider as SCThemeProvider } from "styled-components";
import type { ReactNode } from "react";
import { tokens } from "./tokens";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <SCThemeProvider theme={tokens}>{children}</SCThemeProvider>;
}
