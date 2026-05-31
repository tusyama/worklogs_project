import { tokens } from "./tokens";

type Breakpoint = keyof typeof tokens.breakpoints;

function parsePx(value: string): number {
  return Number.parseInt(value, 10);
}

export const media = {
  up: (breakpoint: Breakpoint) => `@media (min-width: ${tokens.breakpoints[breakpoint]})`,
  down: (breakpoint: Breakpoint) =>
    `@media (max-width: ${parsePx(tokens.breakpoints[breakpoint]) - 1}px)`,
} as const;

export function maxWidthQuery(breakpoint: Breakpoint): string {
  return `(max-width: ${parsePx(tokens.breakpoints[breakpoint]) - 1}px)`;
}
