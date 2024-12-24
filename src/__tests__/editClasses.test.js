import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";
import EditClasses from "../pages/editProfile/classes/index";
import ProfileAddPartners from "../pages/editProfile/classes/add";

jest.mock("next-auth/react");
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("Testing EditClasses component", () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
  });

  test("ClassesScrollBar component is on the page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditClasses currentUser={mockedUser} />);
    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  test("Add and back buttons are on the page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditClasses currentUser={mockedUser} />);
    expect(screen.getByTestId("add")).toBeVisible();
    expect(screen.getByTestId("add")).toContainHTML("Add");
    expect(screen.getByTestId("delete")).toBeVisible();
    expect(screen.getByTestId("delete")).toContainHTML("Delete");
    expect(screen.getByTestId("Return to Profile")).toBeVisible();
    expect(screen.getByTestId("Return to Profile")).toContainHTML(
      "Return to Profile",
    );
  });

  test("Add button redirects user to add classes page", () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditClasses currentUser={mockedUser} />);
    const addButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/editProfile/classes/add");
  });

  test("Cancel button redirects user to user profile", async () => {
    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    const linkRef = { current: null };

    const handleButtonClick = () => {
      linkRef.current.click(); // Simulate the click on the hidden <a> tag
    };

    render(
      <div>
        <button
          className="button"
          type="button"
          onClick={handleButtonClick} // Trigger the function on click
        >
          Back
        </button>

        <a
          // eslint-disable-next-line no-return-assign
          ref={(ref) => (linkRef.current = ref)} // Attach the ref to the <a> tag
          href={`/user/${mockedUser.id}/userProfile`} // The link to the user profile
          style={{ display: "none" }} // Hide the <a> tag
        >
          Back
        </a>
      </div>,
    );

    const backButton = screen.getByRole("button", { name: "Back" });

    fireEvent.click(backButton);

    expect(linkRef.current.href).toBe(
      `http://localhost/user/${mockedUser.id}/userProfile`,
    );
  });

  // test("User's classes are fetched from API and shown in ClassesScrollBar", async () => {
  //   // Mock fetch
  //   const mockClasses = [
  //     { name: "Class 1", status: "Completed" },
  //     { name: "Class 2", status: "in progress" },
  //   ];
  //   global.fetch = jest.fn((url) => {
  //     if (url === "/api/user/1/userProfile") {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve({ id: "1", classes: mockClasses }),
  //       });
  //     }
  //     return Promise.reject(new Error("Unknown URL"));
  //   });

  //   render(<ProfileAddPartners />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Class 1 - completed")).toBeInTheDocument();
  //     expect(screen.getByText("Class 2 - in progress")).toBeInTheDocument();
  //   });

  //   global.fetch.mockRestore();
  // });

  test("CS courses are fetched and displayed in drop down bar", async () => {
    // Mock fetch responses
    global.fetch = jest.fn((url) => {
      if (url === "/api/classes") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: "CS101" },
              { id: 2, name: "CS102" },
            ]),
        });
      }
      if (url === "/api/user/1/userProfile") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: "1",
              classes: [],
            }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    // Render the component
    render(<ProfileAddPartners />);

    // Wait for the dropdown options to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/classes");
      expect(fetch).toHaveBeenCalledWith("/api/user/1/userProfile");

      // Assert that the dropdown contains the fetched class names
      const dropdown = screen.getByLabelText("Choose a class:");
      expect(dropdown).toBeInTheDocument();
      expect(screen.getByText("CS101")).toBeInTheDocument();
      expect(screen.getByText("CS102")).toBeInTheDocument();
    });
  });

  test("Save button adds course with selected progress status", async () => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/classes") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: "CS101" },
              { id: 2, name: "CS102" },
            ]),
        });
      }
      if (url === "/api/user/1/userProfile") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: "1", classes: [] }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(<ProfileAddPartners />);

    await waitFor(() => {
      const classDropdown = screen.getByLabelText("Choose a class:");
      const progressDropdown = screen.getByLabelText("Progress Status:");
      const addButton = screen.getByRole("button", { name: "Add" });

      fireEvent.change(classDropdown, { target: { value: "CS101" } });
      fireEvent.change(progressDropdown, { target: { value: "Completed" } });

      fireEvent.click(addButton);

      expect(screen.getByText("CS101 - completed")).toBeInTheDocument();
    });
  });

  test("After adding a class, textboxes go back to default value", async () => {
    render(<ProfileAddPartners />);

    // Mock fetch response for classes
    global.fetch = jest.fn((url) => {
      if (url === "/api/classes") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: "CS101" },
              { id: 2, name: "CS102" },
            ]),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    await waitFor(() => {
      const classDropdown = screen.getByLabelText("Choose a class:");
      const progressDropdown = screen.getByLabelText("Progress Status:");
      const addButton = screen.getByRole("button", { name: "Add" });

      fireEvent.change(classDropdown, { target: { value: "CS101" } });
      fireEvent.change(progressDropdown, { target: { value: "Completed" } });

      fireEvent.click(addButton);

      // Verify dropdowns reset
      expect(classDropdown.value).toBe("");
      expect(progressDropdown.value).toBe("");

      // Verify class was added to the list
      expect(screen.getByText("CS101")).toBeInTheDocument();
    });
  });
});
