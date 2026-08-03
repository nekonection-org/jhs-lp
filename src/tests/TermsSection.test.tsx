import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { TermsSection } from "@/components/sections/TermsSection";
import { ja } from "@/content";

function renderTermsSection() {
  return render(
    <LanguageProvider>
      <TermsSection />
    </LanguageProvider>,
  );
}

describe("TermsSection", () => {
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
    renderTermsSection();

    const trigger = screen.getByText(ja.terms.openLabel).closest("button");
    if (!trigger) {
      throw new Error("The terms trigger must be a button");
    }
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    const firstArticle = ja.terms.articles[0];
    if (!firstArticle) {
      throw new Error("The terms must include at least one article");
    }
    expect(dialog).toHaveAttribute("open");
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
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });
});
