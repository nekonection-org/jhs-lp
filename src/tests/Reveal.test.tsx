import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Reveal } from "@/components/ui/Reveal";

describe("Reveal", () => {
  it("keeps server-rendered content readable before JavaScript runs", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <Reveal delay={0.12}>
        <h1>Japan Hideaway Server</h1>
        <a href="#rules">ルールを見る</a>
      </Reveal>,
    );
    document.body.append(container);

    try {
      const wrapper = container.firstElementChild;
      expect(wrapper).toBeInstanceOf(HTMLElement);
      expect(wrapper).toBeVisible();
      expect(wrapper?.querySelector("h1")).toHaveTextContent(
        "Japan Hideaway Server",
      );
      expect(wrapper?.querySelector("a")).toHaveAttribute("href", "#rules");
    } finally {
      container.remove();
    }
  });
});
