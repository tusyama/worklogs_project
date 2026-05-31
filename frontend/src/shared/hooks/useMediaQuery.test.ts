import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  it("returns initial matchMedia result", () => {
    const listeners = new Set<() => void>();
    const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(max-width: 767px)",
      addEventListener: (_event: string, handler: () => void) => {
        listeners.add(handler);
      },
      removeEventListener: (_event: string, handler: () => void) => {
        listeners.delete(handler);
      },
    } as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

    expect(matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    expect(result.current).toBe(true);
  });
});
