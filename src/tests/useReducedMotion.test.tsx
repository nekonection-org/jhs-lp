import { act, renderHook } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { useReducedMotion } from "@/hooks/useReducedMotion";

describe("reduced motion preference", () => {
  it("subscribes to preference changes and removes the subscription on unmount", () => {
    let matches = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const events = new EventTarget();
    Object.defineProperty(media, "matches", { get: () => matches });
    vi.spyOn(media, "addEventListener").mockImplementation(
      events.addEventListener.bind(events),
    );
    const remove = vi
      .spyOn(media, "removeEventListener")
      .mockImplementation(events.removeEventListener.bind(events));
    vi.spyOn(window, "matchMedia").mockReturnValue(media);
    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => {
      matches = true;
      events.dispatchEvent(new Event("change"));
    });
    expect(result.current).toBe(true);
    act(() => {
      matches = false;
      events.dispatchEvent(new Event("change"));
    });
    expect(result.current).toBe(false);
    unmount();
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  });
  it("uses the motion-free snapshot on the server", () => {
    function Preference() {
      return <span>{String(useReducedMotion())}</span>;
    }
    expect(renderToStaticMarkup(<Preference />)).toBe("<span>true</span>");
  });
});
