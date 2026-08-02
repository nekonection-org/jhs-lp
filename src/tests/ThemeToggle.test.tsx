import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ja } from "@/content";

const themeMock = vi.hoisted(() => ({
  current: "dark",
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: themeMock.setTheme,
    theme: themeMock.current,
  }),
}));

vi.mock("@/hooks/useMounted", () => ({
  useMounted: () => true,
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    themeMock.current = "dark";
  });

  it("announces the next theme and changes dark to light", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle content={ja.theme} />);

    const toggle = screen.getByRole("button", {
      name: ja.theme.switchToLight,
    });
    expect(toggle).not.toHaveAttribute("aria-pressed");

    await user.click(toggle);

    expect(themeMock.setTheme).toHaveBeenCalledOnce();
    expect(themeMock.setTheme).toHaveBeenCalledWith("light");
  });

  it("changes light to dark", async () => {
    themeMock.current = "light";
    const user = userEvent.setup();
    render(<ThemeToggle content={ja.theme} />);

    const toggle = screen.getByRole("button", {
      name: ja.theme.switchToDark,
    });
    expect(toggle).not.toHaveAttribute("aria-pressed");

    await user.click(toggle);

    expect(themeMock.setTheme).toHaveBeenCalledWith("dark");
  });
});
