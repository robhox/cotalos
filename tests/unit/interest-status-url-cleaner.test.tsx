import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock
  })
}));

import { InterestStatusUrlCleaner } from "@/components/interest-status-url-cleaner";

describe("InterestStatusUrlCleaner", () => {
  it("replaces the current url with canonical path", async () => {
    render(<InterestStatusUrlCleaner canonicalPath="/boucherie/test-slug" />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/boucherie/test-slug", { scroll: false });
    });
  });
});
