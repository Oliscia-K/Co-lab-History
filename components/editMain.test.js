import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import PropTypes from "prop-types";
import EditMain from "../src/pages/editProfile/main/index";

// Mock useRouter at the top level
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

// Mock the Editor component
jest.mock("./Editor", () => {
  function MockEditor({ complete, currentUser }) {
    return (
      <div data-testid="editor">
        <button
          type="button"
          onClick={() =>
            complete({
              name: "Test Name",
              pronouns: "they/them",
              gradYear: "2024",
              bio: "Test bio",
              projectInterests: "Test interests",
            })
          }
        >
          Save
        </button>
        <button type="button" onClick={() => complete(null)}>
          Cancel
        </button>
        <div>Current User: {currentUser?.name}</div>
      </div>
    );
  }

  MockEditor.propTypes = {
    complete: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      name: PropTypes.string,
    }),
  };

  MockEditor.defaultProps = {
    currentUser: {
      name: "",
    },
  };

  MockEditor.displayName = "MockEditor";
  return MockEditor;
});

const mockCurrentUser = {
  id: 28,
  name: "Test User",
  pronouns: "they/them",
  major: "Computer Science",
  gradYear: "2024",
  bio: "Test bio",
  projectInterests: "Test interests",
};

describe("EditMain Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );
    // Reset router mock
    mockRouter.push.mockReset();
    mockRouter.back.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Editor component with current user data", () => {
    render(<EditMain currentUser={mockCurrentUser} />);

    expect(screen.getByTestId("editor")).toBeInTheDocument();
    expect(
      screen.getByText(`Current User: ${mockCurrentUser.name}`),
    ).toBeInTheDocument();
  });

  test("handles successful profile update", async () => {
    render(<EditMain currentUser={mockCurrentUser} />);

    await act(async () => {
      screen.getByText("Save").click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/editProfile",
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      }),
    );

    const bodyData = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(bodyData).toMatchObject({
      id: 28,
      name: "Test Name",
      email: "test@middlebury.edu",
      major: "Computer Science",
      "grad-year": "2024",
      "profile-pic": [],
      bio: "Test bio",
      interests: "Test interests",
      classes: [
        {
          name: "CSCI 318",
          status: "in progress",
        },
      ],
      partners: [
        {
          name: "Oliscia Thornton",
          email: "okthornton@middlebury.edu",
        },
        {
          name: "Seunghwan Oh",
          email: "seunghwano@middlebury.edu",
        },
      ],
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/user/28/userProfile");
    });
  });

  test("handles network error during update", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(<EditMain currentUser={mockCurrentUser} />);

    await act(async () => {
      screen.getByText("Save").click();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating article:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  test("navigates back on cancel", async () => {
    render(<EditMain currentUser={mockCurrentUser} />);

    await act(async () => {
      screen.getByText("Cancel").click();
    });

    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("uses default props when no currentUser provided", () => {
    render(<EditMain />);
    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  test("submits form with all required fields", async () => {
    render(<EditMain currentUser={mockCurrentUser} />);

    await act(async () => {
      screen.getByText("Save").click();
    });

    const bodyData = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(bodyData).toHaveProperty("name");
    expect(bodyData).toHaveProperty("email");
    expect(bodyData).toHaveProperty("bio");
    expect(bodyData).toHaveProperty("interests");
  });
});
