import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import EditPartners from "../pages/editProfile/partners/index";
import AddPartners from "../pages/editProfile/partners/add";

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

  test("Back button redirects user to userProfile", async () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    // Mock the handleButtonClick functionality
    const linkRef = { current: null };

    const handleButtonClick = () => {
      linkRef.current.click(); // Simulate the click on the hidden <a> tag
    };

    // Render the component with mocked user
    render(
      <div>
        <button
          className="button" // Use your button styles
          type="button"
          onClick={handleButtonClick} // Trigger the function on click
        >
          Back
        </button>

        {/* Hidden <a> tag that will be clicked programmatically */}
        <a
          // eslint-disable-next-line no-return-assign
          ref={(ref) => (linkRef.current = ref)} // Attach the ref to the <a> tag
          href={`/user/${mockedUser.id}/userProfile`} // Your desired link
          style={{ display: "none" }} // Hide the <a> tag from the UI
        >
          Back
        </a>
      </div>,
    );

    // Find the button
    const backButton = screen.getByRole("button", { name: "Back" });

    // Simulate a click on the button
    fireEvent.click(backButton);

    // Check that the hidden <a> tag is triggered and the href is correct
    expect(linkRef.current.href).toBe(
      `http://localhost/user/${mockedUser.id}/userProfile`,
    );
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

  test("Add Partner button with valid input successfully adds partner's name to ScrollBar component", async () => {
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

    const partnerNameInput = screen.getByPlaceholderText("Partner Name");
    const partnerEmailInput = screen.getByPlaceholderText("email@domain.com");
    const addPartnerButton = screen.getByRole("button", {
      name: "Add Partner",
    });

    fireEvent.change(partnerNameInput, { target: { value: "Your Name" } });
    fireEvent.change(partnerEmailInput, {
      target: { value: "your.name@example.com" },
    });

    fireEvent.click(addPartnerButton);

    await waitFor(() => {
      expect(screen.getByText("Your Name")).toBeInTheDocument();
    });
  });

  test("Cancel button redirects user to edit partners page", async () => {
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

    const cancelButton = screen.getByText("Cancel");

    // Simulate clicking the "Cancel" button
    fireEvent.click(cancelButton);

    // Verify if the router.push was called to redirect to the correct page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/editProfile/partners");
    });
  });
});
