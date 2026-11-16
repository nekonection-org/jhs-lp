import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NewsList } from "@/components/sections/NewsList";
import { LocalizedPageTitle } from "@/components/ui/LocalizedPageTitle";
import { ja, en } from "@/content";

function renderNews() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <LocalizedPageTitle ja={ja.metadata.title} en={en.metadata.title} />
        <NewsList
          result={{
            status: "ready",
            pagination: { page: 1, pageSize: 5, totalItems: 1, totalPages: 1 },
            items: [
              {
                id: "notice",
                publishedAt: "2026-08-06T09:00:00.000Z",
                category: "notice",
                externalUrl: null,
                translations: {
                  ja: {
                    title: "公開のお知らせ",
                    description: "# 詳細\n\n**本文**を表示します。",
                  },
                  en: {
                    title: "Published notice",
                    description: "# Details\n\nRead the **full announcement**.",
                  },
                },
              },
            ],
          }}
        />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe("full-screen announcement dialog", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        if (this.open)
          throw new DOMException("Already open", "InvalidStateError");
        this.open = true;
      }),
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.open = false;
        this.dispatchEvent(new Event("close"));
      }),
    });
  });

  afterEach(() => {
    document.documentElement.style.scrollbarGutter = "";
  });

  it("opens the rendered article without fetching or navigating and restores focus on close", async () => {
    const user = userEvent.setup();
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("Offline"));
    renderNews();
    const url = window.location.href;
    const trigger = screen.getByRole("link", { name: /公開のお知らせ/ });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("heading", { level: 2 })).toHaveFocus();
    fireEvent.click(trigger);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    expect(
      within(dialog).getByRole("heading", { level: 3, name: /詳細/ }),
    ).toBeVisible();
    expect(fetch).not.toHaveBeenCalled();
    expect(window.location.href).toBe(url);
    expect(document.title).toBe(ja.metadata.title);
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(
      within(dialog).getByRole("button", { name: ja.news.closeLabel }),
    );
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape and resets the article scroll position when reopened", async () => {
    const user = userEvent.setup();
    const { container } = renderNews();
    const trigger = screen.getByRole("link", { name: /公開のお知らせ/ });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const scroll = container.querySelector(".news-dialog-scroll");
    if (!scroll) throw new Error("The article must have its own scroll area");
    scroll.scrollTop = 120;
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    await user.click(trigger);
    expect(scroll.scrollTop).toBe(0);
    expect(dialog).toHaveAttribute("open");
  });

  it("changes language in the dialog without replacing the landing page title with the article title", async () => {
    const user = userEvent.setup();
    renderNews();
    await user.click(screen.getByRole("link", { name: /公開のお知らせ/ }));
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: ja.language.english }),
    );
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe(en.metadata.title);
    expect(dialog).toHaveAttribute("open");
  });

  it("restores the previous document scroll styles when unmounted while open", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    document.documentElement.style.scrollbarGutter = "stable both-edges";
    const { unmount } = renderNews();
    await user.click(screen.getByRole("link", { name: /公開のお知らせ/ }));
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.style.scrollbarGutter).toBe(
      "stable both-edges",
    );
  });
});
