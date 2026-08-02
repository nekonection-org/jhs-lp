import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/ui/StatusBadge";

describe("StatusBadge", () => {
  it("hides confirmed status labels", () => {
    const { container } = render(
      <StatusBadge en="Confirmed" ja="確認済み" status="confirmed" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows preparation status labels", () => {
    render(<StatusBadge en="In preparation" ja="準備中" status="pending" />);

    expect(screen.getByText("準備中")).toBeInTheDocument();
    expect(screen.getByText("In preparation")).toBeInTheDocument();
  });
});
