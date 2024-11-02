import React from "react";
import { render, screen } from "@testing-library/react";
import ClassesScrollBar from "./ClassesScrollBar";

describe("Testing ClassesScrollBar component", () => {
  test("renders a list of classes taken", () => {
    const classesTaken = [
      { id: 1, name: "CSCI 201" },
      { id: 2, name: "CSCI 202" },
      { id: 3, name: "CSCI 318" },
    ];

    render(<ClassesScrollBar classesTaken={classesTaken} />);

    classesTaken.forEach((classItem) => {
      expect(screen.getByText(classItem.name)).toBeVisible();
    });
  });
});