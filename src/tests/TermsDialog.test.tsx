import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { TermsDialog } from "@/components/ui/TermsDialog";
import { ja } from "@/content";

function renderTermsDialog() {
  return render(
    <LanguageProvider>
      <TermsDialog />
    </LanguageProvider>,
  );
}

describe("TermsDialog", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: vi.fn(function showModal(this: HTMLDialogElement) {
        this.open = true;
      }),
      writable: true,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: vi.fn(function close(this: HTMLDialogElement) {
        this.open = false;
        this.dispatchEvent(new Event("close"));
      }),
      writable: true,
    });
  });

  it("opens the terms in a dialog and returns focus after closing", async () => {
    const user = userEvent.setup();
    renderTermsDialog();

    const trigger = screen.getByRole("button", { name: ja.terms.openLabel });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    const firstArticle = ja.terms.articles[0];
    if (!firstArticle) {
      throw new Error("The terms must include at least one article");
    }
    expect(dialog).toHaveAttribute("open");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(firstArticle.title).closest("h3")).not.toBeNull();
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));

    const closeButton = screen.getAllByRole("button", {
      name: ja.terms.closeLabel,
    })[0];
    if (!closeButton) {
      throw new Error("The terms dialog must include a close button");
    }
    await user.click(closeButton);

    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });
});
