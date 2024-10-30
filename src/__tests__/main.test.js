import { render } from "@testing-library/react";
import Home from "@/pages/index";
// NEXT LINE TO BE REMOVED LATER
// eslint-disable-next-line no-unused-vars
import knex from "../../knex/knex";

describe("End-to-end testing", () => {
  test("Render index.js component", () => {
    render(<Home />);
  });
});
