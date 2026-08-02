import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/layout/Header";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ja, navigationItemIds } from "@/content";

function renderHeader() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe("Header", () => {
  it("uses ordinary anchor links for every section", () => {
    renderHeader();

    const desktopNavigation = screen.getByRole("navigation", {
      name: ja.navigation.ariaLabel,
    });

    for (const id of navigationItemIds) {
      const item = ja.navigation.items.find((candidate) => candidate.id === id);
      expect(item).toBeDefined();
      expect(
        within(desktopNavigation).getByRole("link", { name: item?.label }),
      ).toHaveAttribute("href", `#${id}`);
    }
  });

  it("opens the mobile menu, moves focus inside, and closes it with Escape", async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuButton = screen.getByRole("button", {
      name: ja.navigation.openMenu,
    });
    expect(menuButton).toHaveAttribute("aria-controls", "mobile-navigation");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileNavigation = screen.getByRole("navigation", {
      name: ja.navigation.mobileMenuLabel,
    });
    expect(mobileNavigation).toHaveAttribute("id", "mobile-navigation");
    await waitFor(() =>
      expect(within(mobileNavigation).getAllByRole("link")[0]).toHaveFocus(),
    );
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(menuButton).toHaveAttribute("aria-expanded", "false"),
    );
    expect(menuButton).toHaveFocus();
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("closes the mobile menu after selecting a section", async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuButton = screen.getByRole("button", {
      name: ja.navigation.openMenu,
    });
    await user.click(menuButton);

    const mobileNavigation = screen.getByRole("navigation", {
      name: ja.navigation.mobileMenuLabel,
    });
    await user.click(
      within(mobileNavigation).getByRole("link", {
        name: new RegExp(ja.navigation.items[1].label),
      }),
    );

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
