import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { en, ja } from "@/content";

function renderLanguageToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle content={ja.language} />
    </LanguageProvider>,
  );
}

describe("LanguageToggle", () => {
  it("starts in Japanese and persists an English selection", async () => {
    const user = userEvent.setup();
    renderLanguageToggle();

    const japanese = screen.getByRole("button", { name: ja.language.japanese });
    const english = screen.getByRole("button", { name: ja.language.english });

    await waitFor(() => expect(document.documentElement.lang).toBe("ja"));
    expect(japanese).toHaveAttribute("aria-pressed", "true");
    expect(english).toHaveAttribute("aria-pressed", "false");

    await user.click(english);

    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement).toHaveAttribute("data-locale", "en");
    expect(window.localStorage.getItem("jhs-locale")).toBe("en");
    expect(english).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(document.title).toBe(en.metadata.title));
  });

  it("restores a saved language on mount", async () => {
    window.localStorage.setItem("jhs-locale", "en");
    renderLanguageToggle();

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: ja.language.english }),
      ).toHaveAttribute("aria-pressed", "true"),
    );
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe(en.metadata.title);
  });

  it("restores the selected language title after a head update", async () => {
    const user = userEvent.setup();
    renderLanguageToggle();

    await user.click(screen.getByRole("button", { name: ja.language.english }));
    await waitFor(() => expect(document.title).toBe(en.metadata.title));

    document.title = ja.metadata.title;

    await waitFor(() => expect(document.title).toBe(en.metadata.title));
  });

  it("ignores unsupported saved locale values", async () => {
    window.localStorage.setItem("jhs-locale", "unsupported");
    renderLanguageToggle();

    await waitFor(() => expect(document.documentElement.lang).toBe("ja"));
    expect(
      screen.getByRole("button", { name: ja.language.japanese }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps rendering and switching languages when storage access is blocked", async () => {
    const user = userEvent.setup();
    const storageGetter = vi
      .spyOn(window, "localStorage", "get")
      .mockImplementation(() => {
        throw new DOMException("Storage is blocked", "SecurityError");
      });

    try {
      renderLanguageToggle();
      const english = screen.getByRole("button", { name: ja.language.english });
      const japanese = screen.getByRole("button", {
        name: ja.language.japanese,
      });
      expect(japanese).toHaveAttribute("aria-pressed", "true");

      await user.click(english);
      expect(english).toHaveAttribute("aria-pressed", "true");
      expect(document.documentElement.lang).toBe("en");
      await waitFor(() => expect(document.title).toBe(en.metadata.title));

      await user.click(japanese);
      expect(japanese).toHaveAttribute("aria-pressed", "true");
      expect(document.documentElement.lang).toBe("ja");
    } finally {
      storageGetter.mockRestore();
    }
  });

  it("falls back to Japanese when reading saved language fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });

    renderLanguageToggle();
    expect(
      screen.getByRole("button", { name: ja.language.japanese }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("uses the new selection even if a saved language cannot be overwritten", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("jhs-locale", "en");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full", "QuotaExceededError");
    });
    renderLanguageToggle();
    const english = screen.getByRole("button", { name: ja.language.english });
    const japanese = screen.getByRole("button", { name: ja.language.japanese });
    expect(english).toHaveAttribute("aria-pressed", "true");

    await user.click(japanese);
    expect(japanese).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.lang).toBe("ja");
    expect(window.localStorage.getItem("jhs-locale")).toBe("en");

    await user.click(english);
    expect(english).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.lang).toBe("en");
  });

  it("synchronizes language changes and storage clearing from another tab", async () => {
    renderLanguageToggle();

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "jhs-locale", newValue: "en" }),
      );
    });
    expect(document.documentElement.lang).toBe("en");
    expect(
      screen.getByRole("button", { name: ja.language.english }),
    ).toHaveAttribute("aria-pressed", "true");

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(document.documentElement.lang).toBe("ja");
    expect(
      screen.getByRole("button", { name: ja.language.japanese }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
