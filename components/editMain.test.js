import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import PropTypes from "prop-types";
import { SessionProvider } from "next-auth/react";
import EditMain from "../src/pages/editProfile/main/index";

// Mock useRouter
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

// Wrapper for SessionProvider
function Wrapper({ children }) {
  return <SessionProvider
    session={{
      user: {
        email: "test@middlebury.edu",
        name: "Test User",
      },
      expires: "2024-01-01",
    }}
  >
    {children}
  </SessionProvider>
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// Mock the Editor component
jest.mock("./Editor", () => {
  function MockEditor({ complete, currentUser }) {
    const isDisabled = !currentUser?.name; // Disable if name is missing

    const handleSave = () => {
      complete({
        id: currentUser.id,
        name: currentUser.name || "Edited Name",
        pronouns: currentUser.pronouns || "they/them",
        gradYear: currentUser.gradYear || "2024",
        bio: currentUser.bio || "Edited bio",
        interests: currentUser.interests || "Edited interests",
      });
    };

    return (
      <div data-testid="editor">
        <div>Current User: {currentUser.name}</div>
        <button type="button" disabled={isDisabled} onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={() => complete(null)}>
          Cancel
        </button>
      </div>
    );
  }

  MockEditor.propTypes = {
    complete: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      pronouns: PropTypes.string,
      gradYear: PropTypes.string,
      bio: PropTypes.string,
      interests: PropTypes.string,
    }).isRequired,
  };

  MockEditor.displayName = "MockEditor";
  return MockEditor;
});

// Mock data
const mockCurrentUser = {
  id: 28,
  name: "Test User",
  pronouns: "they/them",
  major: "Computer Science",
  gradYear: "2024",
  bio: "Test bio",
  interests: "Test interests",
};

const mockSetCurrentUser = jest.fn();

describe("EditMain Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );
    mockRouter.push.mockReset();
    mockRouter.back.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Editor component with current user data", () => {
    render(
      <EditMain
        currentUser={mockCurrentUser}
        setCurrentUser={mockSetCurrentUser}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByTestId("editor")).toBeInTheDocument();
    expect(screen.getByText("Current User: Test User")).toBeInTheDocument();
  });

  test("handles successful profile update", async () => {
    render(
      <EditMain
        currentUser={mockCurrentUser}
        setCurrentUser={mockSetCurrentUser}
      />,
      { wrapper: Wrapper },
    );

    await act(async () => {
      screen.getByText("Save").click();
    });

    const bodyData = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(bodyData).toMatchObject({
      id: 28,
      name: "Test User",
      bio: "Test bio",
      interests: "Test interests", // Ensure this field is included
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

    render(
      <EditMain
        currentUser={mockCurrentUser}
        setCurrentUser={mockSetCurrentUser}
      />,
      { wrapper: Wrapper },
    );

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
    render(
      <EditMain
        currentUser={mockCurrentUser}
        setCurrentUser={mockSetCurrentUser}
      />,
      { wrapper: Wrapper },
    );

    await act(async () => {
      screen.getByText("Cancel").click();
    });

    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("saves edited data when changes are made and save is clicked", async () => {
    const editedUser = {
      id: 28,
      name: "Edited Name",
      pronouns: "they/them",
      gradYear: "2024",
      bio: "Edited bio",
      interests: "Edited interests",
    };

    render(
      <EditMain currentUser={editedUser} setCurrentUser={mockSetCurrentUser} />,
      { wrapper: Wrapper },
    );

    await act(async () => {
      screen.getByText("Save").click();
    });

    const bodyData = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(bodyData).toMatchObject({
      id: 28,
      name: "Edited Name",
      bio: "Edited bio",
      interests: "Edited interests",
    });
  });

  test("save button is disabled when required fields are empty", async () => {
    render(
      <EditMain
        currentUser={{ ...mockCurrentUser, name: "" }}
        setCurrentUser={mockSetCurrentUser}
      />,
      { wrapper: Wrapper },
    );

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();

    await act(async () => {
      saveButton.click();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
