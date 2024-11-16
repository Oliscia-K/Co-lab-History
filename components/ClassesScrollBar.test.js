import React from "react";
import { render, screen } from "@testing-library/react";
import ClassesScrollBar from "./ClassesScrollBar";

jest.mock("../src/styles/Classes.module.css", () => ({
  classesContainer: "mocked-classesContainer",
}));

describe("Testing ClassesScrollBar component", () => {
  test("renders a list of classes taken with their progress status", () => {
    const classesTaken = [
      { name: "CSCI 201", progress: true },
      { name: "CSCI 202", progress: false },
      { name: "CSCI 318", progress: true },
    ];

    render(<ClassesScrollBar classesTaken={classesTaken} />);

    classesTaken.forEach((classItem) => {
      const listItem = screen.getByText(
        new RegExp(`${classItem.name} - ${classItem.progress ? "completed" : "in progress"}`, "i")
      );
      expect(listItem).toBeVisible();
    });
  });

  test("renders empty container when no classes are provided", () => {
    const { container } = render(<ClassesScrollBar classesTaken={[]} />);
    expect(container.firstChild).toHaveClass("mocked-classesContainer");
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  test("renders the correct number of list items", () => {
    const classesTaken = [
      { name: "CSCI 101", progress: true },
      { name: "CSCI 102", progress: false },
      { name: "CSCI 103", progress: true },
    ];
  
    render(<ClassesScrollBar classesTaken={classesTaken} />);
  
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(classesTaken.length);
  });
});