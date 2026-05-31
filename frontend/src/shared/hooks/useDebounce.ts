import { useEffect, useState } from "react";

export const FILTER_DATE_DEBOUNCE_MS = 400;

export function useDebounce<T>(value: T, delayMs: number = FILTER_DATE_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timerId);
  }, [value, delayMs]);

  return debouncedValue;
}
