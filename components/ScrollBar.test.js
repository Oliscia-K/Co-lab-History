import React from "react";
import { render, screen } from "@testing-library/react";
import ScrollBar from "./ScrollBar";

describe("Testing ScrollBar component", () => {
  test("renders a list of previous partners", () => {
    const previousPartners = [
      { id: 1, name: "Previous Partner 1" },
      { id: 2, name: "Previous Partner 2" },
      { id: 3, name: "Previous Partner 3" },
    ];

    render(<ScrollBar previousPartners={previousPartners} />);

    previousPartners.forEach((partner) => {
      expect(screen.getByText(partner.name)).toBeVisible();
    });
  });
});
