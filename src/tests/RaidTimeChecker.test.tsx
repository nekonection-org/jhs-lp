import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RaidTimeChecker } from "@/components/ui/RaidTimeChecker";

describe("RaidTimeChecker", () => {
  it("updates the result when the selected day changes at the same time", async () => {
    const user = userEvent.setup();
    render(<RaidTimeChecker />);
    const checker = screen.getByRole("region", { name: /時間を選んで確認/ });
    const slider = within(checker).getByRole("slider");
    const result = checker.querySelector(".raid-check-result");
    fireEvent.change(slider, { target: { value: "17" } });
    expect(result).toHaveAttribute("data-allowed", "false");
    expect(result).toHaveTextContent("17:00 JST");

    const weekend = within(checker).getByRole("button", { name: /土・日/ });
    await user.click(weekend);
    expect(weekend).toHaveAttribute("aria-pressed", "true");
    expect(
      within(checker).getByRole("button", { name: /平日/ }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(result).toHaveAttribute("data-allowed", "true");
    expect(slider).toHaveAttribute("aria-valuetext", "17:00 JST");
  });

  it("announces midnight as blocked without losing the selected day", () => {
    const { container } = render(<RaidTimeChecker />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    const result = container.querySelector(".raid-check-result");
    expect(result).toHaveAttribute("role", "status");
    expect(result).toHaveAttribute("aria-live", "polite");
    expect(result).toHaveAttribute("data-allowed", "false");
    expect(result).toHaveTextContent("00:00 JST");
  });
});
