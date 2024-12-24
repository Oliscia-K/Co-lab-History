// import { testApiHandler } from "next-test-api-route-handler";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import Post from "../../components/Post";
import Feed from "../pages/myPosts/index";
// import Create from "../pages/feed/create";

jest.mock("next-auth/react");
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("Testing Post component", () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
  });

  test("Post component is rendered correctly", () => {
    render(
      <Post
        title="Test Title"
        content="Test Content"
        creator="test@middlebury.edu"
        edited="December 6, 2024 at 7:36 PM"
        edit={false}
        id={1}
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("December 6, 2024 at 7:36 PM")).toBeInTheDocument();
  });

  test("If post can be editted, then it will have the appropriate edit and delete buttons", () => {
    render(
      <Post
        title="Test Title"
        content="Test Content"
        creator="test@middlebury.edu"
        edited="December 6, 2024 at 7:36 PM"
        edit
        id={1}
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("December 6, 2024 at 7:36 PM")).toBeInTheDocument();

    const editButton = screen.getByRole("link", { name: "Edit" });
    expect(editButton).toHaveAttribute("href", "/myPosts/1");

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("When a user deletes their own post, DELETE api is called, and user navigates to /", async () => {
    const mockData = { name: "Tester", email: "test@middlebury.edu", id: "1" };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(
      <Post
        title="Test Title"
        content="Test Content"
        creator="test@middlebury.edu"
        edited="December 6, 2024 at 7:36 PM"
        edit
        id={1}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`/api/posts/${mockData.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  test("Information about the poster of a post is properly fetched", () => {
    const mockData = { name: "Tester", email: "test@middlebury.edu" };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(
      <Post
        title="Test Title"
        content="Test Content"
        creator="test@middlebury.edu"
        edited="December 6, 2024 at 7:36 PM"
        edit
        id={1}
      />,
    );

    expect(fetch).toHaveBeenCalledWith(`/api/login?email=${mockData.email}`);
  });

  //  this is in components/Post
  test("If a user creates a post and clicks submit, handleSubmit is properly called", () => {});

  //  this is in feed/create
  test("If user a clicks delete on their post, handleDelete is properly called", () => {
    render(<Feed />);

    // await testApiHandler({
    //   rejectOnHandlerError: true,
    //   pagesHandler: Post,
    //   params: {id: 0},
    //   test: async ({ fetch }) => {
    //     const res = await fetch({
    //       method: "DELETE",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //     });
    //     expect(res.status).toBe(200);

    //   },
    // });
  });
});
