import { render } from "@testing-library/react";
import Home from "@/pages/index";
// NEXT LINE TO BE REMOVED LATER
// eslint-disable-next-line no-unused-vars
import { useSession } from "next-auth/react";
// import knex from "../../knex/knex";

jest.mock("next-auth/react");

describe("End-to-end testing", () => {
  test("Render index.js component", () => {
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
    render(<Home />);
  });
});
