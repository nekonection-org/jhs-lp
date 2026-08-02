import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FaqSection } from "@/components/sections/FaqSection";
import { faqItemIds, ja } from "@/content";

function renderFaq() {
  return render(
    <LanguageProvider>
      <FaqSection />
    </LanguageProvider>,
  );
}

describe("FaqSection", () => {
  it("renders every FAQ as native details and summary elements", () => {
    const { container } = renderFaq();
    const section = container.querySelector<HTMLElement>("section#faq");
    const details = section?.querySelectorAll("details");

    expect(section).not.toBeNull();
    expect(details).toHaveLength(faqItemIds.length);

    for (const item of ja.faq.items) {
      const question = screen.getByText(item.question);
      expect(question.closest("summary")).not.toBeNull();
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it("opens and closes an answer through its summary control", async () => {
    const user = userEvent.setup();
    renderFaq();

    const summary = screen
      .getByText(ja.faq.items[0].question)
      .closest("summary");
    if (!summary) {
      throw new Error("The first FAQ must be wrapped in a summary element");
    }

    const details = summary.closest("details");
    if (!details) {
      throw new Error("The first FAQ summary must be wrapped in details");
    }
    expect(details).not.toHaveAttribute("open");

    await user.click(summary);
    expect(details).toHaveAttribute("open");

    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
  });
});
