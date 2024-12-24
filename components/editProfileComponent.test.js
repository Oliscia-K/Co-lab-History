import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { SessionProvider } from "next-auth/react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import UserProfile from "../src/pages/user/[id]/userProfile/index";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the next/link component
jest.mock("next/link", () => {
  function NextLink({ children, href }) {
    return <a href={href}>{children}</a>;
  }

  NextLink.propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
  };

  NextLink.displayName = "NextLink";

  return NextLink;
});

// Mock the ProfileComponent - Updated path
jest.mock("./ProfileComponent", () => {
  function MockProfileComponent({ size }) {
    return (
      <div data-testid="profile-component" data-size={size}>
        Profile Component
      </div>
    );
  }

  MockProfileComponent.propTypes = {
    size: PropTypes.string.isRequired,
  };

  MockProfileComponent.displayName = "MockProfileComponent";

  return MockProfileComponent;
});

// Mock session data
const mockSession = {
  user: {
    id: "3",
    name: "Test User",
    email: "test@example.com",
  },
  expires: "2025-12-31T23:59:59.999Z",
};

// Mock fetch API
const mockProfileData = {
  bio: "Test bio content",
  interests: "Test project interests",
  classes: [
    { name: "Class 1", progress: false },
    { name: "Class 2", progress: true },
  ],
  partners: [
    { name: "Partner 1", email: "partner1@test.com" },
    { name: "Partner 2", email: "partner2@test.com" },
  ],
};

// Mock helper functions
const renderWithSessionProvider = (component, session = mockSession) =>
  render(<SessionProvider session={session}>{component}</SessionProvider>);

beforeEach(() => {
  // Mock fetch API
  global.fetch = jest.fn((url) => {
    if (url === "/api/user/3/userProfile") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfileData),
      });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });

  // Mock useRouter
  useRouter.mockReturnValue({
    query: { id: "3" },
    push: jest.fn(),
    prefetch: jest.fn(),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserProfile Component", () => {
  test("renders component structure correctly", async () => {
    await act(async () => {
      renderWithSessionProvider(<UserProfile />);
    });

    expect(screen.getByText("Bio:")).toBeInTheDocument();
    expect(screen.getByText("Project Interests:")).toBeInTheDocument();
    expect(screen.getByText("Classes:")).toBeInTheDocument();
    expect(screen.getByText("Past Partners:")).toBeInTheDocument();
  });

  test("renders loading state initially", () => {
    renderWithSessionProvider(<UserProfile />);

    expect(screen.getByText("Loading bio...")).toBeInTheDocument();
    expect(screen.getByText("Loading interests...")).toBeInTheDocument();
    expect(screen.getByText("Loading classes...")).toBeInTheDocument();
    expect(screen.getByText("Loading partners...")).toBeInTheDocument();
  });

  test("renders profile data after successful fetch", async () => {
    await act(async () => {
      renderWithSessionProvider(<UserProfile />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test bio content")).toBeInTheDocument();
      expect(screen.getByText("Test project interests")).toBeInTheDocument();
      expect(screen.getByText("Class 1 - in progress")).toBeInTheDocument();
      expect(screen.getByText("Class 2 - completed")).toBeInTheDocument();
      expect(screen.getByText("Partner 1")).toBeInTheDocument();
      expect(screen.getByText("Partner 2")).toBeInTheDocument();
    });
  });

  test("makes API call with correct userId", async () => {
    await act(async () => {
      renderWithSessionProvider(<UserProfile />);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/user/3/userProfile");
  });

  test("renders with correct CSS classes", () => {
    const { container } = renderWithSessionProvider(<UserProfile />);

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".middleSection")).toBeInTheDocument();
    expect(container.querySelector(".bottomSection")).toBeInTheDocument();
    expect(container.querySelector(".bio")).toBeInTheDocument();
    expect(container.querySelector(".projectInterests")).toBeInTheDocument();
    expect(container.querySelector(".classes")).toBeInTheDocument();
    expect(container.querySelector(".partner")).toBeInTheDocument();
  });

  test("renders edit buttons with correct links", async () => {
    // Arrange
    const mockSession2 = {
      user: { id: 3, email: "test@example.com" },
      expires: "2030-01-01",
    };

    const mockCurrentUser = {
      id: 3,
      bio: "Test bio",
      interests: "Test interests",
      classes: [{ name: "Class 1", progress: true }],
      partners: [{ name: "Partner 1", email: "partner1@test.com" }],
    };

    renderWithSessionProvider(
      <UserProfile currentUser={mockCurrentUser} setCurrentUser={jest.fn()} />,
      mockSession2,
    );

    const editLinks = await screen.findAllByRole("link", { name: /edit/i });

    expect(editLinks).toHaveLength(4);
    expect(editLinks[0]).toHaveAttribute("href", "/editProfile/main/");
    expect(editLinks[1]).toHaveAttribute("href", "/editProfile/main/");
    expect(editLinks[2]).toHaveAttribute("href", "/editProfile/classes/");
    expect(editLinks[3]).toHaveAttribute("href", "/editProfile/partners/");
  });

  // test("handles fetch error gracefully", async () => {
  // const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  // Mock fetch to return a failing response
  // global.fetch = jest.fn(() =>
  // Promise.resolve({
  // ok: false,
  // json: () => Promise.resolve({ message: "Unknown endpoint" }),
  // })
  // );

  // render(
  // <SessionProvider session={mockSession}>
  // <UserProfile currentUser={null} setCurrentUser={jest.fn()} />
  // </SessionProvider>
  // );

  // await waitFor(() => {
  // Expect a specific console log message structure
  // expect(consoleLogSpy).toHaveBeenCalledWith(
  // "Error fetching user profile:",
  // expect.anything() // Use `anything()` to allow for various error structures
  // );
  // });

  // consoleLogSpy.mockRestore();
  // });

  test("renders partner email links correctly", async () => {
    await act(async () => {
      renderWithSessionProvider(<UserProfile />);
    });

    await waitFor(() => {
      const emailLinks = screen
        .getAllByRole("link")
        .filter((link) => link.href.startsWith("mailto:"));

      expect(emailLinks[0]).toHaveAttribute("href", "mailto:partner1@test.com");
      expect(emailLinks[1]).toHaveAttribute("href", "mailto:partner2@test.com");
    });
  });
});
