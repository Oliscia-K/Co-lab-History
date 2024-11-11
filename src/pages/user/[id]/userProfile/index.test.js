import { render, screen, waitFor } from "@testing-library/react";
import PropTypes from "prop-types";
import { act } from "react-dom/test-utils";
import UserProfile from "./index";

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

// Mock the ProfileComponent
jest.mock("../../../../../components/ProfileComponent", () => {
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

// Mock fetch API
const mockProfileData = {
  bio: "Test bio content",
  interests: "Test project interests",
  classes: [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
  ],
  partners: [
    { id: 1, name: "Partner 1", email: "partner1@test.com" },
    { id: 2, name: "Partner 2", email: "partner2@test.com" },
  ],
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfileData),
    }),
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserProfile Component", () => {
  // Test for initial render and structure
  test("renders component structure correctly", () => {
    render(<UserProfile />);

    // Check for main sections
    expect(screen.getByTestId("profile-component")).toHaveAttribute(
      "data-size",
      "large",
    );
    expect(screen.getByText("Bio:")).toBeInTheDocument();
    expect(screen.getByText("Project Interests:")).toBeInTheDocument();
    expect(screen.getByText("Classes:")).toBeInTheDocument();
    expect(screen.getByText("Past Partners:")).toBeInTheDocument();
  });

  // Test loading states
  test("renders loading state initially", () => {
    render(<UserProfile />);

    expect(screen.getByText("Loading bio...")).toBeInTheDocument();
    expect(screen.getByText("Loading interests...")).toBeInTheDocument();
    expect(screen.getByText("Loading classes...")).toBeInTheDocument();
    expect(screen.getByText("Loading partners...")).toBeInTheDocument();
  });

  // Test API call
  test("makes API call with correct userId", async () => {
    await act(async () => {
      render(<UserProfile />);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/user/3/userProfile");
  });

  // Test successful data rendering
  test("renders profile data after successful fetch", async () => {
    await act(async () => {
      render(<UserProfile />);
    });

    await waitFor(() => {
      // Bio section
      expect(screen.getByText("Test bio content")).toBeInTheDocument();

      // Project Interests section
      expect(screen.getByText("Test project interests")).toBeInTheDocument();

      // Classes section
      expect(screen.getByText("Class 1")).toBeInTheDocument();
      expect(screen.getByText("Class 2")).toBeInTheDocument();

      // Partners section
      expect(screen.getByText("Partner 1")).toBeInTheDocument();
      expect(screen.getByText("Partner 2")).toBeInTheDocument();
    });
  });

  // Test CSS classes
  test("renders with correct CSS classes", async () => {
    const { container } = render(<UserProfile />);

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".middleSection")).toBeInTheDocument();
    expect(container.querySelector(".bottomSection")).toBeInTheDocument();
    expect(container.querySelector(".bio")).toBeInTheDocument();
    expect(container.querySelector(".projectInterests")).toBeInTheDocument();
    expect(container.querySelector(".classes")).toBeInTheDocument();
    expect(container.querySelector(".partner")).toBeInTheDocument();
  });

  // Test edit buttons
  test("renders edit buttons with correct links", async () => {
    await act(async () => {
      render(<UserProfile />);
    });

    const editButtons = screen.getAllByText("Edit");
    expect(editButtons).toHaveLength(4);

    // Check each edit button's link
    const [bioEdit, interestsEdit, classesEdit, partnersEdit] = editButtons;

    expect(bioEdit.closest("a")).toHaveAttribute("href", "/editProfile/main/");
    expect(interestsEdit.closest("a")).toHaveAttribute(
      "href",
      "/editProfile/main/",
    );
    expect(classesEdit.closest("a")).toHaveAttribute(
      "href",
      "/editProfile/classes/",
    );
    expect(partnersEdit.closest("a")).toHaveAttribute(
      "href",
      "/editProfile/partners/",
    );
  });

  // Test error handling
  test("handles fetch error gracefully", async () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );

    await act(async () => {
      render(<UserProfile />);
    });

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Error fetching user profile:",
        expect.any(Error),
      );
    });

    consoleLogSpy.mockRestore();
  });

  // Test email links
  test("renders partner email links correctly", async () => {
    await act(async () => {
      render(<UserProfile />);
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
