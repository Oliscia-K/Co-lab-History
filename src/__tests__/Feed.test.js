/* eslint-disable import/no-extraneous-dependencies */
import { testApiHandler } from "next-test-api-route-handler";
import { render, screen, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import postsEndpoint from "../pages/api/posts/index";
import FeedpageComponent from "../../components/FeedpageComponent";
import testPosts from "../../data/posts.json";
import Create from "../pages/feed/create";
import knex from "../../knex/knex";

jest.mock("next-auth/react");
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("Testing the Feed", () => {
  beforeAll(() =>
    // Ensure test database is initialized before an tests
    knex.migrate.rollback().then(() => knex.migrate.latest()),
  );

  afterAll(() =>
    // Ensure database connection is cleaned up after all tests
    knex.destroy(),
  );

  beforeEach(() =>
    // Reset contents of the test database
    knex.seed.run(),
  );

  beforeEach(() => {
    useSession.mockReturnValue({
      data: {
        user: { email: "test@middlebury.edu", id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
  });

  test("Fetches and displays posts on mount", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(testPosts),
    });

    render(<FeedpageComponent />);

    expect(screen.getByTestId("feedHeader")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getByText(testPosts[0].content)).toBeInTheDocument();
      expect(screen.getByText(testPosts[1].content)).toBeInTheDocument();
    });
  });

  test("The proper elements are rendering on the page to create posts", () => {
    render(<Create />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Title:")).toBeInTheDocument();
    expect(screen.getByText("Content:")).toBeInTheDocument();
    expect(screen.getByTestId("titleBox")).toBeInTheDocument();
    expect(screen.getByTestId("contentBox")).toBeInTheDocument();
  });

  test("GET /api/posts should populate the feed with all posts", async () => {
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: postsEndpoint,
      params: { id: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        const res = await fetch();
        await expect(res.json()).resolves.toMatchObject(testPosts.reverse());
      },
    });
  });

  test("PUT /api/posts should create a new post in the database", async () => {
    const testPost = {
      title: "Test Post",
      content: "This is a test post",
      creator: "test@middlebury.edu",
      edited: "2024-11-12T00:00:00.000Z",
    };

    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: postsEndpoint,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            newPost: {
              creator: `${testPost.creator}`,
              title: `${testPost.title}`,
              content: `${testPost.content}`,
              edited: `${testPost.edited}`,
            },
          }),
        });
        const resPost = await res.json();
        expect(resPost).toMatchObject({
          ...testPost,
        });
      },
    });
  });

  test("POST /api/posts will update an existing post in the database", async () => {
    const newPost = { id: 1, ...testPosts[0], title: "New Title" };
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: postsEndpoint,
      params: { id: newPost.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            alteredPost: {
              id: 1,
              creator: testPosts[0].creator,
              title: "New Title",
              content: testPosts[0].content,
              edited: testPosts[0].edited,
            },
          }),
        });
        const resPost = await res.json();
        expect(resPost).toMatchObject([newPost]);
      },
    });
  });

  test("Posts from only a specific user can be fetched from the database", async () => {
    const specificPost = testPosts.filter(
      (post) => post.creator === "chudson@middlebury.edu",
    );
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: postsEndpoint,
      params: { email: "chudson@middlebury.edu" }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        const res = await fetch();
        await expect(res.json()).resolves.toMatchObject(specificPost);
      },
    });
  });

  //   test("Upon pressing the submit button, post is sent to the database with proper title and content", async () => {

  //     global.fetch = jest.fn(() =>
  //             Promise.resolve({
  //                 ok: true,
  //                 json: () => Promise.resolve([{id: 1}]),
  //             })
  //       );

  //     render(<Create/>);

  //     expect(global.fetch).toHaveBeenCalledWith("/api/login?email=test@middlebury.edu");

  //     const titleBox = screen.getByTestId("titleBox");
  //     const contentBox = screen.getByTestId("contentBox");

  //     expect(screen.getByTestId("titleBox")).toBeInTheDocument();
  //     expect(screen.getByTestId('contentBox')).toBeInTheDocument();

  //     const submitButton = screen.getByRole("button", {name: "SUBMIT"});

  //     fireEvent.change(titleBox, { target: { value: "Test Title" } });
  //     expect(titleBox.value).toBe('Test Title');
  //     fireEvent.change(contentBox, { target: { value: "Test Content" }});
  //     expect(contentBox.value).toBe('Test Content');

  //     await waitFor(() => {
  //     fireEvent.submit(submitButton);
  //     });
});
