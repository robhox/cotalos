import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { LegalDisclaimer } from "@/components/legal-disclaimer";

describe("LegalDisclaimer a11y", () => {
  it("has no critical axe violations", async () => {
    const { container } = render(<LegalDisclaimer />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
