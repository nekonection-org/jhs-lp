import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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
});
