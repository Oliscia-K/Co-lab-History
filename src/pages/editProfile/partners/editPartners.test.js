import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import EditPartners from "./index";
import AddPartners from "./add";

jest.mock("next-auth/react");
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("Testing EditPartners componenet", () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
  });

  test("ScrollBar component is on the page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditPartners currentUser={mockedUser} />);
    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  test("Add, delete, and back buttons are on the page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditPartners currentUser={mockedUser} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Back" })).toBeVisible();
  });

  test("Add button redirects user to add page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditPartners currentUser={mockedUser} />);
    const addButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/editProfile/partners/add");
  });

  test("Back button redirects user to homepage", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditPartners currentUser={mockedUser} />);
    const backButton = screen.getByRole("button", { name: "Back" });
    fireEvent.click(backButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  test("User's partners are fetched from API", async () => {
    // Mock fetch
    const mockPartners = [{ name: "Partner 1" }, { name: "Partner 2" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            partners: mockPartners,
          }),
      }),
    );

    render(<AddPartners />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/user/1/userProfile");
      expect(screen.getByText("Partner 1")).toBeInTheDocument();
      expect(screen.getByText("Partner 2")).toBeInTheDocument();
      // Add more assertions if there are UI changes
    });

    global.fetch.mockRestore();
  });

  // test("makes API call with correct userId", async () => {
  //   await act(async () => {
  //     render(<EditPartners/>);
  //   });

  //   expect(global.fetch).toHaveBeenCalledWith("/api/user/3/userProfile");
  // });
});
